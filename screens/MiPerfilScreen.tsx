import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; // 📌 Importar selector de imágenes
import styles from '../styles/stylesMiPerfil';
import { AuthService } from '../services/AuthService';

// 📌 Datos simulados de usuario
const usuarioDefault = { id: '', name: '', email: '', phone: '', profile_pic_url: '', user_id: '' ,rol_id:0};

const MiPerfilScreen = () => {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState(usuarioDefault);
  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoTelefono, setNuevoTelefono] = useState('');
  const [nuevaFoto, setNuevaFoto] = useState('');
  const animacionBoton = new Animated.Value(1);

  // 📌 Obtener perfil del usuario
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await AuthService.obtenerPerfil();
        setUsuario(profile || usuarioDefault);
        setNuevoNombre(profile.name);
        setNuevoTelefono(profile.phone);
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener el perfil.');
      }
    };
    fetchProfile();
  }, []);

  // 📌 Subir nueva foto de perfil
  const cambiarFotoPerfil = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la galería para cambiar la foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setNuevaFoto(result.assets[0].uri); // Almacena la nueva foto temporalmente
    }
  };

  // 📌 Guardar cambios en el perfil
  const guardarCambios = async () => {
    if (!nuevoNombre.trim() || !nuevoTelefono.trim()) {
      Alert.alert('Error', 'El nombre y teléfono no pueden estar vacíos.');
      return;
    }

    try {
      let fotoURL = usuario.profile_pic_url; // Mantener la foto actual por defecto

      // 📌 Subir foto si el usuario seleccionó una nueva
      if (nuevaFoto) {
        const urlSubida = await AuthService.subirFotoPerfil(usuario.user_id, nuevaFoto);
        if (urlSubida) {
          fotoURL = urlSubida;
        }
      }

      // 📌 Actualizar datos en el backend
      await AuthService.actualizarPerfil(usuario.user_id, nuevoNombre, nuevoTelefono, usuario.rol_id==3,fotoURL);

      // 📌 Actualizar el estado del usuario
      setUsuario((prev) => ({
        ...prev,
        name: nuevoNombre,
        phone: nuevoTelefono,
        profile_pic_url: fotoURL,
      }));

      setEditando(false);
      Alert.alert('Perfil actualizado', 'Los cambios se guardaron correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    }
  };

  // 📌 Animación para el botón de guardar
  const animarBoton = () => {
    Animated.sequence([
      Animated.timing(animacionBoton, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animacionBoton, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>👤 Mi Perfil</Text>

      {/* 📸 Foto de perfil */}
      <Image source={{ uri: nuevaFoto || usuario.profile_pic_url }} style={styles.fotoPerfil} />
      <TouchableOpacity style={styles.botonFoto} onPress={cambiarFotoPerfil}>
        <Text style={styles.textoBoton}>📷 Cambiar Foto</Text>
      </TouchableOpacity>

      {/* 📝 Campos de usuario */}
      <View style={styles.campoContainer}>
        <Text style={styles.label}>Nombre:</Text>
        {editando ? (
          <TextInput style={styles.input} value={nuevoNombre} onChangeText={setNuevoNombre} />
        ) : (
          <Text style={styles.texto}>{usuario.name}</Text>
        )}
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Correo:</Text>
        <Text style={styles.texto}>{usuario.email}</Text>
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Teléfono:</Text>
        {editando ? (
          <TextInput
            style={styles.input}
            value={nuevoTelefono}
            keyboardType="phone-pad"
            onChangeText={setNuevoTelefono}
          />
        ) : (
          <Text style={styles.texto}>{usuario.phone}</Text>
        )}
      </View>

      {/* 📌 Botón para editar/guardar */}
      {editando ? (
        <Animated.View style={{ transform: [{ scale: animacionBoton }] }}>
          <TouchableOpacity
            style={styles.botonGuardar}
            onPress={() => {
              guardarCambios();
              animarBoton();
            }}>
            <Text style={styles.textoBoton}>💾 Guardar Cambios</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <TouchableOpacity style={styles.botonEditar} onPress={() => setEditando(true)}>
          <Text style={styles.textoBotonEditar}>✏️ Editar Perfil</Text>
        </TouchableOpacity>
      )}

      {/* 🔙 Botón para volver */}
      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotonVolver}>⬅️ Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MiPerfilScreen;
