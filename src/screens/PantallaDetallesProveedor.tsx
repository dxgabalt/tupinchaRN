import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// 📌 Datos simulados del proveedor
const proveedorSimulado = {
  id: '1',
  nombre: 'Fontanería Express',
  especialidad: 'Fontanería',
  descripcion: 'Reparaciones de tuberías, grifos y sistemas de drenaje.',
  ubicacion: 'La Habana, Playa',
  calificacion: 4.8,
  telefono: '+53 5555 5555',
  correo: 'fontaneria@email.com',
  imagenPortada: 'https://source.unsplash.com/600x300/?plumbing,work',
  imagenPerfil: 'https://source.unsplash.com/100x100/?man,worker',
};

const PantallaDetallesProveedor = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { idProveedor } = route.params || {};

  const [proveedor, setProveedor] = useState(proveedorSimulado);

  // 📌 Función para contactar al proveedor
  const contactarProveedor = () => {
    Alert.alert(
      'Contacto',
      `Puedes contactar a ${proveedor.nombre}:\n📞 ${proveedor.telefono}\n📧 ${proveedor.correo}`
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Imagen de Portada */}
      <Image source={{ uri: proveedor.imagenPortada }} style={styles.imagenPortada} />

      {/* Foto de Perfil e Información */}
      <View style={styles.perfilContainer}>
        <Image source={{ uri: proveedor.imagenPerfil }} style={styles.imagenPerfil} />
        <Text style={styles.nombre}>{proveedor.nombre}</Text>
        <Text style={styles.especialidad}>{proveedor.especialidad}</Text>
        <Text style={styles.ubicacion}>📍 {proveedor.ubicacion}</Text>
        <Text style={styles.calificacion}>⭐ {proveedor.calificacion} / 5</Text>
      </View>

      {/* Descripción */}
      <View style={styles.detallesContainer}>
        <Text style={styles.tituloSeccion}>Sobre el Servicio</Text>
        <Text style={styles.descripcion}>{proveedor.descripcion}</Text>
      </View>

      {/* Botones de Acción */}
      <View style={styles.botonesContainer}>
        <TouchableOpacity style={styles.botonContacto} onPress={contactarProveedor}>
          <Text style={styles.textoBoton}>📞 Contactar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botonSolicitar}
          onPress={() => navigation.navigate('PantallaSolicitudServicio', { idProveedor })}
        >
          <Text style={styles.textoBoton}>🛠️ Solicitar Servicio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  imagenPortada: { width: '100%', height: 200 },
  perfilContainer: { alignItems: 'center', marginTop: -50 },
  imagenPerfil: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#ffffff' },
  nombre: { fontSize: 22, fontWeight: 'bold', color: '#003366', marginTop: 10 },
  especialidad: { fontSize: 16, color: '#666' },
  ubicacion: { fontSize: 14, color: '#444', marginTop: 5 },
  calificacion: { fontSize: 14, fontWeight: 'bold', color: '#FF0314', marginTop: 5 },
  detallesContainer: { padding: 16 },
  tituloSeccion: { fontSize: 18, fontWeight: 'bold', color: '#003366', marginBottom: 10 },
  descripcion: { fontSize: 14, color: '#666', textAlign: 'justify' },
  botonesContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  botonContacto: { backgroundColor: '#28A745', padding: 12, borderRadius: 10, width: '45%', alignItems: 'center' },
  botonSolicitar: { backgroundColor: '#FF0314', padding: 12, borderRadius: 10, width: '45%', alignItems: 'center' },
  textoBoton: { fontSize: 16, color: '#ffffff', fontWeight: 'bold' },
});

export default PantallaDetallesProveedor;
