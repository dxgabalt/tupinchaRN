import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles/stylesGestionSolicitudes';
import SolicitudService from '../../services/SolicitudService';
import SupabaseService from '../../services/SupabaseService';
import { Solicitud } from '../../models/Solicitud';
import { AuthService } from '../../services/AuthService';

const PantallaGestionSolicitudes = () => {
  const navigation = useNavigation();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(-300)).current;

  /** 🔥 Cargar Solicitudes del Proveedor */
  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const user = await AuthService.obtenerPerfil();
        const user_id = user.user_id || '';
        const data = await SolicitudService.obtenerSolicitudesComoProveedor(user_id);
        setSolicitudes(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las solicitudes.');
      } finally {
        setLoading(false);
      }
    };
    obtenerSolicitudes();
  }, []);

  /** 📌 Aceptar/Rechazar Solicitud */
  const manejarSolicitud = async (idSolicitud: number, estado: string) => {
    try {
      await SolicitudService.actualizarEstadoSolicitud(idSolicitud, estado);
      Alert.alert('Éxito', `Solicitud ${estado} con éxito`);

      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((solicitud) =>
          solicitud.id === idSolicitud ? { ...solicitud, status: estado } : solicitud
        )
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la solicitud.');
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
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔥 Menú de Navegación */}
      {menuVisible && <View style={styles.overlay} />}
      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnim }] }]}>
        <ScrollView>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('GestionServicios')}
          >
            <Text style={styles.menuText}>⚙️ Gestionar Servicios</Text>
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
                item.status === 'aceptada' ? styles.cardAceptada : styles.cardPendiente,
              ]}
            >
              {/* 📸 Imagen del Solicitante */}
              <Image
                source={{ uri: item.images || 'https://cdn.prod.website-files.com/65943d23dc44e6ce92eb6b67/65fc568691151fc5cece853c_broker_listing_distribution.png' }}
                style={styles.imagenSolicitante}
              />

              <View style={styles.infoContainer}>
                <Text style={styles.descripcion}>📝 {item.request_description}</Text>
                <Text style={styles.fecha}>📅 {item.service_date}</Text>
                <Text style={styles.precio}>💰 {item.price} USD</Text>

                {/* Estado de la solicitud */}
                <Text
                  style={[
                    styles.estado,
                    item.status === 'aceptada' ? styles.estadoAceptado : styles.estadoPendiente,
                  ]}
                >
                  {item.status.toUpperCase()}
                </Text>

                {item.status !== 'aceptada' && (
                  <View style={styles.botonesContainer}>
                    <TouchableOpacity
                      style={styles.botonAceptar}
                      onPress={() => manejarSolicitud(item.id, 'aceptada')}
                    >
                      <Text style={styles.textoBoton}>✅ Aceptar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.botonRechazar}
                      onPress={() => manejarSolicitud(item.id, 'rechazada')}
                    >
                      <Text style={styles.textoBoton}>❌ Rechazar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default PantallaGestionSolicitudes;
