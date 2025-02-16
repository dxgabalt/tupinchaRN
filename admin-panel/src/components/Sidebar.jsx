import React from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/dashboard">📊 Dashboard</Link></li>
        <li><Link to="/users">👤 Gestión de Usuarios</Link></li>
        <li><Link to="/services">🛠️ Gestión de Servicios</Link></li>
        <li><Link to="/commissions">💰 Comisiones</Link></li>
        <li><Link to="/payments">💳 Pagos</Link></li>
        <li><Link to="/support">📞 Soporte</Link></li>
        <li><Link to="/settings">⚙️ Configuración</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
