import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/stylesNotificaciones";
import { AuthService } from "../services/AuthService";
import { NotificationsService } from "../services/NotificationService";
import { Notification } from "../models/Notification";

const PantallaNotificaciones = () => {
    const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
  const [nombreProvinciaSeleccionada, setNombreProvinciaSeleccionada] =
    useState(null);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState(null);
  const [nombreMunicipioSeleccionado, setNombreMunicipioSeleccionado] =
    useState(null);
    const [rol,setRol] = useState(0)
  const [menuVisible, setMenuVisible] = useState(false);
  const [usuario, setUsuario] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    profile_pic_url: "",
    user_id: "",
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Animación del Menú Hamburguesa
  const menuAnim = useRef(new Animated.Value(-300)).current;
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnim, {
      toValue: menuVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Obtener usuario autenticado
  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const profile = await AuthService.obtenerPerfil();
        setUsuario(profile || usuario);
        setProvinciaSeleccionada(profile?.provincias.id);
        setNombreProvinciaSeleccionada(profile?.provincias.nombre);
        setMunicipioSeleccionado(profile?.municipios.id);
        setNombreMunicipioSeleccionado(profile?.municipios.name);
        setRol(profile?.role_id)
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
      }
    };
    obtenerUsuario();
  }, []);

  // Obtener las categorías
  const obtenerNotificaciones = async () => {
    try {
      const notificaciones = await NotificationsService.obtenerTodos();
      setNotifications(notificaciones);
    } catch (error) {
      console.error("Error obteniendo servicios:", error);
    }
  };
  useEffect(() => {
    obtenerNotificaciones();
  }, []);
  const handlePress = () => {
    Linking.openURL("https://servicios.tupincha.com/shop/"); // Cambia la URL según lo necesites
  };

  const contactar = () => {
    const numero = "+5355655190";
    const mensaje = encodeURIComponent(
      "Hola, necesito ayuda con la aplicación."
    );
    Linking.openURL(`https://wa.me/${numero}?text=${mensaje}`);
  };
  const markAsRead = async (id: number) => {
    try {
      const result = await NotificationsService.actualizar(id, { is_read: true });
      if (result) {
        obtenerNotificaciones();
      } else {
        Alert.alert("Error", "No se pudo marcar como leída la notificación");
      }
    } catch (error) {
      console.error("Error al actualizar la notificación:", error);
      Alert.alert("Error", "Hubo un problema al marcar la notificación como leída");
    }
  };
  const deleteNotification = async (id: number) => {
    try {
            if (Platform.OS === "web") {
              const confirmation = window.confirm(
                "¿Estás seguro de que deseas eliminar esta notificación?"
              );
              if (confirmation) {
                const result = await NotificationsService.eliminar(id);
                if (result) {
                  setNotifications(notifications.filter((n) => n.id !== id));
                  alert("Notificación eliminada");
                } else {
                 alert("No se pudo eliminar la notificación");
                }
              }
            }else{
              Alert.alert(
                "Eliminar notificación",
                "¿Estás seguro de que deseas eliminar esta notificación?",
                [
                  {
                    text: "Cancelar",
                    style: "cancel"
                  },
                  {
                    text: "Eliminar",
                    onPress: async () => {
                      console.log("Eliminando notificación", id);
                      
                      const result = await NotificationsService.eliminar(id);
                      if (result) {
                        setNotifications(notifications.filter((n) => n.id !== id));
                        Alert.alert("Éxito", "Notificación eliminada");
                      } else {
                        Alert.alert("Error", "No se pudo eliminar la notificación");
                      }
                    },
                    style: "destructive"
                  }
                ]
              );
            }
      
    } catch (error) {
      console.error("Error al eliminar la notificación:", error);
      Alert.alert("Error", "Hubo un problema al eliminar la notificación");
    }
  };
  const renderItem = ({ item }: { item: Notification }) => (
    <View style={[
      styles.notification,
      item.is_read ? styles.read : styles.unread
    ]}>
      <TouchableOpacity onPress={() => markAsRead(item.id)}>
        <Text style={[styles.icon, item.is_read ? styles.iconRead : styles.iconUnread]}>
          {item.is_read ? '✔️' : '🔔'}
        </Text>
      </TouchableOpacity>
  
      <View style={styles.textContainer}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
      </View>
  
      {/* Botón para eliminar la notificación */}
      <TouchableOpacity onPress={() => deleteNotification(item.id)}>
        <Text style={styles.deleteIcon}>❌</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      {/* 🔥 Menú Lateral con Animación */}
      {menuVisible && <View style={styles.overlay} />}
      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX: menuAnim }] },
        ]}
      >
        <ScrollView>
          {rol !== 3 ? (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("PantallaNegocios")}
              >
                <Text style={styles.menuText}>🔎 Buscar Proveedores</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("PantallaHistorialUsuario")}
              >
                <Text style={styles.menuText}>🕒 Historial</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("PantallaSoporteFAQ")}
              >
                <Text style={styles.menuText}>❓ Soporte</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("PantallaNotificacion")}
              >
                <Text style={styles.menuText}>🔔 Notificaciones</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("MiPerfil")}
              >
                <Text style={styles.menuText}>👤 Mi Perfil</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("GestionSolicitudes")}
              >
                <Text style={styles.menuText}>📋 Ver Solicitudes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("PantallaNotificacion")}
              >
                <Text style={styles.menuText}>🔔 Notificaciones</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={styles.menuCerrar}
            onPress={async () => {
              const logoutSuccess = await AuthService.logout();
              if (logoutSuccess) {
                navigation.replace("Login");
              } else {
                Alert.alert("Error", "No se pudo cerrar sesión.");
              }
            }}
          >
            <Text style={styles.menuCerrarTexto}>🚪 Cerrar Sesión</Text>
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
        <Text style={styles.bienvenida}>Hola, {usuario.name || "Usuario"}</Text>
        <Text style={styles.ubicacion}>
          📍 {nombreProvinciaSeleccionada || "Selecciona ubicación"}
        </Text>
      </View>
      <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text>No tienes notificaciones.</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
      <View style={styles.containerBanner}>
        {/* 📌 Banner Promocional (Rojo) */}
        <TouchableOpacity
          style={[styles.banner, { backgroundColor: "red" }]}
          onPress={handlePress}
        >
          <Text style={styles.textoBanner}> 🛒 Realiza tus compras aquí</Text>
        </TouchableOpacity>

        {/* Botón de WhatsApp (Verde) */}
        <TouchableOpacity
          style={[styles.banner, { backgroundColor: "green" }]}
          onPress={contactar}
        >
          <Text style={styles.textoBanner}> 📞 Atencion Personalizada</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PantallaNotificaciones;
