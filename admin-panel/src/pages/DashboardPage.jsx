import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";

const DashboardPage = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>Bienvenido al Panel de Administración</h1>
        <p>Selecciona una opción del menú.</p>
      </main>
    </div>
  );
};

export default DashboardPage;
