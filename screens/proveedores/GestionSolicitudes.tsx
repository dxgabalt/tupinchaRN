import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  ScrollView,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/stylesGestionSolicitudes";
import SolicitudService from "../../services/SolicitudService";
import { Solicitud } from "../../models/Solicitud";
import { AuthService } from "../../services/AuthService";
import CotizacionService from "../../services/CotizacionService";
import { CotizacionNota } from "../../models/CotizacionNota";
import { ContraOfertaNota } from "../../models/ContraOfertaNota";
import ContraOfertaService from "../../services/ContraOfertaService";

const PantallaGestionSolicitudes = () => {
  const navigation = useNavigation();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(-300)).current;
  const [descripcion, setDescripcion] = useState("");
  const [costoManoObra, setCostoManoObra] = useState("");
  const [costoMateriales, setCostoMateriales] = useState("");
  const [request, setRequest] = useState(0);
  const [provider, setProvider] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [respuestaNota, setRespuestaNota] = useState("");
  const [nuevaNota, setNuevaNota] = useState("");
  const [cotizacionesNotas, setCotizacionesNotas] = useState({});

  const [nuevaNotaSolicitud, setNuevaNotaSolicitud] = useState("");

  /** 🔥 Cargar Solicitudes del Proveedor */
  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const user = await AuthService.obtenerPerfil();
        const user_id = user.user_id || "";
        const provider_id = user.provider.id || "";
        setProvider(provider_id);
        const data = await SolicitudService.obtenerSolicitudesComoProveedor(
          user_id
        );
        setSolicitudes(data);
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar las solicitudes.");
      } finally {
        setLoading(false);
      }
    };
    obtenerSolicitudes();
  }, []);

  /** 📌 Aceptar/Rechazar Solicitud */
  const manejarSolicitud = async (idSolicitud: number, estado: string) => {
    try {
      await SolicitudService.actualizarEstadoSolicitud(
        idSolicitud,
        estado,
        true
      );
      Alert.alert("Éxito", `Solicitud ${estado} con éxito`);

      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((solicitud) =>
          solicitud.id === idSolicitud
            ? { ...solicitud, status: estado }
            : solicitud
        )
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    }
  };

  /** 📌 Mostrar/Ocultar Menú */
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnim, {
      toValue: menuVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  /** 📌 Cerrar Sesión */
  const cerrarSesion = async () => {
    try {
      await AuthService.logout();
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };
  /** 📌 Guardar Cotizacion */
  const handleGuardar = () => {
    CotizacionService.agregarCotizacion(
      provider,
      request,
      costoManoObra,
      costoMateriales,
      descripcion
    );
    const nuevoItemCotizacion = {
      id: obtenerUltimoIdCotizacion(request) ?? 0 + 1, // Incrementar el id de la cotización
      costo_mano_obra: costoManoObra, // Ejemplo de costo
      costo_materiales: costoMateriales, // Ejemplo de costo
      descripcion: descripcion, // Descripción
    };

    setSolicitudes((prevSolicitudes) =>
      prevSolicitudes.map((solicitud) =>
        solicitud.id === request
          ? {
              ...solicitud,
              cotizaciones: [...solicitud.cotizaciones, nuevoItemCotizacion],
            }
          : solicitud
      )
    );
    setModalVisible(false);
  };
  const obtenerUltimoIdCotizacion = (idSolicitud: number) => {
    // Encuentra la solicitud correspondiente
    const solicitud = solicitudes.find(
      (solicitud) => solicitud.id === idSolicitud
    );

    if (solicitud && solicitud.cotizaciones.length > 0) {
      // Obtener el último id de la cotización
      const ultimoId =
        solicitud.cotizaciones[solicitud.cotizaciones.length - 1].id;
      return ultimoId;
    } else {
      // Si no hay cotizaciones, devuelve null o cualquier valor predeterminado
      return null;
    }
  };
  const mostarModalCotizacion = (request_id: number) => {
    setRequest(request_id);
    setModalVisible(true);
  };
  const handleGuardarRespuesta = (
    notaCotizacionId: number,
    nota: CotizacionNota
  ) => {
    // Aquí se podría enviar la respuesta al backend si es necesario
    const respuesta = cotizacionesNotas[notaCotizacionId]?.texto;
    CotizacionService.agregarNotaCotizacion(notaCotizacionId, respuesta, true);
    // Actualizar la cotización correspondiente con la respuesta
    setSolicitudes((prevSolicitudes) =>
      prevSolicitudes.map((solicitud) => {
        // Actualizar la cotización específica dentro de la solicitud
        const updatedCotizaciones = solicitud.cotizaciones.map((cotizacion) => {
          // Actualizar el campo nota_provider con la respuesta
          return {
            ...cotizacion,
            cotizacion_notas: cotizacion.cotizacion_notas.map((notaItem) => {
              if (notaItem.id === notaCotizacionId) {
                if (!notaItem.nota_provider) {
                  return {
                    ...notaItem,
                    nota_provider: respuesta, // Actualiza la respuesta del proveedor
                  };
                }
              }
              return notaItem;
            }),
          };

          return cotizacion;
        });

        return {
          ...solicitud,
          cotizaciones: updatedCotizaciones, // Actualiza el arreglo de cotizaciones
        };

        return solicitud;
      })
    );
    // Limpiar el estado de la respuesta
    cotizacionesNotas[notaCotizacionId] = { texto: " " };
    setRespuestaNota("");
  };
  const handleCrearNota = (contraofertaId: number, respuesta: string) => {
    // Aquí se podría enviar la respuesta al backend si es necesario
    ContraOfertaService.agregarNotaContraOferta(
      contraofertaId,
      respuesta,
      true
    );
    // Actualizar la cotización correspondiente con la respuesta
    ContraOfertaService.agregarNotaContraOferta(
      contraofertaId,
      respuesta,
      true
    );

    // Actualizar la cotización correspondiente con la respuesta
    setSolicitudes((prevSolicitudes) =>
      prevSolicitudes.map((solicitud) => {
        // Actualizar la cotización específica dentro de la solicitud
        const updatedContraofertas = solicitud.contraofertas.map(
          (contraoferta) => {
            if (contraoferta.id === contraofertaId) {
              // Verificar si ya existe una nota con la respuesta en contraoferta_notas
              const updatedNotas = contraoferta.contraoferta_notas.some(
                (notaItem) => notaItem.nota_provider === respuesta
              )
                ? contraoferta.contraoferta_notas.map((notaItem) => ({
                    ...notaItem,
                    nota_provider: notaItem.nota_provider || respuesta, // Solo actualiza si está vacío
                  }))
                : [
                    ...contraoferta.contraoferta_notas,
                    {
                      contraoferta_id: contraofertaId,
                      nota_client: "", // Si es una nota del proveedor, se puede dejar vacío o asignar un valor
                      nota_provider: respuesta,
                      created_at: new Date().toISOString(), // Fecha actual
                    },
                  ];

              return {
                ...contraoferta,
                contraoferta_notas: updatedNotas,
              };
            }
            return contraoferta;
          }
        );

        return {
          ...solicitud,
          contraofertas: updatedContraofertas,
        };
      })
    );
    // Limpiar el estado de la respuesta
    setNuevaNota("");
  };
  const handleCrearNotaSolicitud = async (request_id: number, nota: string) => {
    const nuevoItemNotaSolicitud = {
      id: obtenerUltimoIdNotaSolicitud(request_id) ?? 0 + 1, // Incrementar el id de la cotización
      nota_client: "",
      nota_provider: nota,
    };
    await SolicitudService.agregarNotaCotizacion(request_id, nota, true);
    setSolicitudes((prevSolicitudes) =>
      prevSolicitudes.map((solicitud) =>
        solicitud.id === request_id
          ? {
              ...solicitud,
              request_notas: [
                ...solicitud.request_notas,
                nuevoItemNotaSolicitud,
              ],
            }
          : solicitud
      )
    );
  };
  const obtenerUltimoIdNotaSolicitud = (idSolicitud: number) => {
    // Encuentra la solicitud correspondiente
    const solicitud = solicitudes.find(
      (solicitud) => solicitud.id === idSolicitud
    );

    if (solicitud && solicitud.request_notas.length > 0) {
      // Obtener el último id de la cotización
      const ultimoId =
        solicitud.request_notas[solicitud.request_notas.length - 1].id;
      return ultimoId;
    } else {
      // Si no hay cotizaciones, devuelve null o cualquier valor predeterminado
      return null;
    }
  };
  // 📌 Manejar cambio de texto en notas cotizacion
  const handleCambioNotaCotizacion = (
    notaCotizacionId: number,
    texto: string
  ) => {
    setCotizacionesNotas((prevState) => ({
      ...prevState,
      [notaCotizacionId]: {
        ...prevState[notaCotizacionId],
        texto,
      },
    }));
  };
  return (
    <View style={styles.container}>
      {/* 🔥 Menú de Navegación */}
      {menuVisible && <View style={styles.overlay} />}
      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX: menuAnim }] },
        ]}
      >
        <ScrollView>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("GestionServicios")}
          >
            <Text style={styles.menuText}>⚙️ Gestionar Servicios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("PantallaNotificacion")}
          >
            <Text style={styles.menuText}>🔔 Notificaciones</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={cerrarSesion}>
            <Text style={styles.menuText}>🚪 Cerrar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCerrar} onPress={toggleMenu}>
            <Text style={styles.menuCerrarTexto}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* 🔥 Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>📌 Solicitudes Recibidas</Text>
      </View>

      {/* 🔥 Lista de Solicitudes */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF0314" />
          <Text style={styles.loadingText}>Cargando solicitudes...</Text>
        </View>
      ) : solicitudes.length === 0 ? (
        <Text style={styles.noSolicitudes}>No hay solicitudes pendientes.</Text>
      ) : (
        <FlatList
          data={solicitudes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                item.status === "aceptada"
                  ? styles.cardAceptada
                  : styles.cardPendiente,
              ]}
            >
              {/* 📸 Imagen del Solicitante */}
              <Image
                source={{
                  uri:
                    item.images ||
                    "https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fc568691151fc5cece853c_broker_listing_distribution.png",
                }}
                style={styles.imagenSolicitante}
              />

              <View style={styles.infoContainer}>
                <Text style={styles.descripcion}>
                  📝 {item.request_description}
                </Text>
                <Text style={styles.fecha}>📅 {item.service_date}</Text>
                <Text style={styles.precio}>💰 {item.price} USD</Text>

                {/* Estado de la solicitud */}
                <Text
                  style={[
                    styles.estado,
                    item.status === "aceptada"
                      ? styles.estadoAceptado
                      : styles.estadoPendiente,
                  ]}
                >
                  {item.status.toUpperCase()}
                </Text>

                {item.status !== "Rechazada" && (
                  <View style={styles.botonesContainer}>
                    {(item.status === "aceptada" ||
                      item.status === "aceptada por proveedor") && (
                      <TouchableOpacity
                        style={styles.botonCotizar}
                        onPress={() => mostarModalCotizacion(item.id)}
                      >
                        <Text style={styles.textoBoton}>
                          🛒📝 Enviar Cotizacion
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.botonAceptar}
                      onPress={() =>
                        manejarSolicitud(item.id, "aceptada por proveedor")
                      }
                    >
                      <Text style={styles.textoBoton}>✅ Aceptar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.botonRechazar}
                      onPress={() => manejarSolicitud(item.id, "Rechazada")}
                    >
                      <Text style={styles.textoBoton}>❌ Rechazar</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {/* 🔥 Listado de Notas */}
                {item.status !== "Rechazada" && (
                  <View style={styles.cardCotizacion}>
                    <Text style={styles.subTitulo}>Notas:</Text>
                    <FlatList
                      data={item.request_notas}
                      keyExtractor={(nota) => nota.id.toString()}
                      renderItem={({ item: nota }) => (
                        <View style={styles.notaItem}>
                          {/* Fecha para el Cliente (updated_at) */}
                          {nota.nota_client && (
                            <Text
                              style={[styles.fechaNota, styles.fechaCliente]}
                            >
                              📅{" "}
                              {new Date(nota.created_at).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Text>
                          )}

                          {/* Nota del Cliente */}
                          {nota.nota_provider && (
                            <View style={styles.burbujaCliente}>
                              <Text style={styles.notaTextoCliente}>
                                🏢 {nota.nota_provider}
                              </Text>
                            </View>
                          )}

                          {/* Nota del Proveedor */}
                          {nota.nota_client && (
                            <View style={styles.burbujaProveedor}>
                              <Text style={styles.notaTextoProveedor}>
                                🧑‍💼 {nota.nota_client}
                              </Text>
                            </View>
                          )}

                          {/* Fecha para el Proveedor (created_at) */}
                          {nota.nota_client && (
                            <Text
                              style={[styles.fechaNota, styles.fechaProveedor]}
                            >
                              📅{" "}
                              {new Date(nota.updated_at).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Text>
                          )}
                        </View>
                      )}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Escribir nueva nota..."
                      value={nuevaNotaSolicitud}
                      onChangeText={setNuevaNotaSolicitud}
                    />
                    <TouchableOpacity
                      style={styles.boton}
                      onPress={() =>
                        handleCrearNotaSolicitud(item.id, nuevaNotaSolicitud)
                      }
                    >
                      <Text style={styles.textoBoton}>Agregar Nota</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {/* 🔥 Listado de Cotizaciones */}
                <FlatList
                  data={item.cotizaciones}
                  keyExtractor={(cotizacion) => cotizacion.id.toString()}
                  renderItem={({ item: cotizacion }) => (
                    <View style={styles.cardCotizacion}>
                      {/* Costo Mano de Obra */}
                      <View style={styles.cardContent}>
                        <Text style={styles.icon}>🛠️</Text>
                        <Text style={styles.precio}>
                          Costo Mano de Obra: {cotizacion.costo_mano_obra}
                        </Text>
                      </View>

                      {/* Costo Materiales */}
                      <View style={styles.cardContent}>
                        <Text style={styles.icon}>⚙️</Text>
                        <Text style={styles.precio}>
                          Costo Materiales: {cotizacion.costo_materiales}
                        </Text>
                      </View>

                      {/* Descripción */}
                      <View style={styles.cardContent}>
                        <Text style={styles.icon}>📝</Text>
                        <Text style={styles.descripcion}>
                          Descripción: {cotizacion.descripcion}
                        </Text>
                      </View>

                      {/* 🔥 Notas de Cotización */}
                      {cotizacion.cotizacion_notas?.length > 0 && (
                        <View style={styles.notasContainer}>
                          <Text style={styles.tituloNotas}>🗒️ Notas:</Text>
                          <FlatList
                            data={cotizacion.cotizacion_notas}
                            keyExtractor={(nota, index) => index.toString()}
                            renderItem={({ item: nota }) => (
                              <View style={styles.notaItem}>
                                {/* Fecha para el Cliente (updated_at) */}
                                {nota.nota_client && (
                                  <Text
                                    style={[
                                      styles.fechaNota,
                                      styles.fechaCliente,
                                    ]}
                                  >
                                    📅{" "}
                                    {new Date(
                                      nota.updated_at
                                    ).toLocaleDateString("es-ES", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </Text>
                                )}
                                {/* Nota del Cliente */}
                                {nota.nota_client && (
                                  <View style={styles.burbujaCliente}>
                                    <Text style={styles.notaTextoCliente}>
                                      🧑‍💼 {nota.nota_client}
                                    </Text>
                                  </View>
                                )}

                                {/* Nota del Proveedor */}
                                {nota.nota_provider && (
                                  <View style={styles.burbujaProveedor}>
                                    <Text style={styles.notaTextoProveedor}>
                                      🏢 {nota.nota_provider}
                                    </Text>
                                  </View>
                                )}
                                {nota.nota_provider && (
                                  <Text
                                    style={[
                                      styles.fechaNota,
                                      styles.fechaProveedor,
                                    ]}
                                  >
                                    📅{" "}
                                    {new Date(
                                      nota.created_at
                                    ).toLocaleDateString("es-ES", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </Text>
                                )}

                                {/* Responder Nota */}
                                {nota.nota_client &&
                                  !nota.nota_provider &&
                                  item.status !== "Rechazada" && (
                                    <>
                                      <TextInput
                                        style={styles.input}
                                        placeholder="Responder a la nota..."
                                        value={
                                          cotizacionesNotas[nota.id]?.texto ||
                                          ""
                                        }
                                        onChangeText={(texto) =>
                                          handleCambioNotaCotizacion(
                                            nota.id,
                                            texto
                                          )
                                        }
                                      />

                                      <TouchableOpacity
                                        style={styles.boton}
                                        onPress={() =>
                                          handleGuardarRespuesta(nota.id, nota)
                                        }
                                      >
                                        <Text style={styles.textoBoton}>
                                          Responder
                                        </Text>
                                      </TouchableOpacity>
                                    </>
                                  )}
                              </View>
                            )}
                          />
                        </View>
                      )}
                    </View>
                  )}
                />
                {/* 🔥 Listado de Contraofertas */}
                <FlatList
                  data={item.contraofertas}
                  keyExtractor={(contraoferta) => contraoferta.id.toString()}
                  renderItem={({ item: contraoferta }) => (
                    <View style={styles.cardCotizacion}>
                      {/* Costo Mano de Obra */}
                      <View style={styles.cardContent}>
                        <Text style={styles.icon}>🛠️</Text>
                        <Text style={styles.precio}>
                          Costo Mano de Obra: {contraoferta.costo_mano_obra}
                        </Text>
                      </View>

                      {/* Costo Materiales */}
                      <View style={styles.cardContent}>
                        <Text style={styles.icon}>⚙️</Text>
                        <Text style={styles.precio}>
                          Costo Materiales: {contraoferta.costo_materiales}
                        </Text>
                      </View>

                      {/* Descripción */}
                      <View style={styles.cardContent}>
                        <Text style={styles.icon}>📝</Text>
                        <Text style={styles.descripcion}>
                          Descripción: {contraoferta.descripcion}
                        </Text>
                      </View>

                      {/* 🔥 Notas de Cotización */}
                      <View style={styles.notasContainer}>
                        <Text style={styles.tituloNotas}>🗒️ Notas:</Text>

                        {/* Mostrar las notas existentes */}
                        <FlatList
                          data={contraoferta.contraoferta_notas}
                          keyExtractor={(nota, index) => index.toString()}
                          renderItem={({ item: nota }) => (
                            <View style={styles.notaItem}>
                              {/* Fecha para el Cliente (updated_at) */}
                              {nota.nota_client && (
                                <Text
                                  style={[
                                    styles.fechaNota,
                                    styles.fechaCliente,
                                  ]}
                                >
                                  📅{" "}
                                  {new Date(nota.updated_at).toLocaleDateString(
                                    "es-ES",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </Text>
                              )}
                              {/* Nota del Cliente */}
                              {nota.nota_provider && (
                                <View style={styles.burbujaCliente}>
                                  <Text style={styles.notaTextoCliente}>
                                    🏢 {nota.nota_provider}
                                  </Text>
                                </View>
                              )}

                              {/* Nota del Proveedor */}
                              {nota.nota_client && (
                                <View style={styles.burbujaProveedor}>
                                  <Text style={styles.notaTextoProveedor}>
                                    🧑‍💼 {nota.nota_client}
                                  </Text>
                                </View>
                              )}
                              {/* Fecha para el Proveedor (created_at) */}
                              {nota.nota_provider && (
                                <Text
                                  style={[
                                    styles.fechaNota,
                                    styles.fechaProveedor,
                                  ]}
                                >
                                  📅{" "}
                                  {new Date(nota.created_at).toLocaleDateString(
                                    "es-ES",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </Text>
                              )}
                            </View>
                          )}
                        />

                        {/* Agregar una nueva nota */}
                        {item.status !== "Rechazada" && (
                          <View>
                            <TextInput
                              style={styles.input}
                              placeholder="Escribir nueva nota..."
                              value={nuevaNota}
                              onChangeText={setNuevaNota}
                            />

                            <TouchableOpacity
                              style={styles.boton}
                              onPress={() =>
                                handleCrearNota(contraoferta.id, nuevaNota)
                              }
                            >
                              <Text style={styles.textoBoton}>
                                Agregar Nota
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                />
              </View>
            </View>
          )}
        />
      )}

      {/* 🔥 Modal de Cotización */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Ingresar Información</Text>
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
            />
            <TextInput
              style={styles.input}
              placeholder="Costo de Mano de Obra"
              keyboardType="numeric"
              value={costoManoObra}
              onChangeText={setCostoManoObra}
            />
            <TextInput
              style={styles.input}
              placeholder="Costo de Materiales"
              keyboardType="numeric"
              value={costoMateriales}
              onChangeText={setCostoMateriales}
            />
            <TouchableOpacity
              style={styles.botonGuardar}
              onPress={handleGuardar}
            >
              <Text style={styles.textoBoton}>Guardar Cotización</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botonCerrarModal}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textoBoton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PantallaGestionSolicitudes;
