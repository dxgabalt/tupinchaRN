import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/stylesConfirmacionPago';
import SolicitudService from '../services/SolicitudService';
import SupabaseService from '../services/SupabaseService';

const PantallaConfirmacionPago = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 📌 Recibe datos de la Pantalla de Solicitud
  const {service_id,servicio,id_proveedor,proveedor,descripcion,url_imagen,fecha,fechaFormateada,precio  } = route.params || {};

  // 📌 Estado para el método de pago
  const [metodoPago, setMetodoPago] = useState('');

  // 📌 Función para confirmar pago y solicitud
  const confirmarPago = () => {
    if (!metodoPago) {
      Alert.alert('Error', 'Por favor, selecciona un método de pago.');
      return;
    }
    enviarSolicitud();
    Alert.alert(
      '✅ Pago Confirmado',
      `Se ha confirmado la solicitud de servicio con el método de pago: ${metodoPago}.`,
      [{ text: 'OK', onPress: () => navigation.navigate('PantallaPagoExitoso') }]
    );
  };
  // 📌 Enviar solicitud con validación
  const enviarSolicitud = async () => {
    if (!descripcion.trim() || !precio.trim()) {
      console.log('Error', 'Por favor, completa todos los campos.');
      
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const user = await SupabaseService.obtenerUsuarioAuth();
      const userId = user?.id || '';
    const id_provider_services = await SolicitudService.crearSolicitudDeServicio(
      id_proveedor,
        service_id,
        descripcion,
        fecha.toISOString().split('T')[0],
        Number.parseFloat(precio),
        userId,
        url_imagen
      );
      console.log('id_provider_services',id_provider_services);
      Alert.alert('Éxito', 'Solicitud enviada exitosamente.');
    } catch (error:any) {
      console.log('Error',error.message);
      Alert.alert('Error', 'No se pudo enviar la solicitud.');
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Confirmación de Pago</Text>

      {/* 🔧 Información del Servicio */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>🔧 Servicio:</Text>
        <Text style={styles.valor}>{servicio}</Text>

        <Text style={styles.label}>👨‍🔧 Proveedor:</Text>
        <Text style={styles.valor}>{proveedor}</Text>

        <Text style={styles.label}>📅 Fecha del Servicio:</Text>
        <Text style={styles.valor}>{fechaFormateada}</Text>

        <Text style={styles.label}>💰 Total a Pagar:</Text>
        <Text style={styles.valor}>$ {precio}</Text>
      </View>

      {/* 💳 Selección de Método de Pago */}
      <Text style={styles.subtitulo}>Elige un Método de Pago</Text>

      <TouchableOpacity
        style={[
          styles.botonMetodo,
          metodoPago === 'Tarjeta de Crédito' && styles.metodoSeleccionado,
        ]}
        onPress={() => setMetodoPago('Tarjeta de Crédito')}
      >
        <Text style={styles.textoMetodo}>💳 Tarjeta de Crédito</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.botonMetodo,
          metodoPago === 'Transferencia Bancaria' && styles.metodoSeleccionado,
        ]}
        onPress={() => setMetodoPago('Transferencia Bancaria')}
      >
        <Text style={styles.textoMetodo}>🏦 Transferencia Bancaria</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.botonMetodo,
          metodoPago === 'Pago en Efectivo' && styles.metodoSeleccionado,
        ]}
        onPress={() => setMetodoPago('Pago en Efectivo')}
      >
        <Text style={styles.textoMetodo}>💵 Pago en Efectivo</Text>
      </TouchableOpacity>

      {/* 📌 Botón Confirmar */}
      <TouchableOpacity style={styles.botonConfirmar} onPress={confirmarPago}>
        <Text style={styles.textoBoton}>✅ Confirmar Pago</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PantallaConfirmacionPago;
