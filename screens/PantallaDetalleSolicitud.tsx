import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/stylesDetalleSolicitud';
import { Solicitud } from '../models/Solicitud';
import SolicitudService from '../services/SolicitudService';

// 📌 Pantalla Detalle de la Solicitud
const PantallaDetalleSolicitud = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { solicitudId } = route.params || {};

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [cargando, setCargando] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(-300)).current;

  // 📌 Animación para el botón de contacto
  const animacion = useRef(new Animated.Value(1)).current;

  const animarBoton = () => {
    Animated.sequence([
      Animated.timing(animacion, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(animacion, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // 📌 Obtener datos de la solicitud
  useEffect(() => {
    const obtenerSolicitud = async () => {
      try {
        setCargando(true);
        const data = await SolicitudService.obtenerSolicitudPorId(solicitudId);
        setSolicitud(data);
      } catch (error) {
        console.error("Error obteniendo la solicitud:", error);
        Alert.alert('Error', 'No se pudo obtener la información de la solicitud.');
      } finally {
        setCargando(false);
      }
    };
    obtenerSolicitud();
  }, []);

  // 📌 Función para contactar al proveedor
  const contactarProveedor = () => {
    animarBoton();
    Alert.alert(
      'Contacto',
      `Llamando a ${solicitud?.providers?.profiles?.name} al ${solicitud?.providers?.profiles?.phone}...`
    );
  };

  // 📌 Mostrar/Ocultar Menú de Navegación
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnim, {
      toValue: menuVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* 🔥 Menú de Navegación */}
      {menuVisible && <View style={styles.overlay} />}
      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnim }] }]}>
        <ScrollView>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaInicio')}>
            <Text style={styles.menuText}>🏠 Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaHistorialUsuario')}>
            <Text style={styles.menuText}>📜 Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaNegocios')}>
            <Text style={styles.menuText}>🔍 Buscar Negocios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaSoporteFAQ')}>
            <Text style={styles.menuText}>❓ Soporte</Text>
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
        <Text style={styles.tituloHeader}>Detalles de la Solicitud</Text>
      </View>

      {/* 📌 Cargando */}
      {cargando ? (
        <ActivityIndicator size="large" color="#FF0314" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {/* 🏷️ Estado de la Solicitud */}
          <Text style={[styles.estado, solicitud?.status === 'Pendiente' ? styles.pendiente : styles.completado]}>
            {solicitud?.status}
          </Text>

          {/* 📌 Imagen del Servicio */}
          <Image source={{ uri: solicitud?.images || 'https://via.placeholder.com/200' }} style={styles.imagenServicio} />

          {/* 🛠️ Información del Servicio */}
          <Text style={styles.servicio}>{solicitud?.services?.category}</Text>
          <Text style={styles.descripcion}>📝 {solicitud?.request_description}</Text>
          <Text style={styles.fecha}>📅 {solicitud?.service_date}</Text>

          {/* 👤 Información del Proveedor */}
          <View style={styles.cardProveedor}>
            <Image source={{ uri: solicitud?.providers?.profiles?.profile_pic_url || 'https://via.placeholder.com/100' }} style={styles.imagenProveedor} />
            <View>
              <Text style={styles.nombreProveedor}>{solicitud?.providers?.profiles?.name}</Text>
              <Text style={styles.telefonoProveedor}>📞 {solicitud?.providers?.profiles?.phone}</Text>
            </View>
          </View>

          {/* 📞 Botón para Contactar */}
          <Animated.View style={{ transform: [{ scale: animacion }] }}>
            <TouchableOpacity style={styles.botonContactar} onPress={contactarProveedor}>
              <Text style={styles.textoBoton}>📲 Contactar Proveedor</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* 🔙 Botón para Volver */}
          <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
            <Text style={styles.textoBotonVolver}>⬅️ Volver</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default PantallaDetalleSolicitud;
