import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";

const SupportManagementPage = () => {
  // 🔢 Datos Simulados de Tickets de Soporte
  const [tickets, setTickets] = useState([
    {
      id: 1,
      usuario: "Carlos López",
      asunto: "Problema con el pago",
      mensaje: "Hice un pago y aún no se ha reflejado en mi cuenta.",
      estado: "Pendiente",
      fecha: "2024-02-01",
    },
    {
      id: 2,
      usuario: "Ana Pérez",
      asunto: "Error en el perfil",
      mensaje: "No puedo actualizar mi foto de perfil.",
      estado: "En proceso",
      fecha: "2024-02-05",
    },
    {
      id: 3,
      usuario: "Luis Ramírez",
      asunto: "Solicitud de reembolso",
      mensaje: "Quiero solicitar un reembolso por un servicio no recibido.",
      estado: "Resuelto",
      fecha: "2024-02-10",
    },
  ]);

  const [filtroEstado, setFiltroEstado] = useState("Todos");

  // 📌 Filtrar tickets por estado
  const ticketsFiltrados =
    filtroEstado === "Todos"
      ? tickets
      : tickets.filter((ticket) => ticket.estado === filtroEstado);

  // 📌 Cambiar el estado del ticket
  const cambiarEstado = (id, nuevoEstado) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === id ? { ...ticket, estado: nuevoEstado } : ticket
      )
    );
  };

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
            {ticketsFiltrados.length > 0 ? (
              ticketsFiltrados.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.usuario}</td>
                  <td>{ticket.asunto}</td>
                  <td>{ticket.mensaje}</td>
                  <td>
                    <span className={`estado ${ticket.estado.toLowerCase()}`}>
                      {ticket.estado}
                    </span>
                  </td>
                  <td>{ticket.fecha}</td>
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
