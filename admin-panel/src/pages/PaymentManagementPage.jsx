import React from "react";
import Sidebar from "../components/Sidebar";

const PaymentManagementPage = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>Gestión de Pagos</h1>
        <p>Administra y revisa pagos realizados en la plataforma.</p>
      </main>
    </div>
  );
};

export default PaymentManagementPage;
