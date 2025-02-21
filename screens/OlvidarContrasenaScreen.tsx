import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/stylesOlvidarContrasena';

// 📌 Servicio de Supabase para recuperación de contraseña
import SupabaseService from '../services/SupabaseService';
import { AuthService } from '../services/AuthService';

const OlvidarContrasenaScreen = () => {
  const navigation = useNavigation();
  const [correo, setCorreo] = useState('');
  const [loading, setLoading] = useState(false);
  const animacionBoton = new Animated.Value(1);

  // 📌 Validación del correo
  const validarCorreo = () => {
    if (!correo.trim()) {
      Alert.alert('Error', 'Ingresa un correo válido.');
      return false;
    }
    if (!correo.includes('@')) {
      Alert.alert('Error', 'Formato de correo no válido.');
      return false;
    }
    return true;
  };

  // 📌 Función para enviar enlace de recuperación
  const recuperarContrasena = async () => {
    if (!validarCorreo()) return;

    setLoading(true);
    try {
      await AuthService.recuperarContrasena(correo.trim());
      Alert.alert('Éxito', 'Se ha enviado un enlace de recuperación a tu correo.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo enviar el correo.');
    } finally {
      setLoading(false);
    }
  };

  // 📌 Animación del botón
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
      <Text style={styles.titulo}>🔑 Recuperar Contraseña</Text>
      <Text style={styles.descripcion}>
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </Text>

      {/* 📌 Input de correo */}
      <TextInput
        placeholder="Correo Electrónico"
        style={styles.input}
        value={correo}
        keyboardType="email-address"
        onChangeText={setCorreo}
      />

      {/* 📌 Botón de recuperación con animación */}
      <Animated.View style={{ transform: [{ scale: animacionBoton }] }}>
        <TouchableOpacity
          style={styles.botonRecuperar}
          onPress={() => {
            recuperarContrasena();
            animarBoton();
          }}
          disabled={loading}
        >
          <Text style={styles.textoBoton}>📩 Enviar enlace de recuperación</Text>
        </TouchableOpacity>
      </Animated.View>

      {loading && <ActivityIndicator size="large" color="#FF0314" style={{ marginTop: 10 }} />}

      {/* 🔗 Link para volver al login */}
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        ⬅️ Volver al inicio de sesión
      </Text>
    </ScrollView>
  );
};

export default OlvidarContrasenaScreen;
