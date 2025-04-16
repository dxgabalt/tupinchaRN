import  { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import SolicitudService from "../services/SolicitudService";

const ServiceManagementPage = () => {
  const [servicios, setServicios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalContraofertaAbierto, setModalContraofertaAbierto] = useState(false);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [contraofertas, setContraofertas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const solicitudesPorPagina = 100; // Cambia el número de usuarios por página según lo desees

  // 📌 Cargar servicios desde el servicio
  useEffect(() => {
    const cargarServicios = async () => {
      const solicitudes = await SolicitudService.obtenerTodosLosSolicitudes(1,solicitudesPorPagina);
      const total_paginas =Math.ceil(
        solicitudes.total / solicitudesPorPagina
      );
      setTotalPaginas(total_paginas);
      setServicios(solicitudes.data);
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
  const verCotizaciones = (cotizaciones) => {
    setCotizaciones(cotizaciones)
    setModalAbierto(true)
  };  
  const verContraoferta = (contraofertas) => {
    console.log(contraofertas);
    
    setContraofertas(contraofertas)
    setModalContraofertaAbierto(true)
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
   const manejarPaginaSiguiente = async () => {
      if (paginaActual < totalPaginas) {
        setPaginaActual(paginaActual + 1);
        const numero_pagina = paginaActual + 1;
        const solicitudesObtenidas = await SolicitudService.obtenerTodosLosSolicitudes(numero_pagina,solicitudesPorPagina)
        setServicios(solicitudesObtenidas.data || []);
      }
    };
  
    const manejarPaginaAnterior = async () => {
      if (paginaActual > 1) {
        setPaginaActual(paginaActual - 1);
        const numero_pagina = paginaActual - 1;
        const solicitudesObtenidas = await  await SolicitudService.obtenerTodosLosSolicitudes(numero_pagina,solicitudesPorPagina)
        setServicios(solicitudesObtenidas.data || []);
      }
    };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>🔧 Gestión de Solicitudes</h1>

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
              <th>Descripcion</th>
              <th>Cliente</th>
              <th>Telefono del Cliente</th>
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
                  <td>{servicio.request_description}</td>
                  <td>{servicio.usuarioPerfil.name}</td>
                  <td>{servicio.usuarioPerfil.phone}</td>
                  <td>
                    <span className={`estado ${servicio.status.toLowerCase()}`}>
                      {servicio.status}
                    </span>
                  </td>
                  <td>
                  <button
                    className="btn-approve"
                    onClick={() => verCotizaciones(servicio.cotizaciones)}
                  >
                    Ver Cotización
                  </button> 
                  <button
                    className="btn-approve"
                    onClick={() => verContraoferta(servicio.contraofertas)}
                  >
                    Ver ContraOferta
                  </button>
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
      {modalAbierto && (
        <div className="modal">
          <div className="modal-content">
            <h2>Cotizaciones</h2>
             {/* 📌 Tabla de Servicios */}
        <table className="service-table">
          <thead>
            <tr>
              <th>Costo de mano de obra</th>
              <th>Costo de materiales</th>
              <th>Descripcion</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones.length > 0 ? (
              cotizaciones.map((cotizacion) => (
                <tr key={cotizacion.id}>
                  <td>{cotizacion.costo_mano_obra}</td>
                  <td>{cotizacion.costo_materiales}</td>
                  <td>{cotizacion.descripcion}</td>
                  <td>
            <div className="chat-container">
              {cotizacion.cotizacion_notas && cotizacion.cotizacion_notas.length > 0 ? (
                cotizacion.cotizacion_notas.map((nota, index) => (
                  <div key={index} className="chat-message">
                    {nota.nota_client && (
                      <div className="chat-bubble client">
                        <span className="chat-label">Cliente:</span> {nota.nota_client}
                        <span className="chat-time">{new Date(nota.created_at).toLocaleString()}</span>
                      </div>
                    )}
                    {nota.nota_provider && (
                      <div className="chat-bubble provider">
                        <span className="chat-label">Proveedor:</span> {nota.nota_provider}
                        <span className="chat-time">{new Date(nota.created_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="chat-bubble no-notes">Sin notas</div>
              )}
            </div>
          </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No hay cotizaciones disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
            <button onClick={() => setModalAbierto(false)}>❌ Cancelar</button>
          </div>
        </div>
      )}      
      {modalContraofertaAbierto && (
        <div className="modal">
          <div className="modal-content">
            <h2>ContraOfertas</h2>
             {/* 📌 Tabla de Servicios */}
        <table className="service-table">
          <thead>
            <tr>
              <th>Costo de mano de obra</th>
              <th>Costo de materiales</th>
              <th>Descripcion</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {contraofertas.length > 0 ? (
              contraofertas.map((contraoferta) => (
                <tr key={contraoferta.id}>
                  <td>{contraoferta.costo_mano_obra}</td>
                  <td>{contraoferta.costo_materiales}</td>
                  <td>{contraoferta.descripcion}</td>
                  <td>
            <div className="chat-container">
              {contraoferta.contraoferta_notas && contraoferta.contraoferta_notas.length > 0 ? (
                contraoferta.contraoferta_notas.map((nota, index) => (
                  <div key={index} className="chat-message">
                    {nota.nota_client && (
                      <div className="chat-bubble client">
                        <span className="chat-label">Cliente:</span> {nota.nota_client}
                        <span className="chat-time">{new Date(nota.created_at).toLocaleString()}</span>
                      </div>
                    )}
                    {nota.nota_provider && (
                      <div className="chat-bubble provider">
                        <span className="chat-label">Proveedor:</span> {nota.nota_provider}
                        <span className="chat-time">{new Date(nota.created_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="chat-bubble no-notes">Sin notas</div>
              )}
            </div>
          </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No hay contraofertas disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
            <button onClick={() => setModalContraofertaAbierto(false)}>❌ Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagementPage;
