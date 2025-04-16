"use client"

import { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  ScrollView,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import SolicitudService from "../../services/SolicitudService"
import type { Solicitud } from "../../models/Solicitud"
import { AuthService } from "../../services/AuthService"
import CotizacionService from "../../services/CotizacionService"
import type { CotizacionNota } from "../../models/CotizacionNota"
import ContraOfertaService from "../../services/ContraOfertaService"
import { MaterialIcons } from "@expo/vector-icons" // Assuming you're using Expo
import { StyleSheet } from "react-native"

const { width } = Dimensions.get("window")

const PantallaGestionSolicitudes = () => {
  const navigation = useNavigation()
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const [descripcion, setDescripcion] = useState("")
  const [costoManoObra, setCostoManoObra] = useState("")
  const [costoMateriales, setCostoMateriales] = useState("")
  const [request, setRequest] = useState(0)
  const [provider, setProvider] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [respuestaNota, setRespuestaNota] = useState("")
  const [nuevaNota, setNuevaNota] = useState("")
  const [precio, setPrecio] = useState({})
  const [cotizacionesNotas, setCotizacionesNotas] = useState({})
  const [nuevaNotaSolicitud, setNuevaNotaSolicitud] = useState({})
  const [expandedCards, setExpandedCards] = useState({})
  const [refreshing, setRefreshing] = useState(false)

  // Animaciones
  const menuAnim = useRef(new Animated.Value(-300)).current
  const overlayAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animación de entrada de la lista
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [])

  /** 🔥 Cargar Solicitudes del Proveedor */
  const obtenerSolicitudes = async () => {
    try {
      setLoading(true)
      const user = await AuthService.obtenerPerfil()
      const user_id = user.user_id || ""
      const provider_id = user.provider.id || ""
      setProvider(provider_id)
      const data = await SolicitudService.obtenerSolicitudesComoProveedor(user_id)
      setSolicitudes(data)
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las solicitudes.", [
        { text: "Reintentar", onPress: () => obtenerSolicitudes() },
      ])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    obtenerSolicitudes()
  }, [])

  /** 📌 Aceptar/Rechazar Solicitud */
  const manejarSolicitud = async (idSolicitud: number, estado: string) => {
    try {
      // Mostrar confirmación antes de proceder
      if (estado === "Rechazada") {
        Alert.alert("Confirmar acción", "¿Estás seguro de que deseas rechazar esta solicitud?", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Rechazar",
            style: "destructive",
            onPress: async () => {
              await actualizarEstadoSolicitud(idSolicitud, estado)
            },
          },
        ])
      } else {
        await actualizarEstadoSolicitud(idSolicitud, estado)
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.")
    }
  }

  const actualizarEstadoSolicitud = async (idSolicitud: number, estado: string) => {
    try {
      await SolicitudService.actualizarEstadoSolicitud(idSolicitud, estado, true)

      // Mostrar mensaje de éxito
      const mensaje =
        estado === "aceptada por proveedor" ? "Solicitud aceptada con éxito" : "Solicitud rechazada con éxito"
      Alert.alert("Éxito", mensaje)

      // Actualizar el estado local
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((solicitud) =>
          solicitud.id === idSolicitud ? { ...solicitud, status: estado } : solicitud,
        ),
      )
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.")
    }
  }

  /** 📌 Mostrar/Ocultar Menú */
  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
    Animated.parallel([
      Animated.timing(menuAnim, {
        toValue: menuVisible ? -300 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: menuVisible ? 0 : 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }

  /** 📌 Cerrar Sesión */
  const cerrarSesion = async () => {
    try {
      if (Platform.OS === "web") {
        const confirmacion = window.confirm("¿Estás seguro de que deseas cerrar sesión?")
        if (confirmacion) {
          AuthService.logout().then(() => {
            navigation.replace("Login")
          })
        }
      } else {
        Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Cerrar sesión",
            style: "destructive",
            onPress: async () => {
              await AuthService.logout()
              navigation.replace("Login")
            },
          },
        ])
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.")
    }
  }

  /** 📌 Guardar Cotizacion */
  const handleGuardar = () => {
    // Validar campos
    if (!descripcion.trim()) {
      Alert.alert("Error", "Por favor ingresa una descripción")
      return
    }

    if (!costoManoObra.trim() || isNaN(Number(costoManoObra))) {
      Alert.alert("Error", "Por favor ingresa un costo de mano de obra válido")
      return
    }

    if (!costoMateriales.trim() || isNaN(Number(costoMateriales))) {
      Alert.alert("Error", "Por favor ingresa un costo de materiales válido")
      return
    }

    CotizacionService.agregarCotizacion(provider, request, costoManoObra, costoMateriales, descripcion)

    const nuevoItemCotizacion = {
      id: obtenerUltimoIdCotizacion(request) ?? 0 + 1,
      costo_mano_obra: costoManoObra,
      costo_materiales: costoMateriales,
      descripcion: descripcion,
    }

    setSolicitudes((prevSolicitudes) =>
      prevSolicitudes.map((solicitud) =>
        solicitud.id === request
          ? {
              ...solicitud,
              cotizaciones: [...solicitud.cotizaciones, nuevoItemCotizacion],
            }
          : solicitud,
      ),
    )

    // Limpiar campos y cerrar modal
    setDescripcion("")
    setCostoManoObra("")
    setCostoMateriales("")
    setModalVisible(false)

    // Mostrar confirmación
    Alert.alert("Éxito", "Cotización enviada correctamente")
  }

  const obtenerUltimoIdCotizacion = (idSolicitud: number) => {
    const solicitud = solicitudes.find((solicitud) => solicitud.id === idSolicitud)

    if (solicitud && solicitud.cotizaciones.length > 0) {
      const ultimoId = solicitud.cotizaciones[solicitud.cotizaciones.length - 1].id
      return ultimoId
    } else {
      return null
    }
  }

  const mostarModalCotizacion = (request_id: number) => {
    setRequest(request_id)
    setModalVisible(true)
  }

  const handleGuardarRespuesta = (notaCotizacionId: number, nota: CotizacionNota) => {
    const respuesta = cotizacionesNotas[notaCotizacionId]?.texto

    if (!respuesta || !respuesta.trim()) {
      Alert.alert("Error", "Por favor ingresa una respuesta")
      return
    }

    CotizacionService.agregarNotaCotizacion(notaCotizacionId, respuesta, true)

    setSolicitudes((prevSolicitudes) =>
      prevSolicitudes.map((solicitud) => {
        const updatedCotizaciones = solicitud.cotizaciones.map((cotizacion) => {
          return {
            ...cotizacion,
            cotizacion_notas: cotizacion.cotizacion_notas.map((notaItem) => {
              if (notaItem.id === notaCotizacionId) {
                if (!notaItem.nota_provider) {
                  return {
                    ...notaItem,
                    nota_provider: respuesta,
                  }
                }
              }
              return notaItem
            }),
          }
        })

        return {
          ...solicitud,
          cotizaciones: updatedCotizaciones,
        }
      }),
    )

    // Limpiar el estado de la respuesta
    setCotizacionesNotas((prevState) => ({
      ...prevState,
      [notaCotizacionId]: { texto: "" },
    }))
    setRespuestaNota("")
  }

  const handleCrearNota = (contraofertaId: number, respuesta: string) => {
    if (!respuesta || !respuesta.trim()) {
      Alert.alert("Error", "Por favor ingresa una nota")
      return
    }

    ContraOfertaService.agregarNotaContraOferta(contraofertaId, respuesta, true)

    setSolicitudes((prevSolicitudes) =>
      prevSolicitudes.map((solicitud) => {
        const updatedContraofertas = solicitud.contraofertas.map((contraoferta) => {
          if (contraoferta.id === contraofertaId) {
            const updatedNotas = contraoferta.contraoferta_notas.some(
              (notaItem) => notaItem.nota_provider === respuesta,
            )
              ? contraoferta.contraoferta_notas.map((notaItem) => ({
                  ...notaItem,
                  nota_provider: notaItem.nota_provider || respuesta,
                }))
              : [
                  ...contraoferta.contraoferta_notas,
                  {
                    contraoferta_id: contraofertaId,
                    nota_client: "",
                    nota_provider: respuesta,
                    created_at: new Date().toISOString(),
                  },
                ]

            return {
              ...contraoferta,
              contraoferta_notas: updatedNotas,
            }
          }
          return contraoferta
        })

        return {
          ...solicitud,
          contraofertas: updatedContraofertas,
        }
      }),
    )

    // Limpiar el estado de la respuesta
    setNuevaNota("")
  }

  const handleCrearNotaSolicitud = async (request_id: number, nota: string) => {
    if (!nota || !nota.trim()) {
      Alert.alert("Error", "Por favor ingresa una nota")
      return
    }

    const nuevoItemNotaSolicitud = {
      id: obtenerUltimoIdNotaSolicitud(request_id) ?? 0 + 1,
      nota_client: "",
      nota_provider: nota,
    }

    await SolicitudService.agregarNotaCotizacion(request_id, nota, true)

    setSolicitudes((prevSolicitudes) =>
      prevSolicitudes.map((solicitud) =>
        solicitud.id === request_id
          ? {
              ...solicitud,
              request_notas: [...solicitud.request_notas, nuevoItemNotaSolicitud],
            }
          : solicitud,
      ),
    )

    // Limpiar el campo de nota
    setNuevaNotaSolicitud((prev) => ({
      ...prev,
      [request_id]: "",
    }))
  }

  const obtenerUltimoIdNotaSolicitud = (idSolicitud: number) => {
    const solicitud = solicitudes.find((solicitud) => solicitud.id === idSolicitud)

    if (solicitud && solicitud.request_notas.length > 0) {
      const ultimoId = solicitud.request_notas[solicitud.request_notas.length - 1].id
      return ultimoId
    } else {
      return null
    }
  }

  // 📌 Manejar cambio de texto en notas cotizacion
  const handleCambioNotaCotizacion = (notaCotizacionId: number, texto: string) => {
    setCotizacionesNotas((prevState) => ({
      ...prevState,
      [notaCotizacionId]: {
        ...prevState[notaCotizacionId],
        texto,
      },
    }))
  }

  const handleCambioPrecio = (id: number, precio: number) => {
    setPrecio((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        precio,
      },
    }))
  }

  const establecerPrecio = async (id) => {
    if (!precio[id]?.precio) {
      Alert.alert("Error", "Por favor ingresa un precio válido")
      return
    }

    const precio_input = precio[id].precio

    try {
      await SolicitudService.actualizarPrecio(id, precio_input)

      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((solicitud) => (solicitud.id === id ? { ...solicitud, price: precio_input } : solicitud)),
      )

      // Limpiar el precio después de establecerlo
      setPrecio((prevState) => ({
        ...prevState,
        [id]: { precio: "" },
      }))

      // Mostrar confirmación
      Alert.alert("Éxito", "Precio establecido correctamente")
    } catch (error) {
      Alert.alert("Error", "No se pudo establecer el precio")
    }
  }

  const toggleCardExpansion = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleRefresh = () => {
    setRefreshing(true)
    obtenerSolicitudes()
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return dateString
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#003366" barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        {/* Overlay para el menú lateral */}
        {menuVisible && <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} onTouchStart={toggleMenu} />}

        {/* Menú Lateral con Animación */}
        <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnim }] }]}>
          <View style={styles.menuHeader}>
            <MaterialIcons name="business" size={40} color="#FFFFFF" />
            <Text style={styles.menuTitle}>Panel de Proveedor</Text>
          </View>

          <ScrollView style={styles.menuScrollView}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("GestionServicios")
              }}
            >
              <MaterialIcons name="settings" size={24} color="#0047AB" style={styles.menuItemIcon} />
              <Text style={styles.menuText}>Gestionar Servicios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("PantallaNotificacion")
              }}
            >
              <MaterialIcons name="notifications" size={24} color="#0047AB" style={styles.menuItemIcon} />
              <Text style={styles.menuText}>Notificaciones</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.menuFooter}>
            <TouchableOpacity style={styles.menuLogoutButton} onPress={cerrarSesion}>
              <MaterialIcons name="logout" size={24} color="#E53935" style={styles.menuItemIcon} />
              <Text style={styles.menuLogoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCloseButton} onPress={toggleMenu}>
              <Text style={styles.menuCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <MaterialIcons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Solicitudes Recibidas</Text>
            <Text style={styles.headerTitle}></Text>
          </View>
        </View>

        {/* Lista de Solicitudes */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0047AB" />
            <Text style={styles.loadingText}>Cargando solicitudes...</Text>
          </View>
        ) : solicitudes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={64} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No hay solicitudes</Text>
            <Text style={styles.emptyDescription}>No tienes solicitudes en este momento</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleRefresh}>
              <Text style={styles.emptyButtonText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.FlatList
            data={solicitudes}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            style={{ opacity: fadeAnim }}
            renderItem={({ item }) => (
              <View style={styles.requestCard}>
                {/* Información principal de la solicitud */}
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="work" size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestDescription}>{item.request_description}</Text>
                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <MaterialIcons name="event" size={14} color="#666666" />
                        <Text style={styles.metaText}>{formatDate(item.service_date)}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <MaterialIcons name="attach-money" size={14} color="#666666" />
                        <Text style={styles.metaText}>{item.price || "0"} USD</Text>
                      </View>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="location-on" size={14} color="#666666" />
                      <Text style={styles.metaText}>direccion: {item.direccion || "Sin dirección"}</Text>
                    </View>

                    {/* Estado de la solicitud */}
                    <View style={styles.statusContainer}>
                      <Text
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              item.status === "pendiente"
                                ? "#FFC107"
                                : item.status.includes("aceptada")
                                  ? "#4CAF50"
                                  : "#F44336",
                          },
                        ]}
                      >
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Botones de acción - Directamente en la tarjeta como en la imagen de referencia */}
                {item.status === "Pendiente" && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => manejarSolicitud(item.id, "aceptada por proveedor")}
                    >
                      <MaterialIcons name="check" size={20} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Aceptar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => manejarSolicitud(item.id, "Rechazada")}
                    >
                      <MaterialIcons name="close" size={20} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Rechazar</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Sección de notas */}
                <View style={styles.notesSection}>
                  <Text style={styles.notesLabel}>Notas:</Text>
                  <TextInput
                    style={styles.notesInput}
                    placeholder="Escribir nueva nota..."
                    value={nuevaNotaSolicitud[item.id] || ""}
                    onChangeText={(text) => setNuevaNotaSolicitud((prev) => ({ ...prev, [item.id]: text }))}
                    multiline
                  />
                  <TouchableOpacity
                    style={styles.addNoteButton}
                    onPress={() => handleCrearNotaSolicitud(item.id, nuevaNotaSolicitud[item.id] || "")}
                  >
                    <Text style={styles.addNoteButtonText}>Agregar Nota</Text>
                  </TouchableOpacity>
                </View>

                {/* Botón para cotizar si está aceptada */}
                {(item.status === "aceptada" || item.status === "aceptada por proveedor") && (
                  <TouchableOpacity style={styles.quoteButton} onPress={() => mostarModalCotizacion(item.id)}>
                    <MaterialIcons name="receipt" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Enviar Cotización</Text>
                  </TouchableOpacity>
                )}

                {/* Mostrar notas existentes si hay */}
                {item.request_notas.length > 0 && (
                  <View style={styles.existingNotes}>
                    {item.request_notas.map((nota, index) => (
                      <View key={index} style={styles.noteItem}>
                        {nota.nota_provider && (
                          <View style={styles.providerMessage}>
                            <Text style={styles.messageText}>{nota.nota_provider}</Text>
                          </View>
                        )}
                        {nota.nota_client && (
                          <View style={styles.clientMessage}>
                            <Text style={styles.messageText}>{nota.nota_client}</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          />
        )}

        {/* Modal de Cotización */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Nueva Cotización</Text>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Descripción</Text>
                  <TextInput
                    style={styles.formTextArea}
                    placeholder="Detalle los servicios incluidos en esta cotización..."
                    value={descripcion}
                    onChangeText={setDescripcion}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Costo de Mano de Obra (USD)</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={costoManoObra}
                    onChangeText={setCostoManoObra}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Costo de Materiales (USD)</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={costoMateriales}
                    onChangeText={setCostoMateriales}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Total (USD)</Text>
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalAmount}>
                      {(Number.parseFloat(costoManoObra) || 0) + (Number.parseFloat(costoMateriales) || 0)}
                    </Text>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
                  <Text style={styles.saveButtonText}>Enviar Cotización</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#003366",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    zIndex: 1,
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 280,
    height: "100%",
    backgroundColor: "#FFFFFF",
    zIndex: 2,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    display: "flex",
    flexDirection: "column",
  },
  menuHeader: {
    padding: 20,
    backgroundColor: "#003366",
    alignItems: "center",
    paddingTop: 40,
  },
  menuTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  menuScrollView: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuItemIcon: {
    marginRight: 15,
    width: 24,
    textAlign: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#333333",
  },
  menuFooter: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  menuLogoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F8F8F8",
  },
  menuLogoutText: {
    fontSize: 16,
    color: "#E53935",
    fontWeight: "500",
  },
  menuCloseButton: {
    padding: 15,
    alignItems: "center",
    backgroundColor: "#EEEEEE",
  },
  menuCloseText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  header: {
    backgroundColor: "#003366",
    paddingTop: Platform.OS === "ios" ? 0 : 10,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: "#0047AB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0047AB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestDescription: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 4,
  },
  statusContainer: {
    marginTop: 5,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    overflow: "hidden",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 6,
    marginRight: 8,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#F44336",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  notesSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 10,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  addNoteButton: {
    backgroundColor: "#0047AB",
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },
  addNoteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  existingNotes: {
    marginTop: 10,
  },
  noteItem: {
    marginBottom: 8,
  },
  clientMessage: {
    backgroundColor: "#F0F4FF",
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 4,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  providerMessage: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 12,
    borderTopRightRadius: 4,
    maxWidth: "80%",
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 14,
    color: "#333333",
  },
  quoteButton: {
    backgroundColor: "#0047AB",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
  },
  modalHeader: {
    backgroundColor: "#0047AB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    padding: 15,
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  formTextArea: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
  },
  totalContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0047AB",
  },
  modalFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    padding: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    borderRadius: 6,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "500",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#0047AB",
    paddingVertical: 12,
    borderRadius: 6,
    marginLeft: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
})

export default PantallaGestionSolicitudes

