import React from "react";
import Sidebar from "../components/Sidebar";

const ServiceManagementPage = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>Gestión de Servicios</h1>
        <p>Aquí puedes ver y administrar los servicios publicados.</p>
      </main>
    </div>
  );
};

export default ServiceManagementPage;
