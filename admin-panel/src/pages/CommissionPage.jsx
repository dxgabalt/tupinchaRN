import  { useState,useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { Comisioneservice } from "../services/ComisionService";

const CommissionPage = () => {
  // 🔢 Datos Simulados de Proveedores con Estado de Pago
  const [proveedores, setProveedores] = useState([]);

  const [comisionGlobal, setComisionGlobal] = useState(10);
  useEffect(() => {
    const obtenerComisiones = async () => {
      try {
        const comisiones = await Comisioneservice.obtenerTodos();
        setProveedores(comisiones);
      } catch (error) {
        console.error("Error obteniendo comisiones:", error);
      }
    };
    obtenerComisiones();
  }, []);
  // 📌 Cambiar comisión global
  const actualizarComision = (nuevaComision) => {
    setComisionGlobal(nuevaComision);
    Comisioneservice.actualizarComisionGlobal(nuevaComision);
    setProveedores((prevProveedores) =>
      prevProveedores.map((prov) => ({ ...prov, comision: nuevaComision }))
    );
  };

  // 📌 Aprobar pago manualmente
  const aprobarPago = async(id) => {
    await Comisioneservice.cambiarEstado(id, "Pagado");
    setProveedores((prevProveedores) =>
      prevProveedores.map((prov) =>
        prov.id === id ? { ...prov, estado: "Pagado" } : prov
      )
    );
  };

  // 📌 Prórroga de pago
  const otorgarProrroga = async (id,fecha) => {
    await Comisioneservice.cambiarEstado(id, "Prórroga");
      // Convertir la fecha a un objeto Date
      const fechaActual = new Date(fecha);

      // Sumar 7 días
      fechaActual.setDate(fechaActual.getDate() + 7);
   
    setProveedores((prevProveedores) =>
      prevProveedores.map((prov) =>
        prov.id === id ? { ...prov, estado: "Prórroga",fecha_pago:fechaActual.toISOString().split("T")[0] } : prov
      )
    );
  };
 // 📌 Actualizar comisión individual
 const actualizarComisionIndividual = async (id, nuevaComision) => {
  try {
    await Comisioneservice.actualizarComision(id, nuevaComision);
    setProveedores((prevProveedores) =>
      prevProveedores.map((prov) =>
        prov.id === id ? { ...prov, comision: nuevaComision } : prov
      )
    );
  } catch (error) {
    console.error("Error actualizando la comisión:", error);
  }
};
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>💰 Gestión de Comisiones</h1>

        {/* 💼 Configuración de Comisión */}
        <div className="comision-config">
          <label>📊 Comisión Global (%):</label>
          <input
            type="number"
            value={comisionGlobal}
            onChange={(e) => actualizarComision(`${e.target.value}`)}
            className="comision-input"
          /> 
        </div>

        {/* 📌 Tabla de Proveedores con Estados de Pago */}
        <table className="commission-table">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Categoría</th>
              <th>Estado de Pago</th>
              <th>Comisión (%)</th>
              <th>Fecha de Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.length > 0 ? (
              proveedores.map((prov) => (
                <tr key={prov.id}>
                  <td>{prov.providers.profiles.name}</td>
                  <td>{prov.services.category}</td>
                  <td>
                    <span className={`estado ${prov.estado.toLowerCase()}`}>
                      {prov.estado}
                    </span>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={prov.comision}
                      onChange={(e) =>
                        actualizarComisionIndividual(prov.id, `${e.target.value}`)
                      }
                      className="comision-input"
                    />  
                  </td>                  
                  <td>{prov.fecha_pago}</td>
                  <td>
                    {prov.estado !== "Pagado" && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => aprobarPago(prov.id)}
                        >
                          ✅ Aprobar Pago
                        </button>
                        <button
                          className="btn-prorroga"
                          onClick={() => otorgarProrroga(prov.id,prov.fecha_pago)}
                        >
                          🔄 Otorgar Prórroga
                        </button>
                      </>
                    )}
                    {prov.estado === "Pagado" && (
                      <span className="completado">✅ Pagado</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">No hay proveedores registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default CommissionPage;
