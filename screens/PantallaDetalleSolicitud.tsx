import React, { useState } from 'react';
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

// 📌 Datos simulados de una solicitud
const solicitudSimulada = {
  id: '1',
  servicio: 'Fontanería',
  proveedor: {
    nombre: 'Carlos López',
    telefono: '+505 8888-7777',
    imagen: 'https://cdn-icons-png.flaticon.com/512/706/706830.png',
  },
  estado: 'Pendiente',
  fecha: '2024-02-10',
  descripcion: 'Reparación de tuberías en la cocina.',
  imagenServicio: 'https://cdn-icons-png.flaticon.com/512/2784/2784453.png',
};

const PantallaDetalleSolicitud = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 📌 Estado local para simular datos
  const [solicitud] = useState(solicitudSimulada);

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
      `Llamando a ${solicitud.proveedor.nombre} al ${solicitud.proveedor.telefono}...`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📄 Detalles de Solicitud</Text>

      {/* 🏷️ Estado de la solicitud */}
      <Text
        style={[
          styles.estado,
          solicitud.estado === 'Pendiente' ? styles.pendiente : styles.completado,
        ]}
      >
        {solicitud.estado}
      </Text>

      {/* 📌 Imagen del servicio */}
      <Image source={{ uri: solicitud.imagenServicio }} style={styles.imagenServicio} />

      {/* 🛠️ Información del servicio */}
      <Text style={styles.servicio}>{solicitud.servicio}</Text>
      <Text style={styles.descripcion}>📝 {solicitud.descripcion}</Text>
      <Text style={styles.fecha}>📅 {solicitud.fecha}</Text>

      {/* 👤 Información del proveedor */}
      <View style={styles.cardProveedor}>
        <Image source={{ uri: solicitud.proveedor.imagen }} style={styles.imagenProveedor} />
        <View>
          <Text style={styles.nombreProveedor}>{solicitud.proveedor.nombre}</Text>
          <Text style={styles.telefonoProveedor}>📞 {solicitud.proveedor.telefono}</Text>
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
