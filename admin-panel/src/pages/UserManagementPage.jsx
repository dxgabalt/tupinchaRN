import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { AuthService } from "../services/AuthService";
import { ServiceService } from "../services/Service.Service";
import { ProvinciaService } from "../services/ProvinciaService";
import { MunicipioService } from "../services/MunicipioService";
import { ImageService } from "../services/ImageService";

const UserManagementPage = () => {
  const navigate = useNavigate();

  // Estados
  const [usuarios, setUsuarios] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [is_guardado, setIsGuardado] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(0);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState(0);
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const usuariosPorPagina = 100; // Cambia el número de usuarios por página según lo desees
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    especialidad: "",
    descripcion: "",
    correo: "",
    telefono: "",
    password: "",
    imagen: "",
    profile_id:"",
  });

  // 🔥 Obtener usuarios
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const usuariosObtenidos = await AuthService.obtenerUsuarios(
          1,
          usuariosPorPagina
        );
        const total_paginas = Math.ceil(
          usuariosObtenidos.total / usuariosPorPagina
        );
        setTotalPaginas(total_paginas);
        setUsuarios(usuariosObtenidos.usuarios || []);
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
      }
    };

    cargarUsuarios();
  }, []);

  const manejarPaginaSiguiente = async () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
      const numero_pagina = paginaActual + 1;
      const usuariosObtenidos = await AuthService.obtenerUsuarios(
        numero_pagina,
        usuariosPorPagina
      );
      setUsuarios(usuariosObtenidos.usuarios || []);
    }
  };

  const manejarPaginaAnterior = async () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
      const numero_pagina = paginaActual - 1;
      const usuariosObtenidos = await AuthService.obtenerUsuarios(
        numero_pagina,
        usuariosPorPagina
      );
      setUsuarios(usuariosObtenidos.usuarios || []);
    }
  };
  // 🔥 Obtener servicios
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const servicios = await ServiceService.obtenerTodos();
        setServicios(servicios);
      } catch (error) {
        console.error("Error obteniendo servicios:", error);
      }
    };

    cargarServicios();
  }, []);

  // 🔥 Obtener provincias
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

  // 🔥 Obtener municipios cuando cambia la provincia
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

  // 🔎 Filtrar usuarios por búsqueda
  useEffect(() => {
    if (usuarios.length > 0) {
      setUsuariosFiltrados(
        usuarios?.filter((usuario) => {
          const texto = busqueda.toLowerCase();
          return (
            usuario.nombre.toLowerCase().includes(texto) ||
            usuario.correo.toLowerCase().includes(texto) ||
            usuario.especialidad?.toLowerCase().includes(texto)
          );
        })
      );
    }
  }, [usuarios, busqueda]); // Se recalculará cada vez que cambie `usuarios` o `busqueda`
  // ✅ Guardar edición
  const guardarEdicion = async () => {
    await AuthService.actualizarPerfil(nuevoUsuario.id,nuevoUsuario.profile_id, {
      profile_pic_url: nuevoUsuario.profile_pic_url,
      name: nuevoUsuario.nombre,
      phone: nuevoUsuario.telefono,
      municipio_id: municipioSeleccionado,
      provincia_id: provinciaSeleccionada,
},{
      phone: nuevoUsuario.telefono,
      speciality: nuevoUsuario.especialidad,
      description: nuevoUsuario.descripcion
    });
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
    const usuariosObtenidos = await AuthService.obtenerUsuarios(
      1,
      usuariosPorPagina
    );
    setUsuarios(usuariosObtenidos.usuarios || []);
  };

  // ✅ Crear nuevo usuario o guardar edición
  const agregarUsuario = async () => {
    try {
      if (isEditable) {
        await guardarEdicion();
      } else {
        const urlImagen = await ImageService.uploadBase64Image(
          nuevoUsuario.imagen,
          "imagenes-perfil"
        );
        setIsGuardado(true)

        const userId = await AuthService.crearUsuarioAuth(
          nuevoUsuario.correo,
          nuevoUsuario.password
        );

        await AuthService.guardarProveedor(
          userId,
          nuevoUsuario.nombre,
          nuevoUsuario.telefono,
          true,
          nuevoUsuario.especialidad,
          nuevoUsuario.descripcion,
          servicioSeleccionado,
          municipioSeleccionado,
          urlImagen
        );
        const usuariosObtenidos = await AuthService.obtenerUsuarios(
          1,
          usuariosPorPagina
        );
        setUsuarios(usuariosObtenidos.usuarios || []);
      }

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
      setIsGuardado(false)

    } catch (error) {
      console.error("Error agregando usuario:", error);
    }
  };

  // 🖼️ Subir imagen
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
  const eliminarUsuario = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
      setUsuarios((prev) => prev.filter((user) => user.id !== id));
      AuthService.eliminarPerfil(id);
    }
  };
  const actualizarPrioridad = async (id, nuevaPrioridad) => {
    try {
      console.log("actualizar prioridad", nuevaPrioridad);

      // Copia de los servicios actuales
      const nuevosUsuarios = [...usuariosFiltrados];

      // Encontrar el servicio que se está actualizando
      const usuarioActualizado = nuevosUsuarios.find(
        (usuario) => usuario.provider_id === id
      );

      // Verificar si la nueva prioridad ya existe
      const prioridadExistente = nuevosUsuarios.find(
        (usuario) => usuario.position === nuevaPrioridad
      );

      if (prioridadExistente) {
        // Si la prioridad ya existe, intercambiar las prioridades
        prioridadExistente.position = usuarioActualizado.position;
      }

      // Actualizar la prioridad del servicio seleccionado
      usuarioActualizado.position = nuevaPrioridad;

      // Ordenar los servicios por prioridad
      nuevosUsuarios.sort((a, b) => b.position - a.position);
      setUsuarios(nuevosUsuarios);

      // Actualizar en el backend
      await AuthService.actualizarPrioridad(usuarioActualizado.provider_id, {
        position: usuarioActualizado.position,
      });
      if (prioridadExistente) {
        await AuthService.actualizarPrioridad(prioridadExistente.provider_id, {
          position: prioridadExistente.position,
        });
      }
    } catch (error) {
      console.error("Error actualizando la prioridad:", error);
      alert("❌ Error actualizando la prioridad.");
    }
  };

  const activarUsuario = async (id, estado) => {
    await AuthService.cambiarEstadoUsuario(id, !estado);
    setUsuarios((prev) =>
      prev.map((user) =>
        user.id_profile === id
          ? { ...user, estado: !estado ? "Activo" : "Inactivo" }
          : user
      )
    );
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
  const editarProveedor = async (usuario) => {
    console.log(usuario);
    
    setModalAbierto(true);
    setNuevoUsuario({
      id: usuario.id,
      nombre: usuario.nombre,
      especialidad: usuario.especialidad,
      descripcion: usuario.descripcion,
      correo: usuario.correo,
      telefono: usuario.telefono,
      profile_id: usuario.id_profile,
      password: "",
      imagen: usuario.imagen,
    });
    setServicioSeleccionado(usuario.service_id);
    setProvinciaSeleccionada(usuario.provincia_id);
    setMunicipioSeleccionado(usuario.municipio_id);
    setIsEditable(true);
  };
  const moverPosicion = (provider_id, direccion) => {
    const nuevosUsuarios = [...usuariosFiltrados]; // Copiar el array de usuarios filtrados
    const index = nuevosUsuarios.findIndex(
      (user) => user.provider_id === provider_id
    );
    let nueva_prioridad = 0;
    if (direccion === "subir" && index > 0) {
      // Intercambiar con el usuario anterior
      [nuevosUsuarios[index], nuevosUsuarios[index - 1]] = [
        nuevosUsuarios[index - 1],
        nuevosUsuarios[index],
      ];
      nueva_prioridad = nuevosUsuarios[index - 1].position + 1;
    } else if (direccion === "bajar" && index < nuevosUsuarios.length - 1) {
      // Intercambiar con el siguiente usuario
      [nuevosUsuarios[index], nuevosUsuarios[index + 1]] = [
        nuevosUsuarios[index + 1],
        nuevosUsuarios[index],
      ];
      nueva_prioridad = nuevosUsuarios[index + 1].position - 1;
    }
    // Actualizar el estado de los usuarios con la nueva lista

    actualizarPrioridad(provider_id, nueva_prioridad);

    setUsuarios(nuevosUsuarios);
  };
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

        {/* Modal */}
        {modalAbierto && (
          <div className="modal">
            <div className="modal-content">
              <h2>{isEditable ? "Editar Usuario" : "Agregar Usuario"}</h2>
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
              {!isEditable &&(

              <select
                value={servicioSeleccionado}
                onChange={(e) =>
                  setServicioSeleccionado(parseInt(e.target.value))
                }
              >
                <option value="">Seleccione una categoria</option>
                {servicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.category}
                  </option>
                ))}
              </select>
              )}
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
              <input
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
              />
              {nuevoUsuario.imagen && (
                <img
                  src={nuevoUsuario.imagen}
                  alt="Vista previa"
                  className="preview-img"
                />
              )}
              <button disabled = {is_guardado} onClick={agregarUsuario}>✅ Guardar</button>
              <button
              disabled = {is_guardado}
                onClick={() => {
                  setModalAbierto(false);
                  setNuevoUsuario({
                    nombre: "",
                    especialidad: "",
                    descripcion: "",
                    correo: "",
                    telefono: "",
                    password: "",
                    imagen: "",
                  });
                  setProvinciaSeleccionada("");
                  setMunicipioSeleccionado("");
                  setServicioSeleccionado("");
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Tabla */}
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Prioridad</th>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Tipo Usuario</th>
              <th>Correo</th>
              <th>Telefono</th>
              <th>Calificacion</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario, index) => (
              <tr key={usuario.id}>
                <td>{index + 1}</td>
                <td>
                  {usuario.position !== null &&
                    usuario.position !== undefined && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <button
                          className="btn-flecha"
                          onClick={() =>
                            moverPosicion(usuario.provider_id, "subir")
                          }
                          disabled={index === 0} // Deshabilitar si es el primer usuario
                        >
                          ⇧
                        </button>
                        <span style={{ margin: "0 10px", fontSize: "18px" }}>
                          {usuario.position}
                        </span>
                        <button
                          className="btn-flecha"
                          onClick={() =>
                            moverPosicion(usuario.provider_id, "bajar")
                          }
                          disabled={index === usuariosFiltrados.length - 1} // Deshabilitar si es el último usuario
                        >
                          ⇩
                        </button>
                      </div>
                    )}
                </td>
                <td>{usuario.nombre}</td>
                <td>{usuario.especialidad}</td>
                <td>{usuario.rol?.name}</td>
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
                  <button
                    className={
                      usuario.estado ? "btn-premium" : "btn-no-premium"
                    }
                    onClick={() =>
                      activarUsuario(
                        usuario.id_profile,
                        usuario.estado == "Activo"
                      )
                    }
                  >
                    {usuario.estado == "Activo" ? "✅ Activo" : "❌ Inactivo"}
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
        {/* Controles de paginación */}
        <div className="paginacion">
          <button onClick={manejarPaginaAnterior} disabled={paginaActual === 1}>
            ⇦
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={manejarPaginaSiguiente}
            disabled={paginaActual === totalPaginas}
          >
            ⇨
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserManagementPage;
