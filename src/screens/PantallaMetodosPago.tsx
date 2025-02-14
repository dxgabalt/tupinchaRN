import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 📌 Métodos de pago simulados
const metodosPagoSimulados = [
  { id: '1', nombre: '💳 Tarjeta de Crédito/Débito' },
  { id: '2', nombre: '💰 Efectivo' },
  { id: '3', nombre: '📲 Transferencia Bancaria' },
  { id: '4', nombre: '🔵 PayPal' },
];

const PantallaMetodosPago = () => {
  const navigation = useNavigation();
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);

  // 📌 Función para confirmar pago
  const confirmarPago = () => {
    if (!metodoSeleccionado) {
      Alert.alert('Error', 'Por favor, selecciona un método de pago.');
      return;
    }

    Alert.alert('Método de Pago Confirmado', `Has seleccionado ${metodoSeleccionado.nombre}.`);
    navigation.navigate('PantallaConfirmacionPago', { metodo: metodoSeleccionado });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Selecciona un Método de Pago</Text>

      <FlatList
        data={metodosPagoSimulados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              metodoSeleccionado?.id === item.id && styles.cardSeleccionado,
            ]}
            onPress={() => setMetodoSeleccionado(item)}
          >
            <Text style={styles.textoMetodo}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón para confirmar selección */}
      <TouchableOpacity style={styles.botonConfirmar} onPress={confirmarPago}>
        <Text style={styles.textoBoton}>✅ Confirmar Método</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#003366', marginBottom: 16, textAlign: 'center' },
  card: { padding: 15, backgroundColor: '#f5f5f5', borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  cardSeleccionado: { backgroundColor: '#FF0314' },
  textoMetodo: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  botonConfirmar: { backgroundColor: '#FF0314', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  textoBoton: { fontSize: 16, color: '#ffffff', fontWeight: 'bold' },
});

export default PantallaMetodosPago;
