import React from "react";
import Sidebar from "../components/Sidebar";

const SupportManagementPage = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>Gestión de Soporte</h1>
        <p>Revisa y responde a solicitudes de soporte de los usuarios.</p>
      </main>
    </div>
  );
};

export default SupportManagementPage;
