import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";

const ServiceManagementPage = () => {
  // 🔢 Datos Simulados de Servicios
  const [servicios, setServicios] = useState([
    {
      id: 1,
      categoria: "Fontanería",
      proveedor: "Carlos López",
      cliente: "Ana Pérez",
      estado: "Pendiente",
    },
    {
      id: 2,
      categoria: "Electricidad",
      proveedor: "Luis Ramírez",
      cliente: "María González",
      estado: "En Proceso",
    },
    {
      id: 3,
      categoria: "Reparación de Electrodomésticos",
      proveedor: "Juan Pérez",
      cliente: "Jorge Rivera",
      estado: "Completado",
    },
  ]);

  const [filtro, setFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  // 📌 Cambiar estado del servicio
  const cambiarEstado = (id, nuevoEstado) => {
    setServicios((prevServicios) =>
      prevServicios.map((servicio) =>
        servicio.id === id ? { ...servicio, estado: nuevoEstado } : servicio
      )
    );
  };

  // 📌 Eliminar servicio
  const eliminarServicio = (id) => {
    setServicios((prevServicios) => prevServicios.filter((servicio) => servicio.id !== id));
  };

  // 📌 Filtrar servicios según búsqueda y estado
  const serviciosFiltrados = servicios.filter(
    (servicio) =>
      servicio.categoria.toLowerCase().includes(filtro.toLowerCase()) &&
      (estadoFiltro === "Todos" || servicio.estado === estadoFiltro)
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
                  <td>{servicio.categoria}</td>
                  <td>{servicio.proveedor}</td>
                  <td>{servicio.cliente}</td>
                  <td>
                    <span className={`estado ${servicio.estado.toLowerCase()}`}>
                      {servicio.estado}
                    </span>
                  </td>
                  <td>
                    {servicio.estado === "Pendiente" && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => cambiarEstado(servicio.id, "En Proceso")}
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
                    {servicio.estado === "En Proceso" && (
                      <button
                        className="btn-complete"
                        onClick={() => cambiarEstado(servicio.id, "Completado")}
                      >
                        Completar
                      </button>
                    )}
                    {servicio.estado === "Completado" && (
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
