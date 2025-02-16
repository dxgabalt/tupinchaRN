import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";

const usuariosSimulados = [
  { id: "1", nombre: "Rogelio Martínez", tipo: "Proveedor", categoria: "Fontanería", correo: "rogelio@email.com", telefono: "+505 8888 1111", calificacion: 4.8, estado: "Activo", orden: 1 },
  { id: "2", nombre: "Andrés López", tipo: "Proveedor", categoria: "Electricidad", correo: "andres@email.com", telefono: "+505 8888 2222", calificacion: 4.5, estado: "Activo", orden: 2 },
  { id: "3", nombre: "Ramiro Sánchez", tipo: "Cliente", correo: "ramiro@email.com", telefono: "+505 8888 3333", calificacion: null, estado: "Suspendido", orden: 3 },
];

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState(usuariosSimulados);
  const [editandoUsuario, setEditandoUsuario] = useState(null);

  // ✏ Guardar cambios en usuario editado
  const guardarEdicion = (id, nuevoNombre, nuevoEstado, nuevaCategoria) => {
    setUsuarios(prev =>
      prev.map(user =>
        user.id === id ? { ...user, nombre: nuevoNombre, estado: nuevoEstado, categoria: nuevaCategoria } : user
      )
    );
    setEditandoUsuario(null);
  };

  // ❌ Eliminar usuario
  const eliminarUsuario = id => {
    if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
      setUsuarios(prev => prev.filter(user => user.id !== id));
    }
  };

  // 🔼🔽 Ordenar manualmente los proveedores
  const moverProveedor = (id, direccion) => {
    const index = usuarios.findIndex(user => user.id === id);
    if (index < 0) return;

    let nuevoOrden = [...usuarios];
    if (direccion === "arriba" && index > 0) {
      [nuevoOrden[index], nuevoOrden[index - 1]] = [nuevoOrden[index - 1], nuevoOrden[index]];
    } else if (direccion === "abajo" && index < usuarios.length - 1) {
      [nuevoOrden[index], nuevoOrden[index + 1]] = [nuevoOrden[index + 1], nuevoOrden[index]];
    }
    setUsuarios(nuevoOrden);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>👥 Gestión de Usuarios</h1>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Tipo</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>⭐ Calificación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={usuario.id}>
                <td>{index + 1}</td>

                {/* ✏ Editar usuario en línea */}
                <td>
                  {editandoUsuario === usuario.id ? (
                    <input
                      type="text"
                      defaultValue={usuario.nombre}
                      onBlur={(e) => guardarEdicion(usuario.id, e.target.value, usuario.estado, usuario.categoria)}
                    />
                  ) : (
                    usuario.nombre
                  )}
                </td>

                <td>{usuario.tipo}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.calificacion ? usuario.calificacion + " / 5" : "N/A"}</td>
                <td className={usuario.estado === "Activo" ? "estadoActivo" : "estadoSuspendido"}>
                  {editandoUsuario === usuario.id ? (
                    <select defaultValue={usuario.estado} onBlur={(e) => guardarEdicion(usuario.id, usuario.nombre, e.target.value, usuario.categoria)}>
                      <option value="Activo">Activo</option>
                      <option value="Suspendido">Suspendido</option>
                    </select>
                  ) : (
                    usuario.estado
                  )}
                </td>

                <td>
                  {/* 🔍 Ver perfil */}
                  <button
  className="btn-ver"
  onClick={() => {
    if (usuario && usuario.id) {
      navigate(`/user-profile/${usuario.id}`, { state: { usuario } });
    } else {
      alert("⚠ Error: Usuario no encontrado.");
    }
  }}
>
  🔍 Ver Perfil
</button>


                  {/* ✏ Editar usuario */}
                  <button className="btn-editar" onClick={() => setEditandoUsuario(usuario.id)}>✏ Editar</button>

                  {/* ❌ Eliminar usuario */}
                  <button className="btn-eliminar" onClick={() => eliminarUsuario(usuario.id)}>❌ Eliminar</button>

                  {/* 🔼🔽 Ordenar proveedores manualmente */}
                  {usuario.tipo === "Proveedor" && (
                    <>
                      <button className="btn-orden" onClick={() => moverProveedor(usuario.id, "arriba")}>🔼</button>
                      <button className="btn-orden" onClick={() => moverProveedor(usuario.id, "abajo")}>🔽</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default UserManagementPage;
