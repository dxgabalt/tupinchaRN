import { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Animated,
  ActivityIndicator,
  Linking,
  StatusBar,
  SafeAreaView,
  Share,
  FlatList,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ProviderServiceService } from "../services/ProviderServiceService"
import type { ProviderService } from "../models/ProviderService"
import { MaterialIcons } from "@expo/vector-icons"
import { PinchGestureHandler } from "react-native-gesture-handler"
import { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

const PantallaDetallesProveedor = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { idProveedor } = route.params || {}

  const [proveedor, setProveedor] = useState<ProviderService | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeTab, setActiveTab] = useState("info") // 'info', 'portfolio', 'reviews'

  // Animaciones
  const menuAnim = useRef(new Animated.Value(-300)).current
  const overlayAnim = useRef(new Animated.Value(0)).current
  const scale = useSharedValue(1)

  // Obtener imágenes del portafolio
  const portfolioImages =
    proveedor?.providers.portafolio_provider?.map((portafolio) => ({
      uri: portafolio.imagen,
    })) || []
    const servicios= proveedor?.providers.portafolio_provider?.map(servicio => servicio.especialidad).join(', ');

  // Gestor de gestos para zoom de imágenes
  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale
    },
    onEnd: () => {
      scale.value = withSpring(1)
    },
  })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  // Animación del Menú Hamburguesa
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

  // Función para contactar al proveedor por WhatsApp
  const contactarProveedor = () => {
    const mensaje = `Hola, lo contacto desde la app TuPincha. Necesito sus servicios de: ${proveedor?.providers.description}`
    abrirWhatsApp(proveedor?.providers.phone || "", mensaje)
  }

  // Función para abrir WhatsApp
  const abrirWhatsApp = (phone: string, mensaje: string) => {
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`)
  }

  // Función para llamar al proveedor
  const llamarProveedor = () => {
    if (proveedor?.providers.phone) {
      Linking.openURL(`tel:${proveedor.providers.phone}`)
    } else {
      Alert.alert("Error", "No hay número de teléfono disponible")
    }
  }

  // Función para compartir perfil del proveedor
  const compartirPerfil = async () => {
    try {
      await Share.share({
        message: `Mira este proveedor de servicios en TuPincha: ${proveedor?.providers.profiles.name} - ${proveedor?.providers.speciality}. ¡Contáctalo para tus necesidades!`,
      })
    } catch (error) {
      Alert.alert("Error", "No se pudo compartir el perfil")
    }
  }

  // Obtener datos del proveedor
  useEffect(() => {
    const obtenerProveedor = async () => {
      try {
        const providerService = await ProviderServiceService.obtenerPorId(idProveedor)
        console.log(providerService);
        
        setProveedor(providerService)
        
      } catch (error) {
        console.error("Error obteniendo datos del proveedor:", error)
        Alert.alert("Error", "No se pudo cargar la información del proveedor.")
      } finally {
        setLoading(false)
      }
    }
    obtenerProveedor()
  }, [idProveedor])

  // Renderizar estrellas de calificación
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<MaterialIcons key={i} name="star" size={18} color="#FFD700" />)
      } else if (i === fullStars && halfStar) {
        stars.push(<MaterialIcons key={i} name="star-half" size={18} color="#FFD700" />)
      } else {
        stars.push(<MaterialIcons key={i} name="star-outline" size={18} color="#FFD700" />)
      }
    }

    return (
      <View style={styles.starsContainer}>
        {stars}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    )
  }

  // Renderizar imagen en pantalla completa
  const openImageFullscreen = (imageUri) => {
    setSelectedImage(imageUri)
    setImageModalVisible(true)
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
            <MaterialIcons name="person" size={40} color="#FFFFFF" />
            <Text style={styles.menuTitle}>Menú Principal</Text>
          </View>

          <ScrollView style={styles.menuScrollView}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("PantallaInicio")
              }}
            >
              <MaterialIcons name="home" size={24} color="#0047AB" style={styles.menuItemIcon} />
              <Text style={styles.menuText}>Inicio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("PantallaNegocios")
              }}
            >
              <MaterialIcons name="search" size={24} color="#0047AB" style={styles.menuItemIcon} />
              <Text style={styles.menuText}>Buscar Proveedores</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("PantallaHistorialUsuario")
              }}
            >
              <MaterialIcons name="history" size={24} color="#0047AB" style={styles.menuItemIcon} />
              <Text style={styles.menuText}>Historial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("PantallaSoporteFAQ")
              }}
            >
              <MaterialIcons name="help" size={24} color="#0047AB" style={styles.menuItemIcon} />
              <Text style={styles.menuText}>Soporte</Text>
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

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu()
                navigation.navigate("MiPerfil")
              }}
            >
              <MaterialIcons name="person" size={24} color="#0047AB" style={styles.menuItemIcon} />
              <Text style={styles.menuText}>Mi Perfil</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity style={styles.menuCloseButton} onPress={toggleMenu}>
            <Text style={styles.menuCloseText}>Cerrar</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <MaterialIcons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Detalles del Proveedor</Text>
            <TouchableOpacity style={styles.shareButton} onPress={compartirPerfil}>
              <MaterialIcons name="share" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0047AB" />
            <Text style={styles.loadingText}>Cargando información...</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Imagen de Portada y Perfil */}
            <View style={styles.coverContainer}>
              <Image
                source={{ uri: proveedor?.providers.profiles.profile_pic_url || "https://via.placeholder.com/400x200" }}
                style={styles.coverImage}
              />
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: proveedor?.providers.profiles.profile_pic_url || "https://via.placeholder.com/100" }}
                  style={styles.profileImage}
                />
              </View>
            </View>

            {/* Información del Proveedor */}
            <View style={styles.providerInfoContainer}>
              <Text style={styles.providerName}>{proveedor?.providers.profiles.name || "Nombre no disponible"}</Text>
              <Text style={styles.providerSpecialty}>
                {proveedor?.providers.speciality || "Especialidad no disponible"}
              </Text>

              <View style={styles.locationContainer}>
                <MaterialIcons name="location-on" size={16} color="#0047AB" />
                <Text style={styles.locationText}>
                  {proveedor?.providers.profiles.provincias.nombre || "Provincia"} -{" "}
                  {proveedor?.providers.profiles.municipios.name || "Municipio"}
                </Text>
              </View>

              {renderStars(proveedor?.providers.profiles.rating || 0)}
            </View>

            {/* Pestañas de navegación */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "info" && styles.activeTab]}
                onPress={() => setActiveTab("info")}
              >
                <MaterialIcons name="info" size={20} color={activeTab === "info" ? "#0047AB" : "#666666"} />
                <Text style={[styles.tabText, activeTab === "info" && styles.activeTabText]}>Información</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === "portfolio" && styles.activeTab]}
                onPress={() => setActiveTab("portfolio")}
              >
                <MaterialIcons
                  name="photo-library"
                  size={20}
                  color={activeTab === "portfolio" ? "#0047AB" : "#666666"}
                />
                <Text style={[styles.tabText, activeTab === "portfolio" && styles.activeTabText]}>Portafolio</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
                onPress={() => setActiveTab("reviews")}
              >
                <MaterialIcons name="star" size={20} color={activeTab === "reviews" ? "#0047AB" : "#666666"} />
                <Text style={[styles.tabText, activeTab === "reviews" && styles.activeTabText]}>Reseñas</Text>
              </TouchableOpacity>
            </View>

            {/* Contenido según la pestaña seleccionada */}
            <View style={styles.tabContent}>
              {activeTab === "info" && (
                <View style={styles.infoContainer}>
                  <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                      <MaterialIcons name="description" size={20} color="#0047AB" />
                      <Text style={styles.sectionTitle}>Sobre el Servicio</Text>
                    </View>
                    <Text style={styles.descriptionText}>
                      {proveedor?.providers.description || "No hay descripción disponible."}
                    </Text>
                  </View>

                  <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                      <MaterialIcons name="work" size={20} color="#0047AB" />
                      <Text style={styles.sectionTitle}>Servicios Ofrecidos</Text>
                    </View>
                    <View style={styles.servicesList}>
                      {servicios.length>0 ? (
                        <View style={styles.serviceItem}>
                          <Text style={styles.serviceText}>{servicios}</Text>
                        </View>
                      ) : (
                        <Text style={styles.noDataText}>No hay servicios listados.</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                      <MaterialIcons name="schedule" size={20} color="#0047AB" />
                      <Text style={styles.sectionTitle}>Horario de Atención</Text>
                    </View>
                    <Text style={styles.scheduleText}>Lunes a Viernes: 8:00 AM - 6:00 PM</Text>
                    <Text style={styles.scheduleText}>Sábados: 8:00 AM - 2:00 PM</Text>
                    <Text style={styles.scheduleText}>Domingos: Cerrado</Text>
                  </View>
                </View>
              )}

              {activeTab === "portfolio" && (
                <View style={styles.portfolioContainer}>
                  {portfolioImages.length > 0 ? (
                    <FlatList
                      data={portfolioImages}
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={2}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.portfolioImageContainer}
                          onPress={() => openImageFullscreen(item.uri)}
                        >
                          <Image source={{ uri: item.uri }} style={styles.portfolioImage} />
                        </TouchableOpacity>
                      )}
                    />
                  ) : (
                    <View style={styles.emptyPortfolio}>
                      <MaterialIcons name="photo-library" size={48} color="#CCCCCC" />
                      <Text style={styles.emptyPortfolioText}>No hay imágenes en el portafolio</Text>
                    </View>
                  )}
                </View>
              )}

              {activeTab === "reviews" && (
                <View style={styles.reviewsContainer}>
                  <View style={styles.overallRating}>
                    <Text style={styles.ratingNumber}>{proveedor?.providers.profiles.rating?.toFixed(1) || "0.0"}</Text>
                    {renderStars(proveedor?.providers.profiles.rating || 0)}
                    <Text style={styles.totalReviews}>Basado en 0 reseñas</Text>
                  </View>

                  <View style={styles.emptyReviews}>
                    <MaterialIcons name="rate-review" size={48} color="#CCCCCC" />
                    <Text style={styles.emptyReviewsText}>No hay reseñas disponibles</Text>
                    <Text style={styles.emptyReviewsSubtext}>Sé el primero en dejar una reseña</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Botones de Acción */}
            <View style={styles.actionButtonsContainer}>
              {proveedor?.providers.is_premium && (
                <TouchableOpacity style={styles.actionButton} onPress={contactarProveedor}>
                  <MaterialIcons name="chat" size={24} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Contactar</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.primaryActionButton}
                onPress={() =>
                  navigation.navigate("PantallaSolicitudServicio", {
                    proveedor,
                    idProveedor: proveedor?.provider_id,
                    service_id: proveedor?.services.id,
                  })
                }
              >
                <MaterialIcons name="handyman" size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Solicitar Servicio</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* Modal para ver imagen en pantalla completa */}
        <Modal
          visible={imageModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setImageModalVisible(false)}>
              <MaterialIcons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <PinchGestureHandler onGestureEvent={pinchHandler}>
              <Animated.View style={[styles.fullscreenImageContainer, animatedStyle]}>
                <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} resizeMode="contain" />
              </Animated.View>
            </PinchGestureHandler>
          </View>
        </Modal>
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
  },
  menuHeader: {
    padding: 20,
    backgroundColor: "#0047AB",
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
    paddingBottom: 15,
  },
  headerTop: {
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
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    position: "relative",
    height: 200,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  profileImageContainer: {
    position: "absolute",
    bottom: -50,
    left: 20,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  providerInfoContainer: {
    marginTop: 60,
    paddingHorizontal: 20,
  },
  providerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  providerSpecialty: {
    fontSize: 16,
    color: "#666666",
    marginTop: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  locationText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 5,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  ratingText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 5,
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#0047AB",
  },
  tabText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 5,
  },
  activeTabText: {
    color: "#0047AB",
    fontWeight: "bold",
  },
  tabContent: {
    padding: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginLeft: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
  },
  servicesList: {
    marginTop: 10,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 10,
  },
  noDataText: {
    fontSize: 14,
    color: "#999999",
    fontStyle: "italic",
  },
  scheduleText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 5,
  },
  portfolioContainer: {
    marginBottom: 20,
  },
  portfolioImageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  portfolioImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  emptyPortfolio: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyPortfolioText: {
    fontSize: 16,
    color: "#999999",
    marginTop: 10,
    textAlign: "center",
  },
  reviewsContainer: {
    marginBottom: 20,
  },
  overallRating: {
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  ratingNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#0047AB",
    marginBottom: 5,
  },
  totalReviews: {
    fontSize: 14,
    color: "#666666",
    marginTop: 5,
  },
  emptyReviews: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyReviewsText: {
    fontSize: 16,
    color: "#999999",
    marginTop: 10,
    textAlign: "center",
  },
  emptyReviewsSubtext: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 5,
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#0047AB",
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryActionButton: {
    flex: 1.5,
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  fullscreenImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "80%",
  },
}

export default PantallaDetallesProveedor
