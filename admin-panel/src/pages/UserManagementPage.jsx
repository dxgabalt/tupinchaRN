import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { AuthService } from "../services/AuthService";
import { ServiceService } from "../services/Service.Service";
import { ProvinciaService } from "../services/ProvinciaService";
import { MunicipioService } from "../services/MunicipioService";

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState("");

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    especialidad: "",
    descripcion: "",
    correo: "",
    telefono: "",
    password: "",
    imagen: "",
  });
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(0);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const usuariosObtenidos = await AuthService.obtenerUsuarios();
        setUsuarios(usuariosObtenidos || []);
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
      }
    };

    cargarUsuarios();
  }, []);
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const servicios = await ServiceService.obtenerTodos();
        setServicios(servicios);
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
      }
    };

    cargarServicios();
  }, []);
  // Obtener las provincias
  useEffect(() => {
    const obtenerProvincias = async () => {
      try {
        const provincias = await ProvinciaService.obtenerTodos();
        setProvincias(provincias);
      } catch (error) {
        console.error("Error obteniendo provincias:", error);
      }
    };
    obtenerProvincias();
  }, []);

  // Obtener municipios cuando una provincia es seleccionada
  useEffect(() => {
    if (provinciaSeleccionada) {
      const obtenerMunicipios = async () => {
        try {
          const municipios = await MunicipioService.obtenerTodos({
            provincia_id: provinciaSeleccionada,
          });
          setMunicipios(municipios);
        } catch (error) {
          console.error("Error obteniendo municipios:", error);
        }
      };
      obtenerMunicipios();
    }
  }, [provinciaSeleccionada]);
  const guardarEdicion = () => {
    setUsuarios((prev) =>
      prev.map((user) =>
        user.id === nuevoUsuario.id 
          ? {
              ...user,
              nombre: nuevoUsuario.nombre,
              especialidad: nuevoUsuario.especialidad,
              descripcion: nuevoUsuario.descripcion,
              correo: nuevoUsuario.correo,
              telefono: nuevoUsuario.telefono,
              imagen: nuevoUsuario.imagen,
            }
          : user
      )
    );
    setModalAbierto(false);
  }
  const togglePremium = async (id, esPremium) => {
    try {
      const nuevoEstado = !esPremium;
      await AuthService.actualizarPremium(id, nuevoEstado);
      setUsuarios((prev) =>
        prev.map((user) =>
          user.provider_id === id ? { ...user, is_premium: nuevoEstado } : user
        )
      );
    } catch (error) {
      console.error("Error actualizando estado premium:", error);
    }
  };
  const editarProveedor = async (usuario) => {
    setModalAbierto(true);
    setNuevoUsuario({
      nombre: usuario.nombre,
      especialidad: usuario.especialidad,
      descripcion: usuario.descripcion,
      correo: usuario.correo,
      telefono: usuario.telefono,
      password: "",
      imagen: usuario.imagen,
    });
    setServicioSeleccionado(usuario.service_id)
    setProvinciaSeleccionada(usuario.provincia_id)
    setMunicipioSeleccionado(usuario.municipio_id);
    setIsEditable(true);
  }
  const agregarUsuario = async () => {
    try {
      if(isEditable){
        guardarEdicion()
      }else{
        const user_id = await AuthService.crearUsuarioAuth(
          nuevoUsuario.correo,
          nuevoUsuario.password
        );
        await AuthService.guardarProveedor(
          user_id,
          nuevoUsuario.nombre,
          nuevoUsuario.telefono,
          true,
          nuevoUsuario.especialidad,
          nuevoUsuario.descripcion,
          municipioSeleccionado,
          servicioSeleccionado
        );
        setUsuarios((prevUsuarios) => [...prevUsuarios, nuevoUsuario]);
        setNuevoUsuario({
          nombre: "",
          especialidad: "",
          descripcion: "",
          correo: "",
          telefono: "",
          password: "",
          imagen: "",
        });
        setModalAbierto(false);
      }
    } catch (error) {
      console.error("Error agregando usuario:", error);
    }
  };

  const eliminarUsuario = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
      setUsuarios((prev) => prev.filter((user) => user.id !== id));
      AuthService.eliminarPerfil(id);
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevoUsuario((prev) => ({ ...prev, imagen: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const nombre = usuario.nombre?.toLowerCase() || "";
    const correo = usuario.correo?.toLowerCase() || "";
    const especialidad = usuario.especialidad?.toLowerCase() || "";

    return (
      nombre.includes(busqueda.toLowerCase()) ||
      correo.includes(busqueda.toLowerCase()) ||
      especialidad.includes(busqueda.toLowerCase())
    );
  });
  const activarUsuario =async(id,estado)=>{
    await AuthService.cambiarEstadoUsuario(id,!estado)
    setUsuarios((prev) =>
      prev.map((user) =>
        user.id_profile === id ? { ...user, estado: !estado?'Activo':'Inactivo' } : user
      )
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>👥 Gestión de Usuarios</h1>

        <input
          type="text"
          placeholder="🔍 Buscar usuario..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />

        <button className="btn-agregar" onClick={() => setModalAbierto(true)}>
          ➕ Agregar Usuario
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Especialidad</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>⭐ Calificación</th>
              <th>Estado</th>
              <th>Premium</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario, index) => (
              <tr key={usuario.id}>
                <td>{index + 1}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.especialidad}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.telefono}</td>
                <td>
                  {usuario.calificacion ? usuario.calificacion + " / 5" : "N/A"}
                </td>
                <td
                  className={
                    usuario.estado === "Activo"
                      ? "estadoActivo"
                      : "estadoSuspendido"
                  }
                >
                  {usuario.estado}
                </td>
                <td>
                  {usuario.tipo === "Proveedor" && (
                    <button
                      className={
                        usuario.is_premium ? "btn-premium" : "btn-no-premium"
                      }
                      onClick={() =>
                        togglePremium(usuario.provider_id, usuario.is_premium)
                      }
                    >
                      {usuario.is_premium ? "✅ Premium" : "❌ No Premium"}
                    </button>
                  )}
                </td>
                <td>
                <button
                      className={
                        usuario.estado ? "btn-premium" : "btn-no-premium"
                      }
                      onClick={() =>
                        activarUsuario(usuario.id_profile,usuario.estado=='Activo')
                      }
                    >
                      {usuario.estado=='Activo' ? "✅ Activo" : "❌ Inactivo"}
                    </button>
                  <button
                    className="btn-ver"
                    onClick={() => {
                      if (usuario && usuario.id) {
                        navigate(`/user-profile/${usuario.id}`, {
                          state: { usuario },
                        });
                      } else {
                        alert("⚠ Error: Usuario no encontrado.");
                      }
                    }}
                  >
                    🔍 Ver Perfil
                  </button>
                  <button
                    className="btn-editar"
                    onClick={() => editarProveedor(usuario)}
                  >
                    ✏ Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarUsuario(usuario.id)}
                  >
                    ❌ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {modalAbierto && (
        <div className="modal">
          <div className="modal-content">
            <h2>Agregar Usuario</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoUsuario.nombre}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Especialidad"
              value={nuevoUsuario.especialidad}
              onChange={(e) =>
                setNuevoUsuario({
                  ...nuevoUsuario,
                  especialidad: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Descripción"
              value={nuevoUsuario.descripcion}
              onChange={(e) =>
                setNuevoUsuario({
                  ...nuevoUsuario,
                  descripcion: e.target.value,
                })
              }
            />
            <input
              type="email"
              placeholder="Correo"
              value={nuevoUsuario.correo}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={nuevoUsuario.password}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Teléfono"
              value={nuevoUsuario.telefono}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })
              }
            />
            <select
            value={servicioSeleccionado}
            onChange={(e) => setServicioSeleccionado(e.target.value)}>
              <option value="">Seleccione una categoria</option>
              {servicios.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.category}
                </option>
              ))}
            </select>
            <div>
              <select
                value={provinciaSeleccionada}
                onChange={(e) => {
                  setProvinciaSeleccionada(e.target.value);
                  setMunicipioSeleccionado(""); // Reiniciar municipio al cambiar de provincia
                }}
              >
                <option value="">Seleccione una provincia</option>
                {provincias.map((provincia) => (
                  <option key={provincia.id} value={provincia.id}>
                    {provincia.nombre}
                  </option>
                ))}
              </select>

              {provinciaSeleccionada && (
                <>
                  <select
                    value={municipioSeleccionado}
                    onChange={(e) => setMunicipioSeleccionado(e.target.value)}
                  >
                    <option value="">Seleccione un municipio</option>
                    {municipios.map((municipio) => (
                      <option key={municipio.id} value={municipio.id}>
                        {municipio.name}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImagenChange} />
            {nuevoUsuario.imagen && (
              <img
                src={nuevoUsuario.imagen}
                alt="Vista previa"
                className="preview-img"
              />
            )}
            <button onClick={agregarUsuario}>✅ Guardar</button>
            <button onClick={() => {setModalAbierto(false)
              setNuevoUsuario({
                nombre: "",
                especialidad: "",
                descripcion: "",
                correo: "",
                telefono: "",
                password: "",
                imagen: "",
              })
              setProvinciaSeleccionada("")
              setMunicipioSeleccionado("")
              setServicioSeleccionado("")
            }}>❌ Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
