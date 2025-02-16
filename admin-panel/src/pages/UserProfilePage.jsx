import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";

const UserProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 📌 Asegurar que `usuario` tiene datos desde `state` o en el futuro desde una API
  const [usuario, setUsuario] = useState(location.state?.usuario || null);
  const [loading, setLoading] = useState(true);

  // 📌 Estados de edición
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    if (!usuario) {
      alert("⚠ Usuario no encontrado. Redirigiendo...");
      navigate("/user-management");
      return;
    }

    // 📌 Cargar datos iniciales
    setNombre(usuario.nombre || "");
    setTelefono(usuario.telefono || "");
    setEstado(usuario.estado || "Activo");
    setCategoria(usuario.categoria || "");
    setLoading(false);
  }, [usuario, navigate]);

  // 📌 Simulación de historial de servicios
  const historialSolicitados = [
    { id: "101", servicio: "Reparación de tubería", fecha: "2024-01-20", estado: "Completado" },
    { id: "102", servicio: "Instalación eléctrica", fecha: "2024-01-22", estado: "Pendiente" },
  ];

  const historialPrestados = usuario?.tipo === "Proveedor"
    ? [
        { id: "201", servicio: "Fontanería en casa", cliente: "Carlos Mendoza", calificacion: 4.5 },
        { id: "202", servicio: "Cambio de grifos", cliente: "Lucía Ramírez", calificacion: 5.0 },
      ]
    : [];

  // 📌 Guardar cambios
  const guardarEdicion = () => {
    alert("✅ Perfil actualizado con éxito.");
    setEditando(false);
  };

  if (loading) {
    return <p className="loading-msg">⏳ Cargando perfil...</p>;
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>👤 Perfil de Usuario</h1>

        <div className="perfil-container">
          {/* 📸 Foto de perfil y detalles básicos */}
          <div className="perfil-detalles">
            <img src="https://via.placeholder.com/120" alt="Foto de perfil" className="perfil-imagen" />
            <h2>{nombre}</h2>
            <p>📧 {usuario.correo}</p>
            <p>📞 {telefono}</p>
            <p>🆔 ID: {id}</p>
            <p>⭐ {usuario.calificacion ? usuario.calificacion + " / 5" : "Sin calificaciones"}</p>
            <p className={estado === "Activo" ? "estadoActivo" : "estadoSuspendido"}>🔵 Estado: {estado}</p>
          </div>

          {/* ✏ Formulario de edición */}
          {editando ? (
            <div className="perfil-edicion">
              <label>Nombre:</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />

              <label>Teléfono:</label>
              <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />

              <label>Estado:</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="Activo">Activo</option>
                <option value="Suspendido">Suspendido</option>
              </select>

              {usuario.tipo === "Proveedor" && (
                <>
                  <label>Categoría:</label>
                  <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
                </>
              )}

              <button className="btn-guardar" onClick={guardarEdicion}>💾 Guardar Cambios</button>
            </div>
          ) : (
            <button className="btn-editar" onClick={() => setEditando(true)}>✏ Editar Perfil</button>
          )}

          {/* 📜 Historial de Servicios Solicitados */}
          <div className="perfil-historial">
            <h3>📋 Historial de Servicios Solicitados</h3>
            {historialSolicitados.length > 0 ? (
              <ul>
                {historialSolicitados.map((item) => (
                  <li key={item.id}>📌 {item.servicio} - {item.fecha} - {item.estado}</li>
                ))}
              </ul>
            ) : (
              <p>❌ No ha solicitado servicios.</p>
            )}
          </div>

          {/* 🛠 Historial de Servicios Prestados */}
          {usuario.tipo === "Proveedor" && (
            <div className="perfil-historial">
              <h3>🛠 Historial de Servicios Prestados</h3>
              {historialPrestados.length > 0 ? (
                <ul>
                  {historialPrestados.map((item) => (
                    <li key={item.id}>🛠 {item.servicio} - Cliente: {item.cliente} - ⭐ {item.calificacion} / 5</li>
                  ))}
                </ul>
              ) : (
                <p>❌ No ha prestado servicios aún.</p>
              )}
            </div>
          )}

          {/* 🔙 Botón de regreso */}
          <button className="btn-volver" onClick={() => navigate("/user-management")}>⬅ Volver a Usuarios</button>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
