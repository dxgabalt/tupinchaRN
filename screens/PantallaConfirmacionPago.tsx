import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// 📌 Datos simulados de pago
const pagoSimulado = {
  servicio: 'Reparación de Aire Acondicionado',
  proveedor: 'Carlos López',
  fecha: '15 de Febrero, 2025',
  metodoPago: 'Tarjeta de Crédito',
  total: 'C$ 1,500',
};

const PantallaConfirmacionPago = () => {
  const navigation = useNavigation();
  const [pago, setPago] = useState(pagoSimulado);

  // 📌 Confirmar pago
  const confirmarPago = () => {
    Alert.alert('Pago Confirmado', 'Tu pago ha sido procesado correctamente.');
    navigation.replace('PantallaPagoExitoso');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>💳 Confirmación de Pago</Text>

      <View style={styles.tarjeta}>
        <Text style={styles.label}>🔧 Servicio:</Text>
        <Text style={styles.valor}>{pago.servicio}</Text>

        <Text style={styles.label}>👨‍🔧 Proveedor:</Text>
        <Text style={styles.valor}>{pago.proveedor}</Text>

        <Text style={styles.label}>📅 Fecha del Servicio:</Text>
        <Text style={styles.valor}>{pago.fecha}</Text>

        <Text style={styles.label}>💳 Método de Pago:</Text>
        <Text style={styles.valor}>{pago.metodoPago}</Text>

        <Text style={styles.label}>💰 Total a Pagar:</Text>
        <Text style={styles.valorTotal}>{pago.total}</Text>
      </View>

      {/* 📌 Botón de Confirmar Pago */}
      <TouchableOpacity style={styles.botonPagar} onPress={confirmarPago}>
        <Text style={styles.textoBoton}>✅ Confirmar Pago</Text>
      </TouchableOpacity>

      {/* 🔙 Botón para Volver */}
      <TouchableOpacity
        style={styles.botonCancelar}
        onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotonCancelar}>❌ Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 16,
  },
  tarjeta: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {fontSize: 14, fontWeight: 'bold', color: '#555', marginTop: 8},
  valor: {fontSize: 16, color: '#333'},
  valorTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 8,
  },
  botonPagar: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: '#FF0314',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  textoBoton: {fontSize: 16, fontWeight: 'bold', color: '#ffffff'},
  textoBotonCancelar: {fontSize: 16, fontWeight: 'bold', color: '#ffffff'},
});

export default PantallaConfirmacionPago;
