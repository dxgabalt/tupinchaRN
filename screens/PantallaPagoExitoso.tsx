import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const PantallaPagoExitoso = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.titulo}>¡Solicitud Exitosa!</Text>
      <Text style={styles.descripcion}>
        Tu pago ha sido procesado correctamente. Puedes revisar los detalles en
        tu historial de pagos.
      </Text>

      {/* 🔍 Ir al historial */}
      <TouchableOpacity
        style={styles.botonHistorial}
        onPress={() => navigation.replace('PantallaHistorialUsuario')}>
        <Text style={styles.textoBoton}>📜 Ver Historial</Text>
      </TouchableOpacity>

      {/* 🏠 Volver a la pantalla principal */}
      <TouchableOpacity
        style={styles.botonInicio}
        onPress={() => navigation.replace('PantallaNegocios')}>
        <Text style={styles.textoBoton}>🏠 Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  emoji: {fontSize: 60, marginBottom: 10},
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  botonHistorial: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  botonInicio: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  textoBoton: {fontSize: 16, fontWeight: 'bold', color: '#ffffff'},
});

export default PantallaPagoExitoso;
