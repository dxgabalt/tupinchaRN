import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from 'src/styles/stylesMetodosPago';

// 📌 Métodos de pago actualizados
const metodosPago = [
  { id: '1', nombre: '📲 Transfermóvil' },
  { id: '2', nombre: '💳 EnZona' },
  { id: '3', nombre: '💰 Efectivo' },
  { id: '4', nombre: '🔵 PayPal' },
  { id: '5', nombre: '💸 Zelle' },
  { id: '6', nombre: '💵 Cash App' },
];

const PantallaMetodosPago = () => {
  const navigation = useNavigation();
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);

  // 📌 Animación al seleccionar un método
  const animacion = new Animated.Value(1);

  const seleccionarMetodo = (metodo) => {
    setMetodoSeleccionado(metodo);
    Animated.sequence([
      Animated.timing(animacion, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(animacion, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // 📌 Confirmar selección de método de pago
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
      {/* 🔥 Título */}
      <Text style={styles.titulo}>Selecciona un Método de Pago</Text>

      {/* 📌 Lista de Métodos de Pago */}
      <FlatList
        data={metodosPago}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View style={{ transform: [{ scale: metodoSeleccionado?.id === item.id ? animacion : 1 }] }}>
            <TouchableOpacity
              style={[
                styles.card,
                metodoSeleccionado?.id === item.id && styles.cardSeleccionado,
              ]}
              onPress={() => seleccionarMetodo(item)}
            >
              <Text style={styles.textoMetodo}>{item.nombre}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      />

      {/* ✅ Botón para confirmar selección */}
      <TouchableOpacity style={styles.botonConfirmar} onPress={confirmarPago}>
        <Text style={styles.textoBoton}>✅ Confirmar Método</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PantallaMetodosPago;
