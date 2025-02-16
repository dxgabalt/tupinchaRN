import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";

const SettingsPage = () => {
  // 📌 Estado de Configuración
  const [comision, setComision] = useState(10);
  const [metodosPago, setMetodosPago] = useState([
    "Transfermovil",
    "EnZona",
    "Cash App",
    "Zelle",
    "Efectivo",
  ]);
  const [frecuenciaPago, setFrecuenciaPago] = useState("Mensual");
  const [subscripcionActiva, setSubscripcionActiva] = useState(true);
  const [diasProrroga, setDiasProrroga] = useState(3);
  const [notificaciones, setNotificaciones] = useState(true);

  // 📌 Guardar Configuración
  const guardarConfiguracion = () => {
    alert("✅ Configuración guardada con éxito.");
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>⚙ Configuración General</h1>

        <div className="config-section">
          <label>💰 Comisión de la Plataforma (%)</label>
          <input
            type="number"
            value={comision}
            min="0"
            max="100"
            onChange={(e) => setComision(e.target.value)}
          />
        </div>

        <div className="config-section">
          <label>💳 Métodos de Pago Aceptados</label>
          <select multiple value={metodosPago} onChange={(e) => setMetodosPago([...e.target.selectedOptions].map(o => o.value))}>
            <option value="Transfermovil">Transfermovil</option>
            <option value="EnZona">EnZona</option>
            <option value="Cash App">Cash App</option>
            <option value="Zelle">Zelle</option>
            <option value="Efectivo">Efectivo</option>
          </select>
        </div>

        <div className="config-section">
          <label>📅 Frecuencia de Pago</label>
          <select value={frecuenciaPago} onChange={(e) => setFrecuenciaPago(e.target.value)}>
            <option value="Mensual">Mensual</option>
            <option value="Semanal">Semanal</option>
            <option value="Quincenal">Quincenal</option>
          </select>
        </div>

        <div className="config-section">
          <label>🔄 Activar Sistema de Suscripción</label>
          <input type="checkbox" checked={subscripcionActiva} onChange={() => setSubscripcionActiva(!subscripcionActiva)} />
        </div>

        <div className="config-section">
          <label>🕒 Tiempo de Prórroga (días)</label>
          <input type="number" value={diasProrroga} min="1" max="7" onChange={(e) => setDiasProrroga(e.target.value)} />
        </div>

        <div className="config-section">
          <label>🔔 Activar Notificaciones</label>
          <input type="checkbox" checked={notificaciones} onChange={() => setNotificaciones(!notificaciones)} />
        </div>

        <button className="btn-save" onClick={guardarConfiguracion}>💾 Guardar Configuración</button>
      </main>
    </div>
  );
};

export default SettingsPage;
