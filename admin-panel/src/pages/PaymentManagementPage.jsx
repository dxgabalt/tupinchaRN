import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";

const PaymentManagementPage = () => {
  // 🔢 Datos Simulados de Transacciones
  const [pagos, setPagos] = useState([
    {
      id: 1,
      usuario: "Carlos López",
      metodo: "💳 Tarjeta de Crédito",
      monto: "50.00 USD",
      estado: "Aprobado",
      fecha: "2024-02-01",
    },
    {
      id: 2,
      usuario: "Ana Pérez",
      metodo: "📲 Transfermovil",
      monto: "30.00 USD",
      estado: "Pendiente",
      fecha: "2024-02-05",
    },
    {
      id: 3,
      usuario: "Luis Ramírez",
      metodo: "🔵 PayPal",
      monto: "80.00 USD",
      estado: "Rechazado",
      fecha: "2024-02-10",
    },
  ]);

  const [filtroEstado, setFiltroEstado] = useState("Todos");

  // 📌 Filtrar pagos por estado
  const pagosFiltrados =
    filtroEstado === "Todos"
      ? pagos
      : pagos.filter((pago) => pago.estado === filtroEstado);

  // 📌 Validar un pago manualmente
  const aprobarPago = (id) => {
    setPagos((prevPagos) =>
      prevPagos.map((pago) =>
        pago.id === id ? { ...pago, estado: "Aprobado" } : pago
      )
    );
  };

  // 📌 Descargar reporte de pagos en CSV
  const exportarCSV = () => {
    let csv = "ID,Usuario,Método,Monto,Estado,Fecha\n";
    pagos.forEach((pago) => {
      csv += `${pago.id},${pago.usuario},${pago.metodo},${pago.monto},${pago.estado},${pago.fecha}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_pagos.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>💳 Gestión de Pagos</h1>

        {/* 🔍 Filtro de Estado de Pago */}
        <div className="filtro-container">
          <label>🔎 Filtrar por estado:</label>
          <select onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        {/* 📌 Botón para Exportar CSV */}
        <button className="btn-exportar" onClick={exportarCSV}>
          📥 Exportar CSV
        </button>

        {/* 📌 Tabla de Pagos */}
        <table className="payment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Método de Pago</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagosFiltrados.length > 0 ? (
              pagosFiltrados.map((pago) => (
                <tr key={pago.id}>
                  <td>{pago.id}</td>
                  <td>{pago.usuario}</td>
                  <td>{pago.metodo}</td>
                  <td>{pago.monto}</td>
                  <td>
                    <span className={`estado ${pago.estado.toLowerCase()}`}>
                      {pago.estado}
                    </span>
                  </td>
                  <td>{pago.fecha}</td>
                  <td>
                    {pago.estado === "Pendiente" && (
                      <button
                        className="btn-approve"
                        onClick={() => aprobarPago(pago.id)}
                      >
                        ✅ Aprobar Pago
                      </button>
                    )}
                    {pago.estado === "Aprobado" && (
                      <span className="completado">✅ Aprobado</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No hay pagos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default PaymentManagementPage;
