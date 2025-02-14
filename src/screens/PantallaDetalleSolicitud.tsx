import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

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

  // 📌 Función para contactar al proveedor (solo alerta de simulación)
  const contactarProveedor = () => {
    Alert.alert(
      'Contacto',
      `Llamando a ${solicitud.proveedor.nombre} al ${solicitud.proveedor.telefono}...`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📄 Detalles de Solicitud</Text>

      {/* 🏷️ Estado de la solicitud */}
      <Text style={[styles.estado, solicitud.estado === 'Pendiente' ? styles.pendiente : styles.completado]}>
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
      <TouchableOpacity style={styles.botonContactar} onPress={contactarProveedor}>
        <Text style={styles.textoBoton}>📲 Contactar Proveedor</Text>
      </TouchableOpacity>

      {/* 🔙 Botón para volver */}
      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotonVolver}>⬅️ Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff', alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#003366', marginBottom: 10, textAlign: 'center' },
  estado: { fontSize: 16, fontWeight: 'bold', padding: 8, borderRadius: 5, marginBottom: 10 },
  pendiente: { backgroundColor: '#FFC107', color: '#fff' },
  completado: { backgroundColor: '#28a745', color: '#fff' },
  imagenServicio: { width: 120, height: 120, marginBottom: 10 },
  servicio: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  descripcion: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 10 },
  fecha: { fontSize: 12, color: '#888', marginBottom: 20 },
  cardProveedor: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f5f5f5', borderRadius: 10, width: '100%', marginBottom: 15 },
  imagenProveedor: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  nombreProveedor: { fontSize: 16, fontWeight: 'bold' },
  telefonoProveedor: { fontSize: 14, color: '#555' },
  botonContactar: { backgroundColor: '#FF0314', padding: 12, borderRadius: 10, alignItems: 'center', width: '100%', marginBottom: 10 },
  textoBoton: { fontSize: 16, color: '#ffffff', fontWeight: 'bold' },
  botonVolver: { backgroundColor: '#ccc', padding: 10, borderRadius: 10, alignItems: 'center', width: '100%' },
  textoBotonVolver: { fontSize: 14, color: '#000', fontWeight: 'bold' },
});

export default PantallaDetalleSolicitud;
