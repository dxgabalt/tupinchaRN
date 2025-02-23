import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from '../styles/stylesSolicitudServicio';
import SolicitudService from '../services/SolicitudService';
import SupabaseService from '../services/SupabaseService';
import { supabase_client } from '../services/supabaseClient';
import { ImageService } from '../services/ImageService';

const PantallaSolicitudServicio = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { idProveedor, service_id } = route.params || {};

  if (!idProveedor) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ Error: No se encontró el proveedor.</Text>
        <TouchableOpacity style={styles.botonRegresar} onPress={() => navigation.goBack()}>
          <Text style={styles.textoBoton}>⬅️ Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 📌 Estados de la solicitud
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [precioOfrecido, setPrecioOfrecido] = useState(0);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [url_imagen, setUrlImagenes] = useState<string>("");
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const menuAnim = useRef(new Animated.Value(-300)).current;
  const [menuVisible, setMenuVisible] = useState(false);

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

      if (!result.cancelled && result.assets) {
        const imageUri = result.assets[0].uri;
        setImagenes([...imagenes, imageUri]);
        const url_imagen = await ImageService.subirImagen('solicitud',imageUri) || ""
        setUrlImagenes(url_imagen);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };


  // 📌 Función para eliminar una imagen seleccionada
  const eliminarImagen = (index) => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes.splice(index, 1);
    setImagenes(nuevasImagenes);
  };

  // 📌 Enviar solicitud
  const enviarSolicitud = async () => {
    if (!descripcion.trim() || !precioOfrecido) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const user = await SupabaseService.obtenerUsuarioAuth();
      console.log('user', user?.id);
      const userId = user?.id || '';
      await SolicitudService.crearSolicitudDeServicio(
        idProveedor,
        service_id,
        descripcion,
        fecha.toISOString().split('T')[0],
        precioOfrecido,
        userId,
        url_imagen
      );

      Alert.alert('Éxito', 'Solicitud enviada exitosamente.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la solicitud.');
    }
  };

  // 📌 Mostrar/Ocultar menú lateral
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
      {/* 🔥 Menú Lateral */}
      {menuVisible && <View style={styles.overlay} />}
      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnim }] }]}>
        <ScrollView>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaHistorialUsuario')}>
            <Text style={styles.menuText}>🕒 Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaSoporteFAQ')}>
            <Text style={styles.menuText}>❓ Soporte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MiPerfil')}>
            <Text style={styles.menuText}>👤 Mi Perfil</Text>
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
        <Text style={styles.titulo}>Solicitud de Servicio</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        <Text style={styles.label}>Descripción del servicio</Text>
        <TextInput
          placeholder="Ejemplo: Necesito arreglar una tubería rota..."
          style={styles.input}
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />

        <Text style={styles.label}>Fecha del servicio</Text>
        <TouchableOpacity style={styles.botonSubir} onPress={() => setDatePickerVisibility(true)}>
          <Text style={styles.textoBoton}>📅 Seleccionar Fecha</Text>
        </TouchableOpacity>
        <Text style={styles.textoFecha}>📆 {fecha.toDateString()}</Text>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setFecha(date);
            setDatePickerVisibility(false);
          }}
          onCancel={() => setDatePickerVisibility(false)}
        />

        <Text style={styles.label}>Precio Ofrecido</Text>
        <TextInput
          placeholder="Ejemplo: 50.00"
          style={styles.input}
          value={precioOfrecido}
          keyboardType="numeric"
          onChangeText={setPrecioOfrecido}
        />

        <Text style={styles.label}>Subir Imágenes</Text>
        <TouchableOpacity style={styles.botonSubir} onPress={seleccionarImagen}>
          <Text style={styles.textoBoton}>📷 Seleccionar Imagen</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagenesContainer}>
          {imagenes.map((uri, index) => (
            <View key={index} style={styles.imagenWrapper}>
              <Image source={{ uri }} style={styles.imagen} />
              <TouchableOpacity onPress={() => eliminarImagen(index)} style={styles.botonEliminarImagen}>
                <Text style={styles.textoEliminar}>❌</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.botonEnviar} onPress={enviarSolicitud}>
          <Text style={styles.textoBoton}>✅ Enviar Solicitud</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PantallaSolicitudServicio;
