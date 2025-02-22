import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/stylesDetalleSolicitud';
import { ProviderServiceService } from '../services/ProviderServiceService';
import { ProviderService } from '../models/ProviderService';
import { Solicitud } from '../models/Solicitud';
import SolicitudService from '../services/SolicitudService';


const PantallaDetalleSolicitud = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { solicitudId } = route.params || {};

  // 📌 Estado local para simular datos
  const [solicitud, setSolicitud] =  useState<Solicitud | null>(null);

  // 📌 Animación para el botón de contacto
  const animacion = new Animated.Value(1);

  const animarBoton = () => {
    Animated.sequence([
      Animated.timing(animacion, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(animacion, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // 📌 Función para contactar al proveedor (solo alerta de simulación)
  const contactarProveedor = () => {
    animarBoton();
    Alert.alert(
      'Contacto',
      `Llamando a ${solicitud?.providers.profiles.name} al ${solicitud?.providers.profiles.phone}...`
    );
  };
 useEffect(() => {
    const obtenerNegocios = async () => {
      try {
        const provider_service = await SolicitudService.obtenerSolicitudPorId(solicitudId);
        setSolicitud(provider_service);
      } catch (error) {
        console.error("Error obteniendo servicios:", error);
      }
    };
    obtenerNegocios();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📄 Detalles de Solicitud</Text>

      {/* 🏷️ Estado de la solicitud */}
      <Text
        style={[
          styles.estado,
          solicitud?.status === 'Pendiente' ? styles.pendiente : styles.completado,
        ]}
      >
        {solicitud?.status}
      </Text>

      {/* 📌 Imagen del servicio */}
      <Image source={{ uri: '' }} style={styles.imagenServicio} />

      {/* 🛠️ Información del servicio */}
      <Text style={styles.servicio}>{solicitud?.services.category}</Text>
      <Text style={styles.descripcion}>📝 {solicitud?.request_description}</Text>
      <Text style={styles.fecha}>📅 {solicitud?.service_date}</Text>

      {/* 👤 Información del proveedor */}
      <View style={styles.cardProveedor}>
        <Image source={{ uri: solicitud?.providers?.profiles?.profile_pic_url }} style={styles.imagenProveedor} />
        <View>
          <Text style={styles.nombreProveedor}>{solicitud?.providers?.profiles?.name}</Text>
          <Text style={styles.telefonoProveedor}>📞 {solicitud?.providers?.profiles?.phone}</Text>
        </View>
      </View>

      {/* 📞 Botón para contactar */}
      <Animated.View style={{ transform: [{ scale: animacion }] }}>
        <TouchableOpacity style={styles.botonContactar} onPress={contactarProveedor}>
          <Text style={styles.textoBoton}>📲 Contactar Proveedor</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* 🔙 Botón para volver */}
      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotonVolver}>⬅️ Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PantallaDetalleSolicitud;
