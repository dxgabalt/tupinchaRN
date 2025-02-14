import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import SupabaseService from '../services/SupabaseService';
import {StackNavigation} from '../types/navigation';

const PantallaSolicitudServicio = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {idProveedor} = route.params as {idProveedor: string};

  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [imagenesUrl, setImagenesUrl] = useState('');

  const enviarSolicitud = async () => {
    try {
      await SupabaseService.crearSolicitudDeServicio(
        parseInt(idProveedor),
        1,
        descripcion,
        fecha,
        imagenesUrl,
      );
      Alert.alert('Éxito', 'Solicitud enviada exitosamente');
      navigation.goBack();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitud de Servicio</Text>
      <TextInput
        placeholder="Descripción del servicio"
        style={styles.input}
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        placeholder="Fecha del servicio (YYYY-MM-DD)"
        style={styles.input}
        value={fecha}
        onChangeText={setFecha}
      />
      <TextInput
        placeholder="URL de imágenes (opcional)"
        style={styles.input}
        value={imagenesUrl}
        onChangeText={setImagenesUrl}
      />
      <Button
        title="Enviar Solicitud"
        onPress={enviarSolicitud}
        color="#FF0314"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default PantallaSolicitudServicio;
