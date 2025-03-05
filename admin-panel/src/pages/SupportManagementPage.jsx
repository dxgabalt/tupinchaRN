import  { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { Soporteservice } from "../services/SoporteService";

const SupportManagementPage = () => {
  // 🔢 Datos Simulados de Tickets de Soporte
  const [tickets, setTickets] = useState();

  const [filtroEstado, setFiltroEstado] = useState("Todos");



  // 📌 Cambiar el estado del ticket
  const cambiarEstado = (id, nuevoEstado) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === id ? { ...ticket, estado: nuevoEstado } : ticket
      )
    );
  };
  useEffect(() => {
    const obtenerSoporte = async () => {
      try {
        const soportes = await Soporteservice.obtenerTodos();
        setTickets(soportes);
      } catch (error) {
        console.error("Error obteniendo soportes:", error);
      }
    };
    obtenerSoporte();
  }, []);
    // 📌 Filtrar tickets por estado
    const ticketsFiltrados =
    filtroEstado === "Todos"
      ? tickets
      : tickets.filter((ticket) => ticket.estado === filtroEstado);
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>📩 Gestión de Soporte</h1>

        {/* 🔍 Filtro de Estado */}
        <div className="filtro-container">
          <label>🔎 Filtrar por estado:</label>
          <select onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>

        {/* 📌 Tabla de Tickets de Soporte */}
        <table className="support-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Asunto</th>
              <th>Mensaje</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ticketsFiltrados?.length > 0 ? (
              ticketsFiltrados.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket?.profiles?.name}</td>
                  <td>{ticket.asunto}</td>
                  <td>{ticket.mensaje}</td>
                  <td>
                    <span className={`estado ${ticket.estado.toLowerCase()}`}>
                      {ticket.estado}
                    </span>
                  </td>
                  <td>{ticket.created_at}</td>
                  <td>
                    {ticket.estado !== "Resuelto" && (
                      <button
                        className="btn-process"
                        onClick={() => cambiarEstado(ticket.id, "En proceso")}
                      >
                        ⏳ En Proceso
                      </button>
                    )}
                    {ticket.estado !== "Resuelto" && (
                      <button
                        className="btn-resolved"
                        onClick={() => cambiarEstado(ticket.id, "Resuelto")}
                      >
                        ✅ Marcar como Resuelto
                      </button>
                    )}
                    {ticket.estado === "Resuelto" && (
                      <span className="completado">✅ Resuelto</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No hay tickets de soporte disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default SupportManagementPage;
