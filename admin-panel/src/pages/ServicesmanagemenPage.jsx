import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/global.css";
import { ServiceService } from "../services/Service.Service";
import { ImageService } from "../services/ImageService";

const ServicesManagementPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [id, setId] = useState(0);
  const [category, setCategory] = useState("");
  const [icono, setIcono] = useState("");
  const [imagen, setImagen] = useState("");
  const [prioridad, setPrioridad] = useState(0);
  const [subcategories, setSubCategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    obtenerServicios();
  }, []);

  const obtenerServicios = async () => {
    try {
      const data = await ServiceService.obtenerTodos();
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error("Error obteniendo los servicios:", error);
    }
  };
  const eliminarServicio = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este servicio?")) {
      await ServiceService.eliminar(id);
      obtenerServicios();
    }
  };

  const guardarServicio = async () => {
    try {
      const tags = { subcategorias: [...subcategories] };
      const url_imagen =
        imagen !== null || imagen != ""
          ? imagen
          : await ImageService.uploadBase64Image(imagen, "categories");
      if (modoEdicion) {
        await ServiceService.actualizar(id, {
          category,
          tags,
          icono,
          imagen: url_imagen,
          prioridad,
        });
      } else {
        await ServiceService.crear({
          category,
          tags,
          icono,
          imagen: url_imagen,
          prioridad,
        });
      }
      setModalAbierto(false);
      obtenerServicios();
    } catch (error) {
      console.error("Error guardando el servicio:", error);
    }
  };
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const abrirModal = (servicio = null) => {
    if (servicio) {
      setId(servicio.id);
      setCategory(servicio.category);
      setIcono(servicio.icono);
      setImagen(servicio.imagen);
      setPrioridad(servicio.prioridad);
      setSubCategories(Object.values(servicio.tags.subcategorias));
      setModoEdicion(true);
    } else {
      const ultima_prioridad = services[services.length - 1]?.prioridad;
      setId(0);
      setCategory("");
      setIcono("");
      setImagen("");
      setPrioridad(ultima_prioridad + 1);
      setSubCategories([]);
      setModoEdicion(false);
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };
  // 📌 Función para actualizar la prioridad de un servicio
  const actualizarPrioridad = async (id, nuevaPrioridad) => {
    try {
      // Copia de los servicios actuales
      const nuevosServicios = [...services];

      // Encontrar el servicio que se está actualizando
      const servicioActualizado = nuevosServicios.find(
        (service) => service.id === id
      );

      // Verificar si la nueva prioridad ya existe
      const prioridadExistente = nuevosServicios.find(
        (service) => service.prioridad === nuevaPrioridad
      );

      if (prioridadExistente) {
        // Si la prioridad ya existe, intercambiar las prioridades
        prioridadExistente.prioridad = servicioActualizado.prioridad;
      }

      // Actualizar la prioridad del servicio seleccionado
      servicioActualizado.prioridad = nuevaPrioridad;

      // Ordenar los servicios por prioridad
      nuevosServicios.sort((a, b) => a.prioridad - b.prioridad);

      // Actualizar el estado
      setServices(nuevosServicios);

      // Actualizar en el backend
      await ServiceService.actualizar(servicioActualizado.id, {
        prioridad: servicioActualizado.prioridad,
      });

      if (prioridadExistente) {
        await ServiceService.actualizar(prioridadExistente.id, {
          prioridad: prioridadExistente.prioridad,
        });
      }
    } catch (error) {
      console.error("Error actualizando la prioridad:", error);
      alert("❌ Error actualizando la prioridad.");
    }
  };

  // 📌 Función para incrementar la prioridad
  const incrementarPrioridad = (id, prioridadActual) => {
    const nuevaPrioridad = prioridadActual - 1;
    if (nuevaPrioridad > 0) {
      actualizarPrioridad(id, nuevaPrioridad);
    }
  };

  // 📌 Función para decrementar la prioridad
  const decrementarPrioridad = (id, prioridadActual) => {
    const nuevaPrioridad = prioridadActual + 1;
    if (nuevaPrioridad > 0) {
      actualizarPrioridad(id, nuevaPrioridad);
    }
  };
  // ✅ Añadir una subcategoría
  const agregarSubcategoria = () => {
    if (newSubcategory.trim() !== "") {
      setSubCategories([...subcategories, newSubcategory.trim()]);
      setNewSubcategory("");
    }
  };

  // ✅ Eliminar una subcategoría
  const eliminarSubcategoria = (index) => {
    const nuevasSubcategorias = subcategories.filter((_, i) => i !== index);
    setSubCategories(nuevasSubcategorias);
  };

  // ✅ Actualizar una subcategoría en la tabla
  const actualizarSubcategoria = (index, nuevoValor) => {
    const nuevasSubcategorias = [...subcategories];
    nuevasSubcategorias[index] = nuevoValor;
    setSubCategories(nuevasSubcategorias);
  };

  if (loading) {
    return <p className="loading-msg">⏳ Cargando servicios...</p>;
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <h1>🛠 Administración de Servicios</h1>

        <div className="services-container">
          <button className="btn-agregar" onClick={() => abrirModal()}>
            ➕ Agregar Nuevo Servicio
          </button>

          <table className="table-services">
            <thead>
              <tr>
                <th>Prioridad</th>
                <th>Categoria</th>
                <th>Tags</th>
                <th>Icono</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        className="btn-flecha"
                        onClick={() =>
                          decrementarPrioridad(service.id, service.prioridad)
                        }
                      >
                        ⇩
                      </button>
                      <span style={{ margin: "0 10px", fontSize: "18px" }}>
                        {service.prioridad}
                      </span>
                      <button
                        className="btn-flecha"
                        onClick={() =>
                          incrementarPrioridad(service.id, service.prioridad)
                        }
                      >
                        ⇧
                      </button>
                    </div>
                  </td>
                  <td>{service.category}</td>
                  <td>
                    {Object.values(service.tags.subcategorias).map(
                      (subcategoria) => (
                        <p key={subcategoria}>{subcategoria}</p>
                      )
                    )}
                  </td>
                  <td>{service.icono}</td>
                  <td>
                    {service.imagen && (
                      <img src={service.imagen} alt="imagen" width="48" />
                    )}
                  </td>
                  <td>
                    <button  className="btn-editar" onClick={() => abrirModal(service)}>
                      ✏️ Editar
                    </button>
                    <button  className="btn-eliminar" onClick={() => eliminarServicio(service.id)}>
                      ❌ Elimminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Modal para añadir/editar servicio */}
        {modalAbierto && (
          <div className="modal">
            <div className="modal-content">
              <h2>
                {modoEdicion ? "Editar Servicio" : "Agregar Nuevo Servicio"}
              </h2>

              <label>Categoría</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <label>Icono</label>
              <input
                type="text"
                value={icono}
                onChange={(e) => setIcono(e.target.value)}
              />

              <label>Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
              />
              {imagen && (
                <img src={imagen} alt="Vista previa" className="preview-img" />
              )}
              {/* ✅ Tabla de subcategorías */}
              <div>
                <h3>Subcategorías</h3>
                <div>
                  <input
                    type="text"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    placeholder="Nueva subcategoría"
                  />
                  <button onClick={agregarSubcategoria}>➕ Añadir</button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcategories.map((sub, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            value={sub}
                            onChange={(e) =>
                              actualizarSubcategoria(index, e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <button onClick={() => eliminarSubcategoria(index)}>
                            ❌ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-actions">
                <button onClick={guardarServicio}>💾 Guardar</button>
                <button onClick={cerrarModal}>❌ Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ServicesManagementPage;
