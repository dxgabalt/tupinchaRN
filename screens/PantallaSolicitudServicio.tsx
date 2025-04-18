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
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from '../styles/stylesSolicitudServicio';
import { ImageService } from '../services/ImageService';
import { ProviderService } from '../models/ProviderService';

const PantallaSolicitudServicio = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { idProveedor, service_id, proveedor } = 
  (route.params as {
    idProveedor: number;
    service_id: number;
    proveedor: ProviderService
  }) || {};
  const dataProveedor = proveedor as ProviderService;
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

  // 📌 Estados
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [precioOfrecido, setPrecioOfrecido] = useState('');
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [url_imagen, setUrlImagenes] = useState<string>('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [direccion,setDireccion] = useState("")


  const menuAnim = useRef(new Animated.Value(-300)).current;
  const [menuVisible, setMenuVisible] = useState(false);

  // 📌 Selección de imágenes
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

      if (!result.canceled && result.assets) {
        const imageUri = result.assets[0].uri;
        setImagenes([...imagenes, imageUri]);
        const urlImagen = await ImageService.subirImagen('solicitudes', imageUri) || '';
        setUrlImagenes(urlImagen);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  // 📌 Eliminación de imágenes
  const eliminarImagen = (index: number) => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes.splice(index, 1);
    setImagenes(nuevasImagenes);
  };

  // 📌 Alternar menú lateral
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
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaInicio')}>
            <Text style={styles.menuText}>🏠 Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaNegocios')}>
            <Text style={styles.menuText}>🔍 Buscar Proveedores</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaHistorialUsuario')}>
            <Text style={styles.menuText}>🕒 Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaSoporteFAQ')}>
            <Text style={styles.menuText}>❓ Soporte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("PantallaNotificacion")}>
            <Text style={styles.menuText}>🔔 Notificaciones</Text>
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

        {/* 📌 Diferente UI en Web y Móvil */}
        {Platform.OS === 'web' ? (
          <input
            type="date"
            value={fecha.toISOString().split('T')[0]}
            onChange={(e) => setFecha(new Date(e.target.value))}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              fontSize: 16,
            }}
          />
        ) : (
          <>
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
          </>
        )}

        <Text style={styles.label}>Precio Ofrecido (Opcional)</Text>
        <TextInput
          placeholder="Es opcional Ejemplo: 50.00"
          style={styles.input}
          value={precioOfrecido}
          keyboardType="numeric"
          onChangeText={setPrecioOfrecido}
        />       
        <Text style={styles.label}>Direccion</Text>
        <TextInput
          placeholder="Dirreccion donde se va a realizar lo solicitado"
          style={styles.input}
          value={direccion}
          keyboardType="numeric"
          onChangeText={setDireccion}
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

        <TouchableOpacity
          style={styles.botonEnviar}
          onPress={() =>
            navigation.navigate('PantallaConfirmacionPago', {
              service_id,
              servicio: dataProveedor.services.category,
              id_proveedor: idProveedor,
              proveedor: dataProveedor.providers.profiles.name,
              descripcion,
              url_imagen,
              fecha: fecha,
              fechaFormateada: fecha.toDateString(),
              precio: precioOfrecido=== ''?0: precioOfrecido,
              direccion: direccion,
            })
          }
        >
          <Text style={styles.textoBoton}>✅ Enviar Solicitud</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PantallaSolicitudServicio;
