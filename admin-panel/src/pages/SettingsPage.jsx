import  { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { ConfiguracionService } from "../services/ConfiguracionService";

const SettingsPage = () => {
  // 📌 Estado de Configuración
  const [comision, setComision] = useState(0);
  const [metodosPago, setMetodosPago] = useState([ ]);
  const [frecuenciaPago, setFrecuenciaPago] = useState("Mensual");
  const [subscripcionActiva, setSubscripcionActiva] = useState(false);
  const [diasProrroga, setDiasProrroga] = useState(0);
  const [notificaciones, setNotificaciones] = useState(true);
 // 📌 Obtener configuración desde Supabase al iniciar
 useEffect(() => {
  const cargarConfiguracion = async () => {
    try {
      const configuracion = await ConfiguracionService.obtenerPorId(1); // ID de configuración
      if (configuracion) {
        setComision(configuracion.porcentaje_comision || 0);
        setMetodosPago(configuracion.metodos_aceptados || []);
        setFrecuenciaPago(configuracion.frecuencia_pago || "Mensual");
        setSubscripcionActiva(configuracion.is_suscripcion || false);
        setDiasProrroga(configuracion.prorroga || 3);
        setNotificaciones(configuracion.is_notificacion || false);
      }
    } catch (error) {
      console.error("❌ Error al cargar la configuración:", error);
    }
  };

  cargarConfiguracion();
}, []);
  // 📌 Guardar Configuración
  const guardarConfiguracion = () => {
    ConfiguracionService.actualizar(1,{
      porcentaje_comision:comision,
      metodos_aceptados:metodosPago,
      frecuencia_pago:frecuenciaPago,
      is_suscripcion:subscripcionActiva,
      prorroga:diasProrroga,
      is_notificacion:notificaciones,
    })
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
