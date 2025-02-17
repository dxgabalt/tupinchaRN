import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { AuthService } from "../services/AuthService";

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [editandoUsuario, setEditandoUsuario] = useState(null);

  // Cargar usuarios desde el servicio
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const usuariosObtenidos = await AuthService.obtenerUsuarios();
        console.log("Usuarios obtenidos:", usuariosObtenidos);
        setUsuarios(usuariosObtenidos);
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
      }
    };

    cargarUsuarios();
  }, []);

  // Guardar cambios en usuario editado
  const guardarEdicion = (id, nuevoNombre, nuevoEstado, nuevaCategoria) => {
    setUsuarios(prev =>
      prev.map(user =>
        user.id === id ? { ...user, nombre: nuevoNombre, estado: nuevoEstado, categoria: nuevaCategoria } : user
      )
    );
    setEditandoUsuario(null);
  };

  // Eliminar usuario
  const eliminarUsuario = id => {
    if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
      setUsuarios(prev => prev.filter(user => user.id !== id));
    }
  };

  // Ordenar manualmente los proveedores
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

                  <button className="btn-editar" onClick={() => setEditandoUsuario(usuario.id)}>✏ Editar</button>

                  <button className="btn-eliminar" onClick={() => eliminarUsuario(usuario.id)}>❌ Eliminar</button>

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
