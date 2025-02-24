import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../styles/stylesGestionServicios';
import SupabaseService from '../../services/SupabaseService';
import { ServiceService } from "../../services/ServiceService";
import { AuthService } from '../../services/AuthService';

const PantallaGestionServicios = () => {
  const navigation = useNavigation();
  const [perfil, setPerfil] = useState<any>(null);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [portafolio, setPortafolio] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const menuAnim = useRef(new Animated.Value(-300)).current;
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const user = await SupabaseService.obtenerUsuarioAuth();
        const perfilData = await AuthService.obtenerPerfil();
        setPerfil(perfilData);
        setPortafolio(perfilData.portafolio || []);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el perfil.');
      } finally {
        setCargando(false);
      }
    };
    cargarPerfil();
  }, []);

  const agregarServicio = async () => {
    if (!nuevaEspecialidad.trim() || !nuevaDescripcion.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    try {
      await ServiceService.agregarServicio(perfil.id, nuevaEspecialidad, nuevaDescripcion);
      Alert.alert('Éxito', 'Servicio agregado correctamente.');
      setNuevaEspecialidad('');
      setNuevaDescripcion('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el servicio.');
    }
  };

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
        setPortafolio([...portafolio, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

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
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('GestionSolicitudes')}>
            <Text style={styles.menuText}>📋 Ver Solicitudes</Text>
          </TouchableOpacity>
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
        <Text style={styles.titulo}>👨‍🔧 Gestión de Servicios</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        {cargando ? (
          <ActivityIndicator size="large" color="#FF0314" style={{ marginTop: 20 }} />
        ) : (
          <>
            <Text style={styles.label}>📞 Teléfono: {perfil?.phone}</Text>
            <Text style={styles.label}>🛠 Especialidad: {perfil?.speciality}</Text>
            <Text style={styles.label}>📅 Disponibilidad: {perfil?.availability}</Text>

            <Text style={styles.label}>➕ Nueva Especialidad</Text>
            <TextInput
              placeholder="Ejemplo: Electricidad Industrial"
              style={styles.input}
              value={nuevaEspecialidad}
              onChangeText={setNuevaEspecialidad}
            />

            <Text style={styles.label}>📝 Descripción</Text>
            <TextInput
              placeholder="Ejemplo: Instalación y mantenimiento de sistemas eléctricos."
              style={styles.input}
              value={nuevaDescripcion}
              onChangeText={setNuevaDescripcion}
              multiline
            />

            <TouchableOpacity style={styles.botonAgregar} onPress={agregarServicio}>
              <Text style={styles.textoBoton}>✅ Agregar Servicio</Text>
            </TouchableOpacity>

            <Text style={styles.label}>📸 Portafolio</Text>
            <TouchableOpacity style={styles.botonSubir} onPress={seleccionarImagen}>
              <Text style={styles.textoBoton}>📷 Subir Imagen</Text>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.portafolioContainer}>
              {portafolio.length > 0 ? (
                portafolio.map((uri, index) => (
                  <Image key={index} source={{ uri }} style={styles.imagenPortafolio} />
                ))
              ) : (
                <Text style={styles.textoVacio}>No hay imágenes en el portafolio.</Text>
              )}
            </ScrollView>
          </>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotonVolver}>⬅️ Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PantallaGestionServicios;
