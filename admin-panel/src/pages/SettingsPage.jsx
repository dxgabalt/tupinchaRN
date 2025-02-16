import React from "react";
import Sidebar from "../components/Sidebar";

const SettingsPage = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>Configuraciones</h1>
        <p>Configura los ajustes generales del panel de administración.</p>
      </main>
    </div>
  );
};

export default SettingsPage;
