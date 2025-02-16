import React from "react";
import Sidebar from "../components/Sidebar";

const CommissionPage = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>Gestión de Comisiones</h1>
        <p>Establece y revisa comisiones de los proveedores.</p>
      </main>
    </div>
  );
};

export default CommissionPage;
