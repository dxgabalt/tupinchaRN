import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SupabaseService from '../services/SupabaseService';

const OlvidarContrasenaScreen = () => {
  const navigation = useNavigation();
  const [correo, setCorreo] = useState('');
  const [loading, setLoading] = useState(false);

  const recuperarContrasena = async () => {
    if (!correo.trim()) {
      Alert.alert('Error', 'Ingresa un correo válido.');
      return;
    }

    setLoading(true);
    try {
      await SupabaseService.recuperarContrasena(correo.trim());
      Alert.alert('Éxito', 'Se ha enviado un enlace de recuperación a tu correo.');
      navigation.navigate('LoginScreen');
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo enviar el correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <TextInput placeholder="Correo Electrónico" style={styles.input} value={correo} keyboardType="email-address" onChangeText={setCorreo} />
      <Button title="Enviar enlace de recuperación" onPress={recuperarContrasena} color="#FF0314" disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#FF0314" style={{ marginTop: 10 }} />}
      
      <Text style={styles.link} onPress={() => navigation.navigate('LoginScreen')}>
        Volver al inicio de sesión
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#003366', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#cccccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  link: { color: '#FF0314', marginTop: 10, textAlign: 'center' },
});

export default OlvidarContrasenaScreen;
