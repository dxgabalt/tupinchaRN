"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  ScrollView,
  Animated,
  Alert,
  Linking,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ServiceService } from "../services/ServiceService"
import { MunicipioService } from "../services/MunicipoService"
import { ProvinciaService } from "../services/ProvinciaService"
import { AuthService } from "../services/AuthService"
import { Provincia } from "../models/Provincia"
import { Municipio } from "../models/Municipio"

const PantallaNegocios = () => {
  const navigation = useNavigation()
  const [busqueda, setBusqueda] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null)
  const [nombreProvinciaSeleccionada, setNombreProvinciaSeleccionada] = useState(null)
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState(null)
  const [nombreMunicipioSeleccionado, setNombreMunicipioSeleccionado] = useState(null)
  const [menuVisible, setMenuVisible] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [usuario, setUsuario] = useState({ id: "", name: "", email: "", phone: "", profile_pic_url: "", user_id: "" })
  const [mostrarMunicipios, setMostrarMunicipios] = useState(false)

  // Animación del Menú Hamburguesa
  const menuAnim = useRef(new Animated.Value(-300)).current
  const overlayAnim = useRef(new Animated.Value(0)).current

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

  // Obtener usuario autenticado
  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const profile = await AuthService.obtenerPerfil()
        setUsuario(profile || usuario)
        setProvinciaSeleccionada(profile?.provincias.id)
        setNombreProvinciaSeleccionada(profile?.provincias.nombre)
        setMunicipioSeleccionado(profile?.municipios.id)
        setNombreMunicipioSeleccionado(profile?.municipios.name)
      } catch (error) {
        console.error("Error obteniendo usuario:", error)
      }
    }
    obtenerUsuario()
  }, [])

  // Obtener las provincias
  useEffect(() => {
    const obtenerProvincias = async () => {
      try {
        const provincias = await ProvinciaService.obtenerTodos()
        setProvincias(provincias)
      } catch (error) {
        console.error("Error obteniendo provincias:", error)
      }
    }
    obtenerProvincias()
  }, [])

  // Obtener municipios cuando una provincia es seleccionada
  useEffect(() => {
    if (provinciaSeleccionada) {
      const obtenerMunicipios = async () => {
        try {
          const municipios = await MunicipioService.obtenerTodos({ provincia_id: provinciaSeleccionada })
          setMunicipios(municipios)
        } catch (error) {
          console.error("Error obteniendo municipios:", error)
        }
      }
      obtenerMunicipios()
    }
  }, [provinciaSeleccionada])

  // Obtener las categorías
  const obtenerCategorias = async () => {
    try {
      const servicios = await ServiceService.obtenerTodos()
      setCategorias(
        servicios.map((servicio) => ({
          id: servicio.id,
          category: servicio.category,
          icono: servicio.icono,
          tags: servicio.tags,
        })),
      )
    } catch (error) {
      console.error("Error obteniendo servicios:", error)
    }
  }

  useEffect(() => {
    obtenerCategorias()
  }, [])

  const handlePress = () => {
    Linking.openURL("https://servicios.tupincha.com/shop/")
  }

  const seleccionarUbicacion = () => {
    setModalVisible(true)
    setMunicipioSeleccionado(null)
    setNombreMunicipioSeleccionado(null)
  }

  const contactar = () => {
    const numero = "+5355655190"
    const mensaje = encodeURIComponent("Hola, necesito ayuda con la aplicación.")
    Linking.openURL(`https://wa.me/${numero}?text=${mensaje}`)
  }

  const buscar = (texto) => {
    if (texto.length === 0) {
      obtenerCategorias()
    } else {
      setCategorias(
        categorias.filter(
          (c) =>
            c.category.toLowerCase().includes(texto.toLowerCase()) ||
            c.tags?.subcategorias?.some((sub) => sub.toLowerCase().includes(texto.toLowerCase())),
        ),
      )
    }

    setBusqueda(texto)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#0047AB" barStyle="light-content" />
      <View style={styles.container}>
        {/* Overlay para el menú lateral */}
        {menuVisible && <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} onTouchStart={toggleMenu} />}

        {/* Menú Lateral con Animación */}
        <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnim }] }]}>
          <View style={styles.menuHeader}>
            <Image
              source={{ uri: usuario.profile_pic_url || "https://via.placeholder.com/100" }}
              style={styles.menuProfilePic}
            />
            <Text style={styles.menuProfileName}>{usuario.name || "Usuario"}</Text>
            <Text style={styles.menuProfileEmail}>{usuario.email || "usuario@email.com"}</Text>
          </View>

          <ScrollView style={styles.menuScrollView}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("PantallaNegocios")
              }}
            >
              <Text style={styles.menuItemIcon}>🔎</Text>
              <Text style={styles.menuText}>Buscar Proveedores</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("PantallaHistorialUsuario")
              }}
            >
              <Text style={styles.menuItemIcon}>🕒</Text>
              <Text style={styles.menuText}>Historial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("PantallaSoporteFAQ")
              }}
            >
              <Text style={styles.menuItemIcon}>❓</Text>
              <Text style={styles.menuText}>Soporte</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("PantallaNotificacion")
              }}
            >
              <Text style={styles.menuItemIcon}>🔔</Text>
              <Text style={styles.menuText}>Notificaciones</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("MiPerfil")
              }}
            >
              <Text style={styles.menuItemIcon}>👤</Text>
              <Text style={styles.menuText}>Mi Perfil</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.menuFooter}>
            <TouchableOpacity
              style={styles.menuLogoutButton}
              onPress={async () => {
                const logoutSuccess = await AuthService.logout()
                if (logoutSuccess) {
                  navigation.replace("Login")
                } else {
                  Alert.alert("Error", "No se pudo cerrar sesión.")
                }
              }}
            >
              <Text style={styles.menuItemIcon}>🚪</Text>
              <Text style={styles.menuLogoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCloseButton} onPress={toggleMenu}>
              <Text style={styles.menuCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.bienvenida}>Hola, {usuario.name || "Usuario"}</Text>
            <View style={styles.ubicacionContainer}>
              <Text style={styles.ubicacionIcon}>📍</Text>
              <Text style={styles.ubicacion}>{nombreProvinciaSeleccionada || "Selecciona ubicación"}</Text>
            </View>
          </View>
        </View>

        {/* Contenido Principal */}
        <View style={styles.mainContent}>
          {/* Barra de búsqueda */}
          <View style={styles.barraBusqueda}>
            <Text style={styles.iconoBusqueda}>🔍</Text>
            <TextInput
              style={styles.inputBusqueda}
              placeholder="Buscar servicio..."
              placeholderTextColor="#888"
              value={busqueda}
              onChangeText={buscar}
            />
          </View>

          {/* Botón para seleccionar ubicación */}
          <TouchableOpacity style={styles.botonUbicacion} onPress={seleccionarUbicacion}>
            <Text style={styles.iconoUbicacion}>📍</Text>
            <Text style={styles.textoUbicacion}>
              {provinciaSeleccionada
                ? `${nombreProvinciaSeleccionada}${nombreMunicipioSeleccionado ? ` - ${nombreMunicipioSeleccionado}` : ""}`
                : "Seleccionar Ubicación"}
            </Text>
          </TouchableOpacity>

          {/* Título de Categorías */}
          <View style={styles.categoriasHeader}>
            <Text style={styles.categoriasTitle}>Servicios Disponibles</Text>
            <Text style={styles.categoriasSubtitle}>Selecciona la categoría que necesitas</Text>
          </View>

          {/* Categorías */}
          <FlatList
            data={categorias}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.categoriasContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cardCategoria}
                onPress={() =>
                  navigation.navigate("PantallaResultadosBusqueda", {
                    servicio: item.category,
                    service_id: item.id,
                    municipio_id: municipioSeleccionado,
                    provincia_id: provinciaSeleccionada,
                  })
                }
              >
                <View style={styles.categoriaIconContainer}>
                  <Text style={styles.categoriaIcon}>{item.icono}</Text>
                </View>
                <Text style={styles.textoCategoria} numberOfLines={1} ellipsizeMode="tail">
                  {item.category}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Banners Promocionales - Ahora en fila horizontal */}
          <View style={styles.bannersRow}>
            <TouchableOpacity 
              style={[styles.banner, styles.bannerCompras]} 
              onPress={handlePress}
            >
              <View style={styles.bannerContent}>
                <Text style={styles.bannerIcon}>🛒</Text>
                <Text style={styles.bannerText}>Realiza tus compras aquí</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.banner, styles.bannerSoporte]} 
              onPress={contactar}
            >
              <View style={styles.bannerContent}>
                <Text style={styles.bannerIcon}>📞</Text>
                <Text style={styles.bannerText}>Atención Personalizada</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal de selección de ubicación */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {!mostrarMunicipios ? "Selecciona una Provincia" : "Selecciona un Municipio"}
                </Text>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCloseIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              {mostrarMunicipios && (
                <TouchableOpacity onPress={() => setMostrarMunicipios(false)} style={styles.backButton}>
                  <Text style={styles.backButtonIcon}>←</Text>
                  <Text style={styles.backButtonText}>Volver a Provincias</Text>
                </TouchableOpacity>
              )}

              {!mostrarMunicipios ? (
                <FlatList
                  data={provincias}
                  keyExtractor={(item) => item.id.toString()}
                  style={styles.modalList}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.modalOption, provinciaSeleccionada === item.id && styles.modalOptionActive]}
                      onPress={() => {
                        setProvinciaSeleccionada(item.id)
                        setNombreProvinciaSeleccionada(item.nombre)
                        setMunicipioSeleccionado(null)
                        setNombreMunicipioSeleccionado(null)
                        setMostrarMunicipios(true)
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          provinciaSeleccionada === item.id && styles.modalOptionTextActive,
                        ]}
                      >
                        {item.nombre}
                      </Text>
                      <Text style={styles.modalOptionIcon}>›</Text>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <>
                  <Text style={styles.modalSubtitle}>
                    {nombreProvinciaSeleccionada} - Selecciona un municipio (Opcional)
                  </Text>
                  <FlatList
                    data={municipios}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.modalList}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[styles.modalOption, municipioSeleccionado === item.id && styles.modalOptionActive]}
                        onPress={() => {
                          setMunicipioSeleccionado(item.id)
                          setNombreMunicipioSeleccionado(item.name)
                          setModalVisible(false)
                        }}
                      >
                        <Text
                          style={[
                            styles.modalOptionText,
                            municipioSeleccionado === item.id && styles.modalOptionTextActive,
                          ]}
                        >
                          {item.name}
                        </Text>
                        <Text style={styles.modalOptionIcon}>›</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => {
                      setMunicipioSeleccionado(null)
                      setNombreMunicipioSeleccionado(null)
                      setModalVisible(false)
                    }}
                  >
                    <Text style={styles.skipButtonText}>Omitir selección de municipio</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  )
}

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: "#0047AB", // Azul principal
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
    backgroundColor: "#0047AB",
    alignItems: "center",
    paddingTop: 40,
  },
  menuProfilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  menuProfileName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  menuProfileEmail: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.8,
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
    fontSize: 20,
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
    backgroundColor: "#0047AB",
    paddingTop: Platform.OS === "ios" ? 0 : 10,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  headerContent: {
    marginLeft: 10,
  },
  bienvenida: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  ubicacionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ubicacionIcon: {
    fontSize: 14,
    color: "#FFFFFF",
    marginRight: 4,
  },
  ubicacion: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
  },
  mainContent: {
    flex: 1,
    padding: 15,
  },
  barraBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconoBusqueda: {
    fontSize: 16,
    marginRight: 10,
    color: "#888888",
  },
  inputBusqueda: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333333",
  },
  botonUbicacion: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53935", // Rojo
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconoUbicacion: {
    fontSize: 16,
    marginRight: 10,
    color: "#FFFFFF",
  },
  textoUbicacion: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  categoriasHeader: {
    marginBottom: 15,
  },
  categoriasTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  categoriasSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  categoriasContainer: {
    paddingBottom: 15,
  },
  cardCategoria: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 10,
    margin: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 100,
    justifyContent: "center",
  },
  categoriaIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoriaIcon: {
    fontSize: 24,
  },
  textoCategoria: {
    fontSize: 12,
    textAlign: "center",
    color: "#333333",
    fontWeight: "500",
  },
  // Nuevos estilos para los banners en fila
  bannersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  banner: {
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bannerCompras: {
    backgroundColor: "#E53935", // Rojo
  },
  bannerSoporte: {
    backgroundColor: "#2E7D32", // Verde
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  bannerIcon: {
    fontSize: 20,
    marginRight: 10,
    color: "#FFFFFF",
  },
  bannerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    margin: 20,
    overflow: "hidden",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    backgroundColor: "#0047AB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  modalCloseButton: {
    padding: 5,
  },
  modalCloseIcon: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666666",
    padding: 15,
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: "#F8F8F8",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButtonIcon: {
    fontSize: 18,
    marginRight: 10,
    color: "#0047AB",
  },
  backButtonText: {
    fontSize: 15,
    color: "#0047AB",
    fontWeight: "500",
  },
  modalList: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  modalOptionActive: {
    backgroundColor: "#F0F4FF",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333333",
  },
  modalOptionTextActive: {
    color: "#0047AB",
    fontWeight: "bold",
  },
  modalOptionIcon: {
    fontSize: 18,
    color: "#BBBBBB",
  },
  skipButton: {
    padding: 15,
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  skipButtonText: {
    fontSize: 15,
    color: "#666666",
  },
}

export default PantallaNegocios