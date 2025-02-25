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
import { AuthService } from '../../services/AuthService';
import { ProviderServiceService } from '../../services/ProviderServiceService';
import { ImageService } from '../../services/ImageService';
import { PortafolioService } from '../../services/Portafolio';

const PantallaGestionServicios = () => {
  const navigation = useNavigation();
  const [perfil, setPerfil] = useState<any>(null);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [portafolio, setPortafolio] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const menuAnim = useRef(new Animated.Value(-300)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const [foto, setFoto] = useState("");
  const [especialidad, setEspecialidad] = useState("");

  /** 🔥 Cargar Perfil */
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const perfilData = await AuthService.obtenerPerfil();
        setPerfil(perfilData);
        const especialidades = perfilData?.portafolio?.map(item => item.especialidad).join(", ") || "";
        setEspecialidad(especialidades);  
        setPortafolio(perfilData.portafolio || []);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el perfil.');
      } finally {
        setCargando(false);
      }
    };
    cargarPerfil();
  }, []);

  /** 📌 Guardar Cambios en Perfil */
  const guardarPerfil = async () => {
    if (!perfil.phone.trim() || !perfil.speciality.trim() || !perfil.availability.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    try {
      const provider = {
        id: perfil.provider.id,
        phone: perfil.phone,
        speciality: perfil?.provider.speciality,
        availability: perfil?.provider.availability,
      }
      await ProviderServiceService.actualizarProveedor(provider);
      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
      setEditando(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    }
  };

  /** 📌 Agregar Nuevo Servicio */
  const agregarServicio = async () => {
    if (!nuevaEspecialidad.trim() || !nuevaDescripcion.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    try {
      const url_imagen =
        (await ImageService.subirImagen("servicios", foto)) ?? "";
      await PortafolioService.agregarServicio(perfil.provider.id, nuevaEspecialidad, nuevaDescripcion, url_imagen);
      Alert.alert('Éxito', 'Servicio agregado correctamente.');
      const especialidad_nueva =  especialidad +', '+nuevaEspecialidad;     
      setEspecialidad(especialidad_nueva)
      setNuevaEspecialidad('');
      setNuevaDescripcion('');
      setPortafolio([...portafolio, url_imagen]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el servicio.');
    }
  };

  /** 📌 Seleccionar Imagen */
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
        const foto = result.assets[0].uri;
        setFoto(foto);
        setPortafolio([...portafolio, foto]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
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
            {/* 📌 Campos del Perfil */}
            <Text style={styles.label}>📞 Teléfono:</Text>
            <TextInput
              style={styles.input}
              value={perfil?.phone}
              editable={editando}
              onChangeText={(text) => setPerfil({ ...perfil, phone: text })}
            />

            <Text style={styles.label}>🛠 Especialidad:</Text>
            <TextInput
              style={styles.input}
              value={perfil?.provider.speciality+','+especialidad}
              editable={editando}
              onChangeText={(text) => setPerfil({ ...perfil, speciality: text })}
            />

            <Text style={styles.label}>📅 Disponibilidad:</Text>
            <TextInput
              style={styles.input}
              value={perfil?.provider.availability}
              editable={editando}
              onChangeText={(text) => setPerfil({ ...perfil, availability: text })}
            />

            {editando ? (
              <TouchableOpacity style={styles.botonGuardar} onPress={guardarPerfil}>
                <Text style={styles.textoBoton}>💾 Guardar Cambios</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.botonEditar} onPress={() => setEditando(true)}>
                <Text style={styles.textoBoton}>✏️ Editar Perfil</Text>
              </TouchableOpacity>
            )}

            {/* 📌 Agregar Nuevo Servicio */}
            <Text style={styles.label}>➕ Nueva Especialidad</Text>
            <TextInput style={styles.input} placeholder="Ejemplo: Electricidad" value={nuevaEspecialidad} onChangeText={setNuevaEspecialidad} />

            <Text style={styles.label}>📝 Descripción</Text>
            <TextInput style={styles.input} placeholder="Ejemplo: Instalaciones y mantenimiento." value={nuevaDescripcion} onChangeText={setNuevaDescripcion} multiline />

            <TouchableOpacity style={styles.botonAgregar} onPress={agregarServicio}>
              <Text style={styles.textoBoton}>✅ Agregar Servicio</Text>
            </TouchableOpacity>

            {/* 📌 Portafolio */}
            <Text style={styles.label}>📸 Portafolio</Text>
            <TouchableOpacity style={styles.botonSubir} onPress={seleccionarImagen}>
              <Text style={styles.textoBoton}>📷 Subir Imagen</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default PantallaGestionServicios;
