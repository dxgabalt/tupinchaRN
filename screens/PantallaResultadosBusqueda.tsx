"use client"

import { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Platform,
  Dimensions,
  Alert,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ProviderServiceService } from "../services/ProviderServiceService"
import { AuthService } from "../services/AuthService"
import { MaterialIcons, FontAwesome } from "@expo/vector-icons" // Assuming you're using Expo

const { width } = Dimensions.get("window")

const PantallaResultadosBusqueda = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { servicio, service_id, municipio_id, provincia_id } = route.params || {}

  const [busqueda, setBusqueda] = useState("")
  const [fadeAnim] = useState(new Animated.Value(0))
  const [negocios, setNegocios] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const [heights, setHeights] = useState({})
  const [refreshing, setRefreshing] = useState(false)

  const usuarioDefault = { id: "", name: "", email: "", phone: "", profile_pic_url: "", user_id: "" }
  const [usuario, setUsuario] = useState(usuarioDefault)

  const handleLayout = (event, id) => {
    const { height } = event.nativeEvent.layout
    setHeights((prevHeights) => ({ ...prevHeights, [id]: height }))
  }

  // Animación de entrada
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [])

  const obtenerNegocios = async () => {
    try {
      setLoading(true)
      const municipio = municipio_id !== null ? municipio_id : 0
      const provincia = provincia_id !== null ? provincia_id : 0
      const providers_services = await ProviderServiceService.obtenerPorServicio(service_id, municipio, provincia)
      const negociosFormateados = providers_services.map((servicio) => ({
        id: servicio.id,
        nombre: servicio.providers?.profiles?.name || "Sin nombre",
        tags: servicio.services?.tags || [],
        categoria: servicio.services?.category || "Sin categoría",
        descripcion: servicio.providers?.description || "No hay descripción disponible",
        ubicacion:
          servicio.providers?.profiles.provincias.nombre + " - " + servicio.providers?.profiles.municipios.name ||
          "Sin ubicación",
        imagen: servicio.providers?.profiles?.profile_pic_url || "",
        calificacion: servicio.providers?.profiles?.rating || 0,
      }))
      setNegocios(negociosFormateados)
    } catch (error) {
      console.error("Error obteniendo servicios:", error)
      Alert.alert("Error", "No se pudieron cargar los proveedores de servicios")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    obtenerNegocios()
  }, [])

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const profile = await AuthService.obtenerPerfil()
        setUsuario(profile || usuarioDefault)
      } catch (error) {
        console.error("Error obteniendo usuario:", error)
      }
    }
    obtenerUsuario()
  }, [])

  // Filtrar negocios según la búsqueda
  const negociosFiltrados = negocios.filter((negocio) => {
    const searchTerm = busqueda.toLowerCase()
    return (
      negocio.nombre.toLowerCase().includes(searchTerm) ||
      negocio.categoria.toLowerCase().includes(searchTerm) ||
      negocio.descripcion.toLowerCase().includes(searchTerm) ||
      negocio.ubicacion.toLowerCase().includes(searchTerm)
    )
  })

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

  const handleRefresh = () => {
    setRefreshing(true)
    obtenerNegocios()
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FontAwesome key={i} name="star" size={14} color="#FFD700" style={styles.starIcon} />)
      } else if (i === fullStars && halfStar) {
        stars.push(<FontAwesome key={i} name="star-half-o" size={14} color="#FFD700" style={styles.starIcon} />)
      } else {
        stars.push(<FontAwesome key={i} name="star-o" size={14} color="#FFD700" style={styles.starIcon} />)
      }
    }

    return (
      <View style={styles.starsContainer}>
        {stars}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <MaterialIcons name="search-off" size={64} color="#CCCCCC" />
      <Text style={styles.emptyStateTitle}>No se encontraron resultados</Text>
      <Text style={styles.emptyStateDescription}>Intenta con otra búsqueda o cambia los filtros de ubicación</Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={() => navigation.goBack()}>
        <Text style={styles.emptyStateButtonText}>Volver a categorías</Text>
      </TouchableOpacity>
    </View>
  )

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
              <MaterialIcons name="search" size={22} color="#0047AB" style={styles.menuItemIcon} />
              <Text style={styles.menuText}>Buscar Proveedores</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("PantallaHistorialUsuario")
              }}
            >
              <MaterialIcons name="history" size={22} color="#0047AB" style={styles.menuItemIcon} />
              <Text style={styles.menuText}>Historial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("PantallaSoporteFAQ")
              }}
            >
              <MaterialIcons name="help-outline" size={22} color="#0047AB" style={styles.menuItemIcon} />
              <Text style={styles.menuText}>Soporte</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("PantallaNotificacion")
              }}
            >
              <MaterialIcons name="notifications" size={22} color="#0047AB" style={styles.menuItemIcon} />
              <Text style={styles.menuText}>Notificaciones</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("MiPerfil")
              }}
            >
              <MaterialIcons name="person" size={22} color="#0047AB" style={styles.menuItemIcon} />
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
              <MaterialIcons name="logout" size={22} color="#E53935" style={styles.menuItemIcon} />
              <Text style={styles.menuLogoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCloseButton} onPress={toggleMenu}>
              <Text style={styles.menuCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <MaterialIcons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.bienvenida}>Hola, {usuario?.name || "Usuario"}</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerBottom}>
            <View style={styles.serviceContainer}>
              <MaterialIcons name="category" size={20} color="#FFFFFF" style={styles.serviceIcon} />
              <Text style={styles.serviceName}>{servicio || "Servicio"}</Text>
            </View>

            <View style={styles.resultsCount}>
              <Text style={styles.resultsCountText}>
                {negociosFiltrados.length} {negociosFiltrados.length === 1 ? "resultado" : "resultados"}
              </Text>
            </View>
          </View>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={22} color="#888888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar proveedores..."
              placeholderTextColor="#888888"
              value={busqueda}
              onChangeText={setBusqueda}
            />
            {busqueda.length > 0 && (
              <TouchableOpacity onPress={() => setBusqueda("")} style={styles.clearButton}>
                <MaterialIcons name="clear" size={20} color="#888888" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Lista de negocios */}
        <Animated.View style={[{ opacity: fadeAnim }, styles.resultsContainer]}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0047AB" />
              <Text style={styles.loadingText}>Cargando proveedores...</Text>
            </View>
          ) : (
            <FlatList
              data={negociosFiltrados}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.providerCard}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate("PantallaDetallesProveedor", { idProveedor: item.id })}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.providerImageContainer}>
                      {item.imagen ? (
                        <Image source={{ uri: item.imagen }} style={styles.providerImage} resizeMode="cover" />
                      ) : (
                        <View style={styles.providerImagePlaceholder}>
                          <MaterialIcons name="person" size={40} color="#CCCCCC" />
                        </View>
                      )}
                    </View>

                    <View style={styles.providerInfo}>
                      <Text style={styles.providerName} numberOfLines={1}>
                        {item.nombre}
                      </Text>
                      <Text style={styles.providerCategory} numberOfLines={1}>
                        {item.categoria}
                      </Text>

                      <View style={styles.locationContainer}>
                        <MaterialIcons name="location-on" size={14} color="#666666" style={styles.locationIcon} />
                        <Text style={styles.locationText} numberOfLines={1}>
                          {item.ubicacion}
                        </Text>
                      </View>

                      {renderStars(item.calificacion)}
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <Text
                      style={styles.providerDescription}
                      numberOfLines={3}
                      onLayout={(event) => handleLayout(event, item.id)}
                    >
                      {item.descripcion}
                    </Text>

                    {heights[item.id] > 60 && (
                      <TouchableOpacity
                        style={styles.readMoreButton}
                        onPress={() => navigation.navigate("PantallaDetallesProveedor", { idProveedor: item.id })}
                      >
                        <Text style={styles.readMoreText}>Leer más</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => navigation.navigate("PantallaDetallesProveedor", { idProveedor: item.id })}
                    >
                      <Text style={styles.detailsButtonText}>Ver detalles</Text>
                      <MaterialIcons name="arrow-forward" size={16} color="#0047AB" style={styles.detailsButtonIcon} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              ListEmptyComponent={renderEmptyState}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: "#0047AB",
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
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  headerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  bienvenida: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceIcon: {
    marginRight: 8,
  },
  serviceName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  resultsCount: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  resultsCountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  searchContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#333333",
  },
  clearButton: {
    padding: 5,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
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
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  providerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  providerImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
    marginRight: 15,
  },
  providerImage: {
    width: 70,
    height: 70,
  },
  providerImagePlaceholder: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  providerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  providerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  providerCategory: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 13,
    color: "#666666",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 4,
  },
  cardBody: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  providerDescription: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 20,
  },
  readMoreButton: {
    alignSelf: "flex-end",
    marginTop: 5,
  },
  readMoreText: {
    fontSize: 14,
    color: "#0047AB",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    padding: 12,
  },
  contactButton: {
    flex: 1,
    backgroundColor: "#0047AB",
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginRight: 8,
  },
  contactButtonIcon: {
    marginRight: 6,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  detailsButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0047AB",
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginLeft: 8,
  },
  detailsButtonText: {
    color: "#0047AB",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 6,
  },
  detailsButtonIcon: {
    marginLeft: 2,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    marginTop: 50,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: "#0047AB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
}

export default PantallaResultadosBusqueda
