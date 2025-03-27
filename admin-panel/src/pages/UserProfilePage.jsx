import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import SolicitudService from "../services/SolicitudService";

const UserProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 📌 Datos del usuario
  const [usuario] = useState(location.state?.usuario || null);
  const [loading, setLoading] = useState(true);

  // 📌 Estados de edición
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [portafolio, setPortafolio] = useState(null);
  const [ubicaciones, setUbicaciones] = useState(null);
  const [estado, setEstado] = useState("Activo");

  // 📌 Historial de servicios
  const [historialSolicitados, setHistorialSolicitados] = useState([]);
  const [historialPrestados, setHistorialPrestados] = useState([]);

  useEffect(() => {
    if (!usuario) {
      alert("⚠ Usuario no encontrado. Redirigiendo...");
      navigate("/users");
      return;
    }
    console.log(usuario);

    // 📌 Cargar datos iniciales
    setNombre(usuario.nombre || "");
    setTelefono(usuario.telefono || "");
    setEstado(usuario.estado || "Activo");
    setPortafolio(usuario.portafolio || null);
    setUbicaciones(usuario.ubicaciones ||null)
    setLoading(false);

    // 📌 Cargar historial de servicios
    obtenerHistorialServicios();
  }, [usuario, navigate]);

  const obtenerHistorialServicios = async () => {
    try {
      // Obtener solicitudes realizadas
      const solicitados = await SolicitudService.obtenerSolicitudesPorUsuario(
        id
      );
      setHistorialSolicitados(solicitados || []);

      // Obtener solicitudes prestadas (si el usuario es proveedor)
      if (usuario.tipo === "Proveedor") {
        const prestados =
          await SolicitudService.obtenerSolicitudesComoProveedor(id);
        setHistorialPrestados(prestados || []);
      }
    } catch (error) {
      console.error("Error obteniendo historial de servicios:", error);
    }
  };


  if (loading) {
    return <p className="loading-msg">⏳ Cargando perfil...</p>;
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>👤 Perfil de Usuario</h1>

        <div className="perfil-container">
          {/* 📸 Foto de perfil y detalles básicos */}
          <div className="perfil-detalles">
            <img
              src={usuario.imagen}
              alt="Foto de perfil"
              className="perfil-imagen"
            />
            <h2>{nombre}</h2>
            <p>📧 {usuario.correo}</p>
            <p>📞 {telefono}</p>
            <p>🆔 ID: {id}</p>
            <p>
              ⭐{" "}
              {usuario.calificacion
                ? usuario.calificacion + " / 5"
                : "Sin calificaciones"}
            </p>
            <p
              className={
                estado === "Activo" ? "estadoActivo" : "estadoSuspendido"
              }
            >
              🔵 Estado: {estado}
            </p>
          </div>
          {/* Portafolio */}
          <div className="table-container">
            <h2> Portafolio</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Creado en</th>
                  <th>Especialidad</th>
                  <th>Servicio</th>
                  <th>Descripción</th>
                  <th>Imagen</th>
                </tr>
              </thead>
              <tbody>
                {portafolio.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>
                      {new Date(row.created_at).toLocaleDateString("es-ES")}
                    </td>
                    <td>{row.especialidad}</td>
                    <td>{row.services?.category}</td>
                    <td>{row.descripcion || "N/A"}</td>
                    <td>
                      {row.imagen ? (
                        <img
                          src={row.imagen}
                          alt="Especialidad"
                          className="table-image"
                        />
                      ) : (
                        "Sin imagen"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Ubicacion */}
          <div className="table-container">
            <h2> Ubicaciones</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Creado en</th>
                  <th>Municipio</th>
                  <th>Provincia</th>
                </tr>
              </thead>
              <tbody>
                {ubicaciones.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>
                      {new Date(row.created_at).toLocaleDateString("es-ES")}
                    </td>
                    <td>{row.municipios?.name}</td>
                    <td>{row.provincias?.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 📜 Historial de Servicios Solicitados */}
          <div className="perfil-historial">
            <h3>📋 Historial de Servicios Solicitados</h3>
            {historialSolicitados.length > 0 ? (
              <ul>
                {historialSolicitados.map((item) => (
                  <li key={item.id}>
                    📌 {item.request_description} - {item.service_date} -{" "}
                    {item.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p>❌ No ha solicitado servicios.</p>
            )}
          </div>

          {/* 🛠 Historial de Servicios Prestados */}
          {usuario.tipo === "Proveedor" && (
            <div className="perfil-historial">
              <h3>🛠 Historial de Servicios Prestados</h3>
              {historialPrestados.length > 0 ? (
                <ul>
                  {historialPrestados.map((item) => (
                    <li key={item.id}>
                      🛠 {item.request_description} - Cliente:{" "}
                      {item.usuarioPerfil.name} - Estado: {item.status}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>❌ No ha prestado servicios aún.</p>
              )}
            </div>
          )}

          {/* 🔙 Botón de regreso */}
          <button className="btn-volver" onClick={() => navigate("/users")}>
            ⬅ Volver a Usuarios
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
