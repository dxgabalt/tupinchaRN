import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthService} from 'src/services/AuthService';

const RegistroScreen = () => {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [telefono, setTelefono] = useState('');
  const [esProveedor, setEsProveedor] = useState(false);
  const [especialidad, setEspecialidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  const registrarUsuario = async () => {
    if (!correo.trim() || !contrasena.trim()) {
      Alert.alert('Error', 'Correo y contraseña son obligatorios.');
      return;
    }

    setLoading(true);

    try {
      const userId = await AuthService.crearUsuarioAuth(
        correo.trim(),
        contrasena.trim(),
      );
      if (userId !== null) {
        await AuthService.guardarPerfil(userId, nombre, telefono, esProveedor);
        Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada.');
        navigation.navigate('Login');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo registrar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Cuenta</Text>

      <TextInput
        placeholder="Nombre Completo"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />
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
      <TextInput
        placeholder="Teléfono"
        style={styles.input}
        value={telefono}
        keyboardType="phone-pad"
        onChangeText={setTelefono}
      />

      <View style={styles.switchContainer}>
        <Text>¿Te registras como proveedor?</Text>
        <Switch value={esProveedor} onValueChange={setEsProveedor} />
      </View>

      {esProveedor && (
        <>
          <TextInput
            placeholder="Especialidad (Ej: Fontanería, Electricidad)"
            style={styles.input}
            value={especialidad}
            onChangeText={setEspecialidad}
          />
          <TextInput
            placeholder="Descripción del servicio"
            style={styles.input}
            value={descripcion}
            onChangeText={setDescripcion}
          />
        </>
      )}

      <Button
        title="Registrarse"
        onPress={registrarUsuario}
        color="#FF0314"
        disabled={loading}
      />
      {loading && (
        <ActivityIndicator
          size="large"
          color="#FF0314"
          style={{marginTop: 10}}
        />
      )}

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        ¿Ya tienes una cuenta? Iniciar sesión
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#ffffff'},
  title: {fontSize: 24, fontWeight: 'bold', color: '#003366', marginBottom: 16},
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  link: {color: '#FF0314', marginTop: 10, textAlign: 'center'},
});

export default RegistroScreen;
