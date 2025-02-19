import  { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import SolicitudService from "../services/SolicitudService";

const ServiceManagementPage = () => {
  const [servicios, setServicios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  // 📌 Cargar servicios desde el servicio
  useEffect(() => {
    const cargarServicios = async () => {
      const data = await SolicitudService.obtenerTodosLosSolicitudes();
      setServicios(data);
    };
    cargarServicios();
  }, []);

  // 📌 Cambiar estado del servicio
  const cambiarEstado = async (id, nuevoEstado) => {
    await SolicitudService.actualizarEstadoSolicitud(id, nuevoEstado);
      setServicios((prevServicios) =>
        prevServicios.map((servicio) =>
          servicio.id === id ? { ...servicio, status: nuevoEstado } : servicio
        )
      );
  };

  // 📌 Eliminar servicio
  const eliminarServicio = async (id) => {
    const eliminado = await SolicitudService.eliminarSolicitud(id);
    if (eliminado) {
      setServicios((prevServicios) => prevServicios.filter((servicio) => servicio.id !== id));
    }
  };

  // 📌 Filtrar servicios según búsqueda y estado
  const serviciosFiltrados = servicios.filter(
    (servicio) =>
      servicio.services.category.toLowerCase().includes(filtro.toLowerCase()) &&
      (estadoFiltro === "Todos" || servicio.status === estadoFiltro)
  );

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>🛠️ Gestión de Servicios</h1>

        {/* 🔍 Barra de Búsqueda y Filtros */}
        <div className="filters">
          <input
            type="text"
            placeholder="🔍 Buscar por categoría..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="input-search"
          />
          <select onChange={(e) => setEstadoFiltro(e.target.value)} className="filter-select">
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendientes</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Completado">Completados</option>
          </select>
        </div>

        {/* 📌 Tabla de Servicios */}
        <table className="service-table">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {serviciosFiltrados.length > 0 ? (
              serviciosFiltrados.map((servicio) => (
                <tr key={servicio.id}>
                  <td>{servicio.services.category}</td>
                  <td>{servicio.providers.profiles.name}</td>
                  <td>{servicio.usuarioPerfil.name}</td>
                  <td>
                    <span className={`estado ${servicio.status.toLowerCase()}`}>
                      {servicio.status}
                    </span>
                  </td>
                  <td>
                    {servicio.status === "Pendiente" && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => cambiarEstado(servicio.id, "Aprobado")}
                        >
                          Aprobar
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => eliminarServicio(servicio.id)}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    {servicio.status === "En Proceso" && (
                      <button
                        className="btn-complete"
                        onClick={() => cambiarEstado(servicio.id, "Completado")}
                      >
                        Completar
                      </button>
                    )}
                    {servicio.status === "Completado" && (
                      <span className="completado">✅ Finalizado</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No hay servicios disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ServiceManagementPage;
