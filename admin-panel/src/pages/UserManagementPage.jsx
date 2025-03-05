import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { PlanService } from "../services/PlanService";

const PlanesManagmentPage = () => {
  const navigate = useNavigate();

  // 📌 Estado de los planes
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📌 Estados de edición
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [costo, setCosto] = useState("");
  const [duracion, setDuracion] = useState("");

  // 📌 Estado del modal
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    obtenerPlanes();
  }, []);

  // 📌 Obtener todos los planes
  const obtenerPlanes = async () => {
    try {
      const planesData = await PlanService.obtenerTodos(); // Llamar al servicio para obtener los planes
      setPlanes(planesData);
      setLoading(false);
    } catch (error) {
      console.error("Error obteniendo los planes:", error);
    }
  };

  // 📌 Guardar cambios del plan
  const guardarEdicion = async () => {
    try {
      if (editando) {
        await PlanService.actualizarPlan(editando, { nombre, costo, duracion });
        alert("✅ Plan actualizado con éxito.");
      } else {
        await PlanService.agregarPlan({ nombre, costo, duracion });
        alert("✅ Plan agregado con éxito.");
      }
      setModalAbierto(false);
      obtenerPlanes(); // Refrescar la lista de planes
    } catch (error) {
      console.error("Error guardando el plan:", error);
    }
  };

  const abrirModalAgregar = () => {
    setNombre("");
    setCosto("");
    setDuracion("");
    setEditando(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (plan) => {
    setNombre(plan.nombre);
    setCosto(plan.costo);
    setDuracion(plan.duracion);
    setEditando(plan.id);
    setModalAbierto(true);
  };

  if (loading) {
    return <p className="loading-msg">⏳ Cargando planes...</p>;
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>🛠 Administración de Planes</h1>
        <button onClick={abrirModalAgregar} className="btn-agregar">
          Agregar Plan
        </button>
        <div className="plan-container">
          {/* 📋 Tabla de Planes */}
          <table className="table-planes">
            <thead>
              <tr>
                <th>Nombre del Plan</th>
                <th>Costo</th>
                <th>Duración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planes.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.nombre}</td>
                  <td>{`$${plan.costo}`}</td>
                  <td>{plan.duracion}</td>
                  <td>
                    <button
                      onClick={() => abrirModalEditar(plan)}
                      className="btn-editar"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {modalAbierto && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editando ? "Editar Plan" : "Agregar Plan"}</h2>
            <input
              type="text"
              placeholder="Nombre del Plan"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="number"
              placeholder="Costo"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
            />
            <input
              type="text"
              placeholder="Duración"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
            />
            <button onClick={guardarEdicion}>
              {editando ? "Guardar Cambios" : "Agregar Plan"}
            </button>
            <button
              onClick={() => {
                setModalAbierto(false);
                setNombre("");
                setCosto("");
                setDuracion("");
              }}
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanesManagmentPage;
