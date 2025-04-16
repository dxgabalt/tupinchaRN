import  { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { PaymentService } from "../services/PaymentService";

const PaymentManagementPage = () => {
  const [pagos, setPagos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  // 📥 Cargar pagos desde la API
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const data = await PaymentService.obtenerTodos();
        setPagos(data);
      } catch (error) {
        console.error("Error al cargar pagos:", error);
      }
    };

    fetchPagos();
  }, []);

  // 📌 Filtrar pagos por estado
  const pagosFiltrados =
    filtroEstado === "Todos"
      ? pagos
      : pagos.filter((pago) => pago.estado === filtroEstado);

  // 📌 Aprobar pago localmente (o puedes hacer llamada al backend si es necesario)
  const aprobarPago = (id) => {
    setPagos((prevPagos) =>
      prevPagos.map((pago) =>
        pago.id === id ? { ...pago, estado: "Aprobado" } : pago
      )
    );
  };

  // 📌 Exportar pagos a CSV
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

        <div className="filtro-container">
          <label>🔎 Filtrar por estado:</label>
          <select onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        <button className="btn-exportar" onClick={exportarCSV}>
          📥 Exportar CSV
        </button>

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
                  <td>{pago.profiles?.name}</td>
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
