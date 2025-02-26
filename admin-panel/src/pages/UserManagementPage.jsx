import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { AuthService } from "../services/AuthService";

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    especialidad: "",
    descripcion: "",
    correo: "",
    telefono: "",
    password: "",
    imagen: "",
  });

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const usuariosObtenidos = await AuthService.obtenerUsuarios();
        console.log(usuariosObtenidos);
        
        setUsuarios(usuariosObtenidos || []);
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
      }
    };

    cargarUsuarios();
  }, []);

  const guardarEdicion = (id, nuevoNombre, nuevoEstado, nuevaCategoria) => {
    setUsuarios((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, nombre: nuevoNombre, estado: nuevoEstado, categoria: nuevaCategoria }
          : user
      )
    );
    AuthService.actualizarPerfilPanel(id, nuevoNombre, nuevoEstado === "Activo" ? 1 : 0);
    setEditandoUsuario(null);
  };
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
  const agregarUsuario = async () => {
    try {
      const user_id = await AuthService.crearUsuarioAuth(nuevoUsuario.correo, nuevoUsuario.password);
      await AuthService.guardarProveedor(user_id, nuevoUsuario.nombre, nuevoUsuario.telefono, true, nuevoUsuario.especialidad, nuevoUsuario.descripcion);
      setUsuarios((prevUsuarios) => [...prevUsuarios, nuevoUsuario]);
      setNuevoUsuario({ nombre: "", especialidad: "", descripcion: "", correo: "", telefono: "", password: "", imagen: "" });
      setModalAbierto(false);
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
                <td>{usuario.calificacion ? usuario.calificacion + " / 5" : "N/A"}</td>
                <td className={usuario.estado === "Activo" ? "estadoActivo" : "estadoSuspendido"}>
                  {usuario.estado}
                </td>
                <td>
                 {usuario.tipo === "Proveedor" &&(
                  <button 
                  className={usuario.is_premium ? "btn-premium" : "btn-no-premium"} 
                  onClick={() => togglePremium(usuario.provider_id, usuario.is_premium)}
                >
                  {usuario.is_premium ? "✅ Premium" : "❌ No Premium"}
                </button>
                 )}
                  
                </td>
                <td>
                  <button className="btn-ver"  onClick={() => {
                      if (usuario && usuario.id) {
                        navigate(`/user-profile/${usuario.id}`, { state: { usuario } });
                      } else {
                        alert("⚠ Error: Usuario no encontrado.");
                      }
                    }}>
                    🔍 Ver Perfil
                  </button>
                  <button className="btn-editar" onClick={() => setEditandoUsuario(usuario.id)}>
                    ✏ Editar
                  </button>
                  <button className="btn-eliminar" onClick={() => eliminarUsuario(usuario.id)}>
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
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
            />
            <input
              type="text"
              placeholder="Especialidad"
              value={nuevoUsuario.especialidad}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, especialidad: e.target.value })}
            />
            <input
              type="text"
              placeholder="Descripción"
              value={nuevoUsuario.descripcion}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, descripcion: e.target.value })}
            />
            <input
              type="email"
              placeholder="Correo"
              value={nuevoUsuario.correo}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
            />            
            <input
              type="password"
              placeholder="Contraseña"
              value={nuevoUsuario.password}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
            />

            <input
              type="text"
              placeholder="Teléfono"
              value={nuevoUsuario.telefono}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })}
            />
            <input type="file" accept="image/*" onChange={handleImagenChange} />
            {nuevoUsuario.imagen && <img src={nuevoUsuario.imagen} alt="Vista previa" className="preview-img" />}
            <button onClick={agregarUsuario}>✅ Guardar</button>
            <button onClick={() => setModalAbierto(false)}>❌ Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;