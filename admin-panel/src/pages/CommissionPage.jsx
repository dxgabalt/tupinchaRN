import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";

const CommissionPage = () => {
  // 🔢 Datos Simulados de Proveedores con Estado de Pago
  const [proveedores, setProveedores] = useState([
    {
      id: 1,
      nombre: "Carlos López",
      categoria: "Fontanería",
      estadoPago: "Pagado",
      comision: "10%",
      fechaPago: "2024-02-01",
    },
    {
      id: 2,
      nombre: "Luis Ramírez",
      categoria: "Electricidad",
      estadoPago: "Pendiente",
      comision: "15%",
      fechaPago: "2024-02-05",
    },
    {
      id: 3,
      nombre: "Ana Pérez",
      categoria: "Reparación de Electrodomésticos",
      estadoPago: "Atrasado",
      comision: "12%",
      fechaPago: "2024-01-25",
    },
  ]);

  const [comisionGlobal, setComisionGlobal] = useState("10%");

  // 📌 Cambiar comisión global
  const actualizarComision = (nuevaComision) => {
    setComisionGlobal(nuevaComision);
    setProveedores((prevProveedores) =>
      prevProveedores.map((prov) => ({ ...prov, comision: nuevaComision }))
    );
  };

  // 📌 Aprobar pago manualmente
  const aprobarPago = (id) => {
    setProveedores((prevProveedores) =>
      prevProveedores.map((prov) =>
        prov.id === id ? { ...prov, estadoPago: "Pagado" } : prov
      )
    );
  };

  // 📌 Prórroga de pago
  const otorgarProrroga = (id) => {
    setProveedores((prevProveedores) =>
      prevProveedores.map((prov) =>
        prov.id === id ? { ...prov, estadoPago: "Prórroga" } : prov
      )
    );
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
            value={comisionGlobal.replace("%", "")}
            onChange={(e) => actualizarComision(`${e.target.value}%`)}
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
              <th>Comisión</th>
              <th>Fecha de Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.length > 0 ? (
              proveedores.map((prov) => (
                <tr key={prov.id}>
                  <td>{prov.nombre}</td>
                  <td>{prov.categoria}</td>
                  <td>
                    <span className={`estado ${prov.estadoPago.toLowerCase()}`}>
                      {prov.estadoPago}
                    </span>
                  </td>
                  <td>{prov.comision}</td>
                  <td>{prov.fechaPago}</td>
                  <td>
                    {prov.estadoPago !== "Pagado" && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => aprobarPago(prov.id)}
                        >
                          ✅ Aprobar Pago
                        </button>
                        <button
                          className="btn-prorroga"
                          onClick={() => otorgarProrroga(prov.id)}
                        >
                          🔄 Otorgar Prórroga
                        </button>
                      </>
                    )}
                    {prov.estadoPago === "Pagado" && (
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
