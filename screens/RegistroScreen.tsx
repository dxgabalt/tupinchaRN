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
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/stylesRegistro';

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
      // Simulación de registro exitoso
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada.');
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

      {/* 📸 Foto de perfil (No funcional en esta versión) */}
      <TouchableOpacity style={styles.fotoPerfilContainer}>
        {imagenPerfil ? (
          <Image source={{ uri: imagenPerfil }} style={styles.fotoPerfil} />
        ) : (
          <Text style={styles.textoFotoPerfil}>📷 Subir Imagen (No disponible)</Text>
        )}
      </TouchableOpacity>

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
