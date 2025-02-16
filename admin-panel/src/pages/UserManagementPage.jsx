import React from "react";
import Sidebar from "../components/Sidebar";

const UserManagementPage = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>Gestión de Usuarios</h1>
        <p>Aquí puedes ver y gestionar usuarios registrados.</p>
      </main>
    </div>
  );
};

export default UserManagementPage;
