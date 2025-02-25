import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // 📌 Importar librería para seleccionar imágenes
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/stylesRegistro';
import { AuthService } from '../services/AuthService';

const RegistroScreen = () => {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [telefono, setTelefono] = useState('');
  const [esProveedor, setEsProveedor] = useState(false);
  const [especialidad, setEspecialidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 📌 Permitir al usuario subir una imagen desde su galería
  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para subir la imagen.');
      return;
    }

     const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
          });

          if (!resultado.cancelled && resultado.assets) {
            const imageUri = resultado.assets[0].uri;
            setImagenPerfil(imageUri);
          }
  };

  // 📌 Validar campos antes de registrar
  const validarCampos = () => {
    if (!nombre.trim() || !correo.trim() || !contrasena.trim() || !telefono.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return false;
    }

    if (!correo.includes('@')) {
      Alert.alert('Error', 'Por favor, ingresa un correo válido.');
      return false;
    }

    if (contrasena.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    if (esProveedor && !imagenPerfil) {
      Alert.alert('Error', 'Los proveedores deben subir una imagen de perfil.');
      return false;
    }

    return true;
  };

  // 📌 Función simulada para registrar usuario
  const registrarUsuario = async () => {
    if (!validarCampos()) return;
    setLoading(true);
    try {
     const id_usuario = await AuthService.crearUsuarioAuth(correo, contrasena); 
     if(esProveedor){
       const url_foto = await AuthService.subirFotoPerfil(id_usuario,imagenPerfil);
       AuthService.guardarPerfil(id_usuario, nombre, telefono, esProveedor,url_foto);
      }else{
        AuthService.guardarPerfil(id_usuario, nombre, telefono, esProveedor);
      }
      // Simulación de registro exitoso
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada y será validada en 24 horas.');
        navigation.navigate('Login'); // Redirigir a la pantalla de Login
      }, 2000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo registrar el usuario.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>📝 Registro de Cuenta</Text>

      {/* 📸 Foto de perfil */}
      {esProveedor && (
        <>
          <TouchableOpacity style={styles.fotoPerfilContainer} onPress={seleccionarImagen}>
            {imagenPerfil ? (
              <Image source={{ uri: imagenPerfil }} style={styles.fotoPerfil} />
            ) : (
              <Text style={styles.textoFotoPerfil}>📷 Subir Imagen</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.mensajeValidacion}>
            ✅ Tu cuenta será validada en las próximas 24 horas.
          </Text>
        </>
      )}

      {/* 📌 Campos de entrada */}
      <TextInput placeholder="Nombre Completo" style={styles.input} value={nombre} onChangeText={setNombre} />
      <TextInput placeholder="Correo Electrónico" style={styles.input} value={correo} keyboardType="email-address" onChangeText={setCorreo} />
      <TextInput placeholder="Contraseña" style={styles.input} value={contrasena} secureTextEntry onChangeText={setContrasena} />
      <TextInput placeholder="Teléfono" style={styles.input} value={telefono} keyboardType="phone-pad" onChangeText={setTelefono} />

      {/* 📌 Toggle para proveedores */}
      <View style={styles.switchContainer}>
        <Text style={styles.labelSwitch}>¿Te registras como proveedor?</Text>
        <Switch value={esProveedor} onValueChange={setEsProveedor} />
      </View>

      {/* 📌 Campos adicionales para proveedores */}
      {esProveedor && (
        <>
          <TextInput placeholder="Especialidad (Ej: Fontanería, Electricidad)" style={styles.input} value={especialidad} onChangeText={setEspecialidad} />
          <TextInput placeholder="Descripción del servicio" style={styles.input} value={descripcion} onChangeText={setDescripcion} multiline />
        </>
      )}

      {/* 📌 Botón de registro */}
      <TouchableOpacity style={styles.botonRegistrar} onPress={registrarUsuario} disabled={loading}>
        <Text style={styles.textoBoton}>✅ Registrarse</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#FF0314" style={{ marginTop: 10 }} />}

      {/* 🔗 Link para iniciar sesión */}
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>¿Ya tienes una cuenta? Iniciar sesión</Text>
    </ScrollView>
  );
};

export default RegistroScreen;
