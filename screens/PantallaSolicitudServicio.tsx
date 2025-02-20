import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from '../styles/stylesSolicitudServicio';
import SolicitudService from '../services/SolicitudService';
import { AuthService } from '../services/AuthService';
import SupabaseService from '../services/SupabaseService';

const PantallaSolicitudServicio = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // 🔹 Manejamos el caso en que `route.params` sea `undefined`
  const { idProveedor, service_id } = route.params; // Recibe los parámetros


  // 🔹 Si `idProveedor` no existe, mostramos un mensaje de error
  if (!idProveedor) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          ❌ Error: No se encontró el proveedor. 
        </Text>
        <TouchableOpacity
          style={styles.botonRegresar}
          onPress={() => navigation.goBack()}>
          <Text style={styles.textoBoton}>⬅️ Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 📌 Estados para la solicitud
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [imagenes, setImagenes] = useState<string[]>([]);

  // 📌 Función para seleccionar imágenes
  const seleccionarImagen = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso Denegado', 'Se requiere acceso a la galería.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        setImagenes([...imagenes, result.uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  // 📌 Función para enviar la solicitud
  const enviarSolicitud = async () => {
    if (!descripcion || !fecha) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    try {
      const user = await SupabaseService.obtenerUsuarioAuth();   
      SolicitudService.crearSolicitudDeServicio(idProveedor,service_id, descripcion, fecha, user?.id)
      Alert.alert('Éxito', 'Solicitud enviada exitosamente.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la solicitud.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Solicitud de Servicio</Text>

      <Text style={styles.label}>Descripción del servicio</Text>
      <TextInput
        placeholder="Ejemplo: Necesito arreglar una tubería rota..."
        style={styles.input}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Text style={styles.label}>Fecha del servicio</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        style={styles.input}
        value={fecha}
        onChangeText={setFecha}
      />

      <Text style={styles.label}>Subir Imágenes</Text>
      <TouchableOpacity style={styles.botonSubir} onPress={seleccionarImagen}>
        <Text style={styles.textoBoton}>📷 Seleccionar Imagen</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagenesContainer}>
        {imagenes.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.imagen} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.botonEnviar} onPress={enviarSolicitud}>
        <Text style={styles.textoBoton}>✅ Enviar Solicitud</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PantallaSolicitudServicio;