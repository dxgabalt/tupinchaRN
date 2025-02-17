import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { AuthService } from '../services/AuthService';
import styles from '../styles/stylesLogin';

// 📌 Definir las pantallas disponibles en la navegación
type RootStackParamList = {
  Login: undefined;
  PantallaNegocios: undefined;
  RegistroScreen: undefined;
  OlvidarContrasena: undefined;
  PantallaResultadosBusqueda: undefined;
  PantallaDetallesProveedor: undefined;
  PantallaSolicitudServicio: undefined;
  PantallaMetodosPago: undefined;
  PantallaConfirmacionPago: undefined;
  PantallaPagoExitoso: undefined;
  PantallaDetalleSolicitud: undefined;
  PantallaHistorialUsuario: undefined;
  PantallaSoporteFAQ: undefined;
  MiPerfil: undefined;
};

// 📌 Definir el tipo de navegación
type NavigationProps = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);

  // 📌 Función simulada para iniciar sesión
  const handleLogin = async () => {
    if (!correo.trim() || !contrasena.trim()) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Éxito', 'Inicio de sesión exitoso');
      navigation.reset({
        index: 0,
        routes: [{ name: 'PantallaNegocios' }],
      });
    }, 2000);
  };

  // 📌 Lista de pantallas para navegar directamente
  const screens = [
    { id: '1', name: 'PantallaNegocios' },
    { id: '2', name: 'RegistroScreen' },
    { id: '3', name: 'OlvidarContrasena' },
    { id: '4', name: 'PantallaResultadosBusqueda' },
    { id: '5', name: 'PantallaDetallesProveedor' },
    { id: '6', name: 'PantallaSolicitudServicio' },
    { id: '7', name: 'PantallaMetodosPago' },
    { id: '8', name: 'PantallaConfirmacionPago' },
    { id: '9', name: 'PantallaPagoExitoso' },
    { id: '10', name: 'PantallaDetalleSolicitud' },
    { id: '11', name: 'PantallaHistorialUsuario' },
    { id: '12', name: 'PantallaSoporteFAQ' },
    { id: '13', name: 'MiPerfil' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>🔑 Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo Electrónico"
        style={styles.input}
        value={correo}
        keyboardType="email-address"
        onChangeText={setCorreo}
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

      {/* 🔥 Lista de pantallas para navegar directamente */}
      <Text style={styles.listaTitulo}>🌍 Ir a otras pantallas:</Text>
      <FlatList
        data={screens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listaItem}
            onPress={() => navigation.navigate(item.name as keyof RootStackParamList)}
          >
            <Text style={styles.listaTexto}>➡ {item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

export default LoginScreen;
