import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { EstadisticasService } from "../services/EstadisticasService";
import SolicitudService from "../services/SolicitudService"; // Importamos el servicio

const DashboardPage = () => {
  // Estado para las estadísticas
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    totalProveedores: 0,
    totalServicios: 0,
    totalPagos: 0,
    porcentajeCompletado: 0,
  });

  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState([]); // Estado para solicitudes

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    const fetchEstadisticas = async () => {
      const data = await EstadisticasService.obtenerEstadisticas();
      if (data) {
        setEstadisticas(data);
      }
      setLoading(false);
    };

    fetchEstadisticas();
  }, []);

  // Cargar solicitudes al montar el componente
  useEffect(() => {
    const fetchSolicitudes = async () => {
      const data = await SolicitudService.obtenerTodosLosSolicitudes();
      if (data) {
        setSolicitudes(data);
      }
    };

    fetchSolicitudes();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>📊 Panel de Administración</h1>

        {/* 🔢 Tarjetas de Métricas */}
        <div className="stats-container">
          {loading ? (
            <p>Cargando estadísticas...</p>
          ) : (
            <>
              <div className="stat-card">👤 Usuarios: {estadisticas.totalUsuarios}</div>
              <div className="stat-card">🛠️ Proveedores: {estadisticas.totalProveedores}</div>
              <div className="stat-card">🔧 Servicios: {estadisticas.totalServicios}</div>
              <div className="stat-card">💰 Pagos: ${estadisticas.totalPagos}</div>
            </>
          )}
        </div>

        {/* 📌 Últimas Solicitudes */}
        <div className="solicitudes-container">
          <h3>📌 Últimas Solicitudes de Servicio</h3>
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Servicio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.length > 0 ? (
                solicitudes.map((solicitud) => (
                  <tr key={solicitud.id}>
                    <td>{solicitud.usuarioPerfil.name || "Desconocido"}</td>
                    <td>{solicitud.services?.category || "No especificado"}</td>
                    <td>{solicitud.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No hay solicitudes registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
