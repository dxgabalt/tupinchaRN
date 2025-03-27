import { useEffect, useState, useRef } from "react"
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
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet
} from "react-native"

import { useNavigation } from "@react-navigation/native"
import SolicitudService from "../../services/SolicitudService"
import type { Solicitud } from "../../models/Solicitud"
import { AuthService } from "../../services/AuthService"
import CotizacionService from "../../services/CotizacionService"
import type { CotizacionNota } from "../../models/CotizacionNota"
import ContraOfertaService from "../../services/ContraOfertaService"
import { MaterialIcons } from "@expo/vector-icons" // Assuming you're using Expo

const { width } = Dimensions.get("window")

const PantallaGestionSolicitudes = () => {
  const navigation = useNavigation();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [costoManoObra, setCostoManoObra] = useState("");
  const [costoMateriales, setCostoMateriales] = useState("");
  const [request, setRequest] = useState(0);
  const [provider, setProvider] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [respuestaNota, setRespuestaNota] = useState("");
  const [nuevaNota, setNuevaNota] = useState("");
  const [precio, setPrecio] = useState({});
  const [cotizacionesNotas, setCotizacionesNotas] = useState({});
  const [nuevaNotaSolicitud, setNuevaNotaSolicitud] = useState("");
  const [expandedCards, setExpandedCards] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState("todas"); // "todas", "pendientes", "aceptadas", "rechazadas"

  // Animación del Menú Hamburguesa
  const menuAnim = useRef(new Animated.Value(-300)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  /** 🔥 Cargar Solicitudes del Proveedor */
  const obtenerSolicitudes = async () => {
    try {
      setLoading(true);
      const user = await AuthService.obtenerPerfil();
      const user_id = user.user_id || "";
      const provider_id = user.provider.id || "";
      setProvider(provider_id);
      const data = await SolicitudService.obtenerSolicitudesComoProveedor(user_id);
      setSolicitudes(data);
    } catch (error) {
      Alert.alert(
        "Error", 
        "No se pudieron cargar las solicitudes.",
        [{ text: "Reintentar", onPress: () => obtenerSolicitudes() }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  /** 📌 Aceptar/Rechazar Solicitud */
  const manejarSolicitud = async (idSolicitud: number, estado: string) => {
    try {
      // Mostrar confirmación antes de proceder
      if (estado === "Rechazada") {
        Alert.alert(
          "Confirmar acción",
          "¿Estás seguro de que deseas rechazar esta solicitud?",
          [
            { text: "Cancelar", style: "cancel" },
            { 
              text: "Rechazar", 
              style: "destructive",
              onPress: async () => {
                await actualizarEstadoSolicitud(idSolicitud, estado);
              }
            }
          ]
        );
      } else {
        await actualizarEstadoSolicitud(idSolicitud, estado);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    }
  };

  const actualizarEstadoSolicitud = async (idSolicitud: number, estado: string) => {
    try {
      await SolicitudService.actualizarEstadoSolicitud(idSolicitud, estado, true);
      
      // Mostrar mensaje de éxito
      const mensaje = estado === "aceptada por proveedor" ? "Solicitud aceptada con éxito" : "Solicitud rechazada con éxito";
      Alert.alert("Éxito", mensaje);

      // Actualizar el estado local
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
      })
    ]).start();
  };

  /** 📌 Cerrar Sesión */
  const cerrarSesion = async () => {
    try {
      Alert.alert(
        "Cerrar sesión",
        "¿Estás seguro de que deseas cerrar sesión?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Cerrar sesión", 
            style: "destructive",
            onPress: async () => {
              await AuthService.logout();
              navigation.replace("Login");
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  /** 📌 Guardar Cotizacion */
  const handleGuardar = () => {
    // Validar campos
    if (!descripcion.trim()) {
      Alert.alert("Error", "Por favor ingresa una descripción");
      return;
    }
    
    if (!costoManoObra.trim() || isNaN(Number(costoManoObra))) {
      Alert.alert("Error", "Por favor ingresa un costo de mano de obra válido");
      return;
    }
    
    if (!costoMateriales.trim() || isNaN(Number(costoMateriales))) {
      Alert.alert("Error", "Por favor ingresa un costo de materiales válido");
      return;
    }

    CotizacionService.agregarCotizacion(
      provider,
      request,
      costoManoObra,
      costoMateriales,
      descripcion
    );
    
    const nuevoItemCotizacion = {
      id: obtenerUltimoIdCotizacion(request) ?? 0 + 1,
      costo_mano_obra: costoManoObra,
      costo_materiales: costoMateriales,
      descripcion: descripcion,
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
    
    // Limpiar campos y cerrar modal
    setDescripcion("");
    setCostoManoObra("");
    setCostoMateriales("");
    setModalVisible(false);
    
    // Mostrar confirmación
    Alert.alert("Éxito", "Cotización enviada correctamente");
  };

  const obtenerUltimoIdCotizacion = (idSolicitud: number) => {
    const solicitud = solicitudes.find(
      (solicitud) => solicitud.id === idSolicitud
    );

    if (solicitud && solicitud.cotizaciones.length > 0) {
      const ultimoId =
        solicitud.cotizaciones[solicitud.cotizaciones.length - 1].id;
      return ultimoId;
    } else {
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
    const respuesta = cotizacionesNotas[notaCotizacionId]?.texto;
    
    if (!respuesta || !respuesta.trim()) {
      Alert.alert("Error", "Por favor ingresa una respuesta");
      return;
    }
    
    CotizacionService.agregarNotaCotizacion(notaCotizacionId, respuesta, true);
    
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
                  };
                }
              }
              return notaItem;
            }),
          };
        });

        return {
          ...solicitud,
          cotizaciones: updatedCotizaciones,
        };
      })
    );
    
    // Limpiar el estado de la respuesta
    setCotizacionesNotas((prevState) => ({
      ...prevState,
      [notaCotizacionId]: { texto: "" }
    }));
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
    if (!nota || !nota.trim()) {
      Alert.alert("Error", "Por favor ingresa una nota");
      return;
    }
    
    const nuevoItemNotaSolicitud = {
      id: obtenerUltimoIdNotaSolicitud(request_id) ?? 0 + 1,
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
    
    // Limpiar el campo de nota
    setNuevaNotaSolicitud("");
  };

  const obtenerUltimoIdNotaSolicitud = (idSolicitud: number) => {
    const solicitud = solicitudes.find(
      (solicitud) => solicitud.id === idSolicitud
    );

    if (solicitud && solicitud.request_notas.length > 0) {
      const ultimoId =
        solicitud.request_notas[solicitud.request_notas.length - 1].id;
      return ultimoId;
    } else {
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

  const handleCambioPrecio = (
    id: number,
    precio: number
  ) => {
    setPrecio((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        precio,
      },
    }));
  };

  const establecerPrecio = async(id) => {
    if (!precio[id]?.precio) {
      Alert.alert("Error", "Por favor ingresa un precio válido");
      return;
    }
    
    const precio_input = precio[id].precio;
    
    try {
      await SolicitudService.actualizarPrecio(id, precio_input);
      
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((solicitud) =>
          solicitud.id === id
            ? { ...solicitud, price: precio_input }
            : solicitud
        )
      );
      
      // Limpiar el precio después de establecerlo
      setPrecio((prevState) => ({
        ...prevState,
        [id]: { precio: '' }
      }));
      
      // Mostrar confirmación
      Alert.alert("Éxito", "Precio establecido correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo establecer el precio");
    }
  };

  const toggleCardExpansion = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    obtenerSolicitudes();
  };

  // Filtrar solicitudes según el filtro activo
  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    if (filtroActivo === "todas") return true;
    if (filtroActivo === "pendientes") return solicitud.status === "pendiente";
    if (filtroActivo === "aceptadas") return solicitud.status === "aceptada" || solicitud.status === "aceptada por proveedor";
    if (filtroActivo === "rechazadas") return solicitud.status === "Rechazada";
    return true;
  });

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'aceptada':
      case 'aceptada por proveedor':
        return '#2E7D32'; // Verde
      case 'pendiente':
        return '#F57C00'; // Naranja
      case 'rechazada':
        return '#D32F2F'; // Rojo
      default:
        return '#757575'; // Gris
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'aceptada':
      case 'aceptada por proveedor':
        return <MaterialIcons name="check-circle" size={16} color="#2E7D32" />;
      case 'pendiente':
        return <MaterialIcons name="schedule" size={16} color="#F57C00" />;
      case 'rechazada':
        return <MaterialIcons name="cancel" size={16} color="#D32F2F" />;
      default:
        return <MaterialIcons name="help" size={16} color="#757575" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#0047AB" barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Overlay para el menú lateral */}
        {menuVisible && (
          <Animated.View 
            style={[
              styles.overlay, 
              { opacity: overlayAnim }
            ]} 
            onTouchStart={toggleMenu}
          />
        )}

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
                toggleMenu();
                navigation.navigate("GestionServicios");
              }}
            >
              <MaterialIcons name="settings" size={24} color="#0047AB" style={styles.menuItemIcon} />
              <Text style={styles.menuText}>Gestionar Servicios</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                navigation.navigate("PantallaNotificacion");
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
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <MaterialIcons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Solicitudes Recibidas</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScrollContent}>
            <TouchableOpacity 
              style={[styles.filterButton, filtroActivo === "todas" && styles.filterButtonActive]}
              onPress={() => setFiltroActivo("todas")}
            >
              <MaterialIcons 
                name="list" 
                size={16} 
                color={filtroActivo === "todas" ? "#FFFFFF" : "#0047AB"} 
              />
              <Text style={[styles.filterButtonText, filtroActivo === "todas" && styles.filterButtonTextActive]}>
                Todas
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, filtroActivo === "pendientes" && styles.filterButtonActive]}
              onPress={() => setFiltroActivo("pendientes")}
            >
              <MaterialIcons 
                name="schedule" 
                size={16} 
                color={filtroActivo === "pendientes" ? "#FFFFFF" : "#F57C00"} 
              />
              <Text style={[styles.filterButtonText, filtroActivo === "pendientes" && styles.filterButtonTextActive]}>
                Pendientes
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, filtroActivo === "aceptadas" && styles.filterButtonActive]}
              onPress={() => setFiltroActivo("aceptadas")}
            >
              <MaterialIcons 
                name="check-circle" 
                size={16} 
                color={filtroActivo === "aceptadas" ? "#FFFFFF" : "#2E7D32"} 
              />
              <Text style={[styles.filterButtonText, filtroActivo === "aceptadas" && styles.filterButtonTextActive]}>
                Aceptadas
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, filtroActivo === "rechazadas" && styles.filterButtonActive]}
              onPress={() => setFiltroActivo("rechazadas")}
            >
              <MaterialIcons 
                name="cancel" 
                size={16} 
                color={filtroActivo === "rechazadas" ? "#FFFFFF" : "#D32F2F"} 
              />
              <Text style={[styles.filterButtonText, filtroActivo === "rechazadas" && styles.filterButtonTextActive]}>
                Rechazadas
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Lista de Solicitudes */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0047AB" />
            <Text style={styles.loadingText}>Cargando solicitudes...</Text>
          </View>
        ) : solicitudesFiltradas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={64} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No hay solicitudes</Text>
            <Text style={styles.emptyDescription}>
              {filtroActivo === "todas" 
                ? "No tienes solicitudes en este momento" 
                : `No tienes solicitudes ${filtroActivo === "pendientes" ? "pendientes" : filtroActivo === "aceptadas" ? "aceptadas" : "rechazadas"}`}
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleRefresh}>
              <Text style={styles.emptyButtonText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={solicitudesFiltradas}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            renderItem={({ item }) => (
              <View style={styles.requestCard}>
                <TouchableOpacity 
                  style={styles.cardHeader}
                  onPress={() => toggleCardExpansion(item.id)}
                >
                  <View style={styles.cardHeaderLeft}>
                    <Image
                      source={{
                        uri: item.images || "https://via.placeholder.com/100"
                      }}
                      style={styles.requestImage}
                    />
                    <View style={styles.requestInfo}>
                      <Text style={styles.requestDescription} numberOfLines={1}>
                        {item.request_description}
                      </Text>
                      <View style={styles.requestMeta}>
                        <View style={styles.metaItem}>
                          <MaterialIcons name="event" size={14} color="#666666" />
                          <Text style={styles.metaText}>{formatDate(item.service_date)}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <MaterialIcons name="location-on" size={14} color="#666666" />
                          <Text style={styles.metaText} numberOfLines={1}>{item.direccion || "Sin dirección"}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.cardHeaderRight}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                      {getStatusIcon(item.status)}
                      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                    <MaterialIcons 
                      name={expandedCards[item.id] ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={24} 
                      color="#666666" 
                    />
                  </View>
                </TouchableOpacity>
                
                {expandedCards[item.id] && (
                  <View style={styles.cardBody}>
                    <View style={styles.cardSection}>
                      <Text style={styles.sectionTitle}>Detalles de la solicitud</Text>
                      
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <MaterialIcons name="description" size={16} color="#0047AB" />
                          <Text style={styles.detailLabel}>Descripción:</Text>
                        </View>
                        <Text style={styles.detailValue}>{item.request_description}</Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <MaterialIcons name="event" size={16} color="#0047AB" />
                          <Text style={styles.detailLabel}>Fecha de servicio:</Text>
                        </View>
                        <Text style={styles.detailValue}>{formatDate(item.service_date)}</Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <MaterialIcons name="location-on" size={16} color="#0047AB" />
                          <Text style={styles.detailLabel}>Dirección:</Text>
                        </View>
                        <Text style={styles.detailValue}>{item.direccion || "Sin dirección"}</Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <MaterialIcons name="attach-money" size={16} color="#0047AB" />
                          <Text style={styles.detailLabel}>Precio:</Text>
                        </View>
                        {item.price > 0 ? (
                          <Text style={styles.detailValue}>{item.price} USD</Text>
                        ) : (
                          <View style={styles.priceInputContainer}>
                            <TextInput
                              style={styles.priceInput}
                              placeholder="0.00"
                              keyboardType="numeric"
                              maxLength={6}
                              value={precio[item.id]?.precio?.toString() || ''}
                              onChangeText={(valor) => handleCambioPrecio(item.id, Number.parseFloat(valor) || 0)}
                            />
                            <TouchableOpacity 
                              style={styles.priceButton}
                              onPress={() => establecerPrecio(item.id)}
                            >
                              <Text style={styles.priceButtonText}>Establecer</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    {item.status !== "Rechazada" && (
                      <View style={styles.actionsContainer}>
                        {item.status === "pendiente" && (
                          <View style={styles.actionButtons}>
                            <TouchableOpacity
                              style={styles.acceptButton}
                              onPress={() => manejarSolicitud(item.id, "aceptada por proveedor")}
                            >
                              <MaterialIcons name="check" size={16} color="#FFFFFF" />
                              <Text style={styles.actionButtonText}>Aceptar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                              style={styles.rejectButton}
                              onPress={() => manejarSolicitud(item.id, "Rechazada")}
                            >
                              <MaterialIcons name="close" size={16} color="#FFFFFF" />
                              <Text style={styles.actionButtonText}>Rechazar</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                        
                        {(item.status === "aceptada" || item.status === "aceptada por proveedor") && (
                          <TouchableOpacity
                            style={styles.quoteButton}
                            onPress={() => mostarModalCotizacion(item.id)}
                          >
                            <MaterialIcons name="receipt" size={16} color="#FFFFFF" />
                            <Text style={styles.actionButtonText}>Enviar Cotización</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                    
                    {/* Notas de la solicitud */}
                    <View style={styles.cardSection}>
                      <Text style={styles.sectionTitle}>Notas</Text>
                      
                      {item.request_notas.length > 0 ? (
                        <View style={styles.chatContainer}>
                          <FlatList
                            data={item.request_notas}
                            keyExtractor={(nota) => nota.id.toString()}
                            scrollEnabled={false}
                            renderItem={({ item: notaItem }) => (
                              <View style={styles.chatItem}>
                                {notaItem.nota_client && (
                                  <View style={styles.clientMessage}>
                                    <Text style={styles.messageText}>{notaItem.nota_client}</Text>
                                    <Text style={styles.messageTime}>
                                      {formatDate(notaItem.created_at)}
                                    </Text>
                                  </View>
                                )}
                                
                                {notaItem.nota_provider && (
                                  <View style={styles.providerMessage}>
                                    <Text style={styles.messageText}>{notaItem.nota_provider}</Text>
                                    <Text style={styles.messageTime}>
                                      {formatDate(notaItem.created_at)}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            )}
                          />
                        </View>
                      ) : (
                        <Text style={styles.emptyNotes}>No hay notas para esta solicitud</Text>
                      )}
                      
                      {item.status !== "Rechazada" && (
                        <View style={styles.newNoteContainer}>
                          <TextInput
                            style={styles.noteInput}
                            placeholder="Escribir nueva nota..."
                            value={nuevaNotaSolicitud}
                            onChangeText={setNuevaNotaSolicitud}
                            multiline
                          />
                          <TouchableOpacity
                            style={styles.sendButton}
                            onPress={() => handleCrearNotaSolicitud(item.id, nuevaNotaSolicitud)}
                          >
                            <MaterialIcons name="send" size={20} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    
                    {/* Cotizaciones */}
                    {item.cotizaciones.length > 0 && (
                      <View style={styles.cardSection}>
                        <Text style={styles.sectionTitle}>Cotizaciones</Text>
                        
                        <FlatList
                          data={item.cotizaciones}
                          keyExtractor={(cotizacion) => cotizacion.id.toString()}
                          scrollEnabled={false}
                          renderItem={({ item: cotizacion }) => (
                            <View style={styles.quoteCard}>
                              <View style={styles.quoteHeader}>
                                <Text style={styles.quoteTitle}>Cotización #{cotizacion.id}</Text>
                              </View>
                              
                              <View style={styles.quoteDetails}>
                                <View style={styles.quoteRow}>
                                  <View style={styles.quoteItem}>
                                    <MaterialIcons name="build" size={16} color="#0047AB" />
                                    <Text style={styles.quoteLabel}>Mano de obra:</Text>
                                  </View>
                                  <Text style={styles.quoteValue}>{cotizacion.costo_mano_obra} USD</Text>
                                </View>
                                
                                <View style={styles.quoteRow}>
                                  <View style={styles.quoteItem}>
                                    <MaterialIcons name="category" size={16} color="#0047AB" />
                                    <Text style={styles.quoteLabel}>Materiales:</Text>
                                  </View>
                                  <Text style={styles.quoteValue}>{cotizacion.costo_materiales} USD</Text>
                                </View>
                                
                                <View style={styles.quoteRow}>
                                  <View style={styles.quoteItem}>
                                    <MaterialIcons name="attach-money" size={16} color="#0047AB" />
                                    <Text style={styles.quoteLabel}>Total:</Text>
                                  </View>
                                  <Text style={styles.quoteTotalValue}>
                                    {Number.parseFloat(cotizacion.costo_mano_obra) + Number.parseFloat(cotizacion.costo_materiales)} USD
                                  </Text>
                                </View>
                                
                                <View style={styles.quoteDescription}>
                                  <Text style={styles.quoteDescriptionLabel}>Descripción:</Text>
                                  <Text style={styles.quoteDescriptionText}>{cotizacion.descripcion}</Text>
                                </View>
                              </View>
                              
                              {/* Notas de cotización */}
                              {cotizacion.cotizacion_notas?.length > 0 && (
                                <View style={styles.quoteNotes}>
                                  <Text style={styles.quoteNotesTitle}>Notas de la cotización:</Text>
                                  
                                  <View style={styles.chatContainer}>
                                    <FlatList
                                      data={cotizacion.cotizacion_notas}
                                      keyExtractor={(nota, index) => index.toString()}
                                      scrollEnabled={false}
                                      renderItem={({ item: notaItem }) => (
                                        <View style={styles.chatItem}>
                                          {notaItem.nota_client && (
                                            <View style={styles.clientMessage}>
                                              <Text style={styles.messageText}>{notaItem.nota_client}</Text>
                                              <Text style={styles.messageTime}>
                                                {formatDate(notaItem.updated_at)}
                                              </Text>
                                            </View>
                                          )}
                                          
                                          {notaItem.nota_provider && (
                                            <View style={styles.providerMessage}>
                                              <Text style={styles.messageText}>{notaItem.nota_provider}</Text>
                                              <Text style={styles.messageTime}>
                                                {formatDate(notaItem.created_at)}
                                              </Text>
                                            </View>
                                          )}
                                        </View>
                                      )}
                                    />
                                  </View>
                                  
                                  {cotizacion.cotizacion_notas.some(notaItem => notaItem.nota_client && !notaItem.nota_provider) && item.status !== "Rechazada" && (
                                    <View style={styles.newNoteContainer}>
                                      <TextInput
                                        style={styles.noteInput}
                                        placeholder="Responder a la nota..."
                                        value={cotizacionesNotas[cotizacion.cotizacion_notas.find(notaItem => notaItem.nota_client && !notaItem.nota_provider)?.id]?.texto || ""}
                                        onChangeText={(texto) => handleCambioNotaCotizacion(cotizacion.cotizacion_notas.find(notaItem => notaItem.nota_client && !notaItem.nota_provider)?.id, texto)}
                                        multiline
                                      />
                                      <TouchableOpacity
                                        style={styles.sendButton}
                                        onPress={() => {
                                          const notaItem = cotizacion.cotizacion_notas.find(notaItem => notaItem.nota_client && !notaItem.nota_provider);
                                          if (notaItem) {
                                            handleGuardarRespuesta(notaItem.id, notaItem);
                                          }
                                        }}
                                      >
                                        <MaterialIcons name="send" size={20} color="#FFFFFF" />
                                      </TouchableOpacity>
                                    </View>
                                  )}
                                </View>
                              )}
                            </View>
                          )}
                        />
                      </View>
                    )}
                    
                    {/* Contraofertas */}
                    {item.contraofertas.length > 0 && (
                      <View style={styles.cardSection}>
                        <Text style={styles.sectionTitle}>Contraofertas</Text>
                        
                        <FlatList
                          data={item.contraofertas}
                          keyExtractor={(contraoferta) => contraoferta.id.toString()}
                          scrollEnabled={false}
                          renderItem={({ item: contraoferta }) => (
                            <View style={styles.quoteCard}>
                              <View style={styles.quoteHeader}>
                                <Text style={styles.quoteTitle}>Contraoferta #{contraoferta.id}</Text>
                              </View>
                              
                              <View style={styles.quoteDetails}>
                                <View style={styles.quoteRow}>
                                  <View style={styles.quoteItem}>
                                    <MaterialIcons name="build" size={16} color="#0047AB" />
                                    <Text style={styles.quoteLabel}>Mano de obra:</Text>
                                  </View>
                                  <Text style={styles.quoteValue}>{contraoferta.costo_mano_obra} USD</Text>
                                </View>
                                
                                <View style={styles.quoteRow}>
                                  <View style={styles.quoteItem}>
                                    <MaterialIcons name="category" size={16} color="#0047AB" />
                                    <Text style={styles.quoteLabel}>Materiales:</Text>
                                  </View>
                                  <Text style={styles.quoteValue}>{contraoferta.costo_materiales} USD</Text>
                                </View>
                                
                                <View style={styles.quoteRow}>
                                  <View style={styles.quoteItem}>
                                    <MaterialIcons name="attach-money" size={16} color="#0047AB" />
                                    <Text style={styles.quoteLabel}>Total:</Text>
                                  </View>
                                  <Text style={styles.quoteTotalValue}>
                                    {Number.parseFloat(contraoferta.costo_mano_obra) + Number.parseFloat(contraoferta.costo_materiales)} USD
                                  </Text>
                                </View>
                                
                                <View style={styles.quoteDescription}>
                                  <Text style={styles.quoteDescriptionLabel}>Descripción:</Text>
                                  <Text style={styles.quoteDescriptionText}>{contraoferta.descripcion}</Text>
                                </View>
                              </View>
                              
                              {/* Notas de contraoferta */}
                              <View style={styles.quoteNotes}>
                                <Text style={styles.quoteNotesTitle}>Notas de la contraoferta:</Text>
                                
                                {contraoferta.contraoferta_notas.length > 0 ? (
                                  <View style={styles.chatContainer}>
                                    <FlatList
                                      data={contraoferta.contraoferta_notas}
                                      keyExtractor={(nota, index) => index.toString()}
                                      scrollEnabled={false}
                                      renderItem={({ item: nota }) => (
                                        <View style={styles.chatItem}>
                                          {nota.nota_client && (
                                            <View style={styles.clientMessage}>
                                              <Text style={styles.messageText}>{nota.nota_client}</Text>
                                              <Text style={styles.messageTime}>
                                                {formatDate(nota.updated_at)}
                                              </Text>
                                            </View>
                                          )}
                                          
                                          {nota.nota_provider && (
                                            <View style={styles.providerMessage}>
                                              <Text style={styles.messageText}>{nota.nota_provider}</Text>
                                              <Text style={styles.messageTime}>
                                                {formatDate(nota.created_at)}
                                              </Text>
                                            </View>
                                          )}
                                        </View>
                                      )}
                                    />
                                  </View>
                                ) : (
                                  <Text style={styles.emptyNotes}>No hay notas para esta contraoferta</Text>
                                )}
                                
                                {item.status !== "Rechazada" && (
                                  <View style={styles.newNoteContainer}>
                                    <TextInput
                                      style={styles.noteInput}
                                      placeholder="Escribir nueva nota..."
                                      value={nuevaNota}
                                      onChangeText={setNuevaNota}
                                      multiline
                                    />
                                    <TouchableOpacity
                                      style={styles.sendButton}
                                      onPress={() => handleCrearNota(contraoferta.id, nuevaNota)}
                                    >
                                      <MaterialIcons name="send" size={20} color="#FFFFFF" />
                                    </TouchableOpacity>
                                  </View>
                                )}
                              </View>
                            </View>
                          )}
                        />
                      </View>
                    )}
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
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
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
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleGuardar}
                >
                  <Text style={styles.saveButtonText}>Enviar Cotización</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#0047AB",
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
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
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  filtersContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  filtersScrollContent: {
    paddingHorizontal: 15,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    marginRight: 10,
    backgroundColor: "#FFFFFF",
  },
  filterButtonActive: {
    backgroundColor: "#0047AB",
    borderColor: "#0047AB",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333333",
    marginLeft: 5,
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
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
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 0,
    borderBottomColor: "#F0F0F0",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    flex: 1,
  },
  requestImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  requestInfo: {
    flex: 1,
    justifyContent: "center",
  },
  requestDescription: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  requestMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 2,
  },
  metaText: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 4,
  },
  cardHeaderRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
  cardBody: {
    padding: 15,
  },
  cardSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 8,
  },
  detailRow: {
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 24,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 24,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 100,
    fontSize: 14,
  },
  priceButton: {
    backgroundColor: "#0047AB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
  },
  priceButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 6,
    marginRight: 8,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#D32F2F",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  quoteButton: {
    backgroundColor: "#0047AB",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 6,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  chatContainer: {
    marginBottom: 15,
  },
  chatItem: {
    marginBottom: 10,
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
  messageTime: {
    fontSize: 10,
    color: "#666666",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  emptyNotes: {
    fontSize: 14,
    color: "#999999",
    fontStyle: "italic",
    textAlign: "center",
    padding: 15,
  },
  newNoteContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  noteInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    backgroundColor: "#0047AB",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  quoteCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    overflow: "hidden",
  },
  quoteHeader: {
    backgroundColor: "#0047AB",
    padding: 10,
  },
  quoteTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  quoteDetails: {
    padding: 15,
  },
  quoteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  quoteItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  quoteLabel: {
    fontSize: 14,
    color: "#333333",
    marginLeft: 8,
  },
  quoteValue: {
    fontSize: 14,
    color: "#666666",
  },
  quoteTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0047AB",
  },
  quoteDescription: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  quoteDescriptionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 5,
  },
  quoteDescriptionText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  quoteNotes: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  quoteNotesTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 10,
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
});

export default PantallaGestionSolicitudes;
