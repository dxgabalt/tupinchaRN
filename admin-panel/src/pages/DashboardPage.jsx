import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";

const DashboardPage = () => {
  // 🔢 Datos Simulados
  const totalUsuarios = 1200;
  const totalProveedores = 450;
  const totalServicios = 650;
  const totalPagos = 12500;
  const porcentajeCompletado = 85;

  const ultimasSolicitudes = [
    { id: 1, usuario: "Carlos Lopez", servicio: "Fontanería", estado: "Pendiente" },
    { id: 2, usuario: "Ana Pérez", servicio: "Electricidad", estado: "En Proceso" },
    { id: 3, usuario: "Luis Ramírez", servicio: "Reparación", estado: "Completado" },
  ];

  // 📊 Datos para Gráfico de Línea (Ingresos)
  const ingresosData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Ingresos en USD",
        data: [1200, 1500, 1100, 2500, 2000, 2800],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // 📊 Datos para Gráfico de Distribución de Servicios
  const serviciosData = {
    labels: ["Fontanería", "Electricidad", "Jardinería", "Construcción"],
    datasets: [
      {
        label: "Servicios",
        data: [30, 40, 20, 50],
        backgroundColor: ["blue", "red", "orange", "green"],
      },
    ],
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>📊 Panel de Administración</h1>

        {/* 🔢 Tarjetas de Métricas */}
        <div className="stats-container">
          <div className="stat-card">👤 Usuarios: {totalUsuarios}</div>
          <div className="stat-card">🛠️ Proveedores: {totalProveedores}</div>
          <div className="stat-card">🔧 Servicios: {totalServicios}</div>
          <div className="stat-card">💰 Pagos: ${totalPagos}</div>
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
              {ultimasSolicitudes.map((solicitud) => (
                <tr key={solicitud.id}>
                  <td>{solicitud.usuario}</td>
                  <td>{solicitud.servicio}</td>
                  <td>{solicitud.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
