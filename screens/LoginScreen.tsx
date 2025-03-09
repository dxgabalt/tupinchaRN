import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { AuthService } from '../services/AuthService';
import styles from '../styles/stylesLogin';

// 📌 Definir las pantallas disponibles en la navegación
type RootStackParamList = {
  Login: undefined;
  PantallaNegocios: undefined;
  GestionSolicitudes: undefined;
  RegistroScreen: undefined;
  OlvidarContrasena: undefined;
};

// 📌 Definir el tipo de navegación
type NavigationProps = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);

  // 📌 Función para iniciar sesión
  const handleLogin = async () => {
    if (!correo.trim() || !contrasena.trim()) {
      Alert.alert('⚠️ Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.autenticarUsuario(correo, contrasena);
      if (!response.success) {
        Alert.alert('⚠️ Error', 'Credenciales incorrectas. Inténtalo de nuevo.');
        return;
      }

      Alert.alert('✅ Éxito', 'Inicio de sesión exitoso');
      setCorreo('');
      setContrasena('');

      // Redirección según el rol del usuario
      if (response.role === 3) {
        navigation.replace('GestionSolicitudes');
      } else {
        navigation.replace('PantallaNegocios');
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      Alert.alert('⚠️ Error', 'Ocurrió un error inesperado. Inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.titulo}>🔑 Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo Electrónico"
        style={styles.input}
        value={correo}
        keyboardType="email-address"
        onChangeText={setCorreo}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={contrasena}
        secureTextEntry
        onChangeText={setContrasena}
      />

      <TouchableOpacity
        style={styles.boton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.textoBoton}>✅ Ingresar</Text>
        )}
      </TouchableOpacity>

      {/* 🔗 Enlace para recuperar contraseña */}
      <TouchableOpacity onPress={() => navigation.navigate('OlvidarContrasena')}>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      {/* 🔗 Enlace para registrarse */}
      <TouchableOpacity onPress={() => navigation.navigate('RegistroScreen')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
