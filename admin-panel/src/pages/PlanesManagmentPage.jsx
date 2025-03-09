import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { PlanService } from "../services/PlanService";

const PlanesManagmentPage = () => {

  // 📌 Estado de los planes
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📌 Estados de edición
  const [editando, setEditando] = useState(null);
  const [id, setId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [costo, setCosto] = useState("");
  const [duracion, setDuracion] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false); // Estado para controlar la apertura del modal
  const [modoEdicion, setModoEdicion] = useState(false); // Controla si es modo edición o agregar

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
    if (modoEdicion) {
      try {
        await PlanService.actualizar(id, { nombre, costo, duracion });
        alert("✅ Plan actualizado con éxito.");
        setEditando(null);
      } catch (error) {
        console.error("Error actualizando el plan:", error);
      }
    } else {
      try {
        await PlanService.crear({ nombre, costo, duracion });
        alert("✅ Plan agregado con éxito.");
      } catch (error) {
        console.error("Error agregando el plan:", error);
      }
    }
    setModalAbierto(false);
    obtenerPlanes(); // Refrescar la lista de planes
  };

  // 📌 Abrir modal para agregar o editar plan
  const abrirModal = (plan = null) => {
    if (plan) {
      setEditando(plan.id);
      setNombre(plan.nombre);
      setCosto(plan.costo);
      setDuracion(plan.duracion);
      setId(plan.id)
      setModoEdicion(true);
    } else {
      setNombre("");
      setCosto("");
      setDuracion("");
      setModoEdicion(false);
    }
    setModalAbierto(true);
  };

  // 📌 Cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
  };

  if (loading) {
    return <p className="loading-msg">⏳ Cargando planes...</p>;
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>🛠 Administración de Planes</h1>

        <div className="plan-container">
        <button
            className="btn-agregar"
            onClick={() => abrirModal()}
          >
            Agregar Nuevo Plan
          </button>
          {/* 📋 Tabla de Planes */}
          <table className="table-planes">
            <thead>
              <tr>
                <th>Nombre del Plan</th>
                <th>Costo($)</th>
                <th>Duración(Dìas)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planes.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.nombre}</td>
                  <td>${plan.costo}</td>
                  <td>{plan.duracion}</td>
                  <td>
                    <button
                      onClick={() => abrirModal(plan)}
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

        {/* Modal */}
        {modalAbierto && (
          <div className="modal">
            <div className="modal-content">
              <h2>{modoEdicion ? "Editar Plan" : "Agregar Nuevo Plan"}</h2>
              <label>Nombre del Plan</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del plan"
              />
              <label>Costo</label>
              <input
                type="number"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                placeholder="Costo"
              />
              <label>Duración</label>
              <input
                type="text"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                placeholder="Duración"
              />
              <div className="modal-actions">
                <button onClick={guardarEdicion} className="btn-guardar">
                  Guardar
                </button>
                <button onClick={cerrarModal} className="btn-cerrar">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PlanesManagmentPage;
