import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthService} from 'src/services/AuthService';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!correo.trim() || !contrasena.trim()) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.autenticarUsuario(correo, contrasena); // Llama al método login
      Alert.alert('Éxito', response.message);
      navigation.reset({
        index: 0,
        routes: [{name: 'PantallaNegocios'}],
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo Electrónico"
        style={styles.input}
        value={correo}
        keyboardType="email-address"
        onChangeText={setCorreo}
      />

      <View style={styles.contenedorContrasena}>
        <TextInput
          placeholder="Contraseña"
          style={styles.inputContrasena}
          value={contrasena}
          secureTextEntry={!mostrarContrasena}
          onChangeText={setContrasena}
        />
        <TouchableOpacity
          onPress={() => setMostrarContrasena(!mostrarContrasena)}>
          <Text style={styles.textoMostrar}>
            {mostrarContrasena ? '🙈' : '👁️'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('OlvidarContrasenaScreen')}>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.boton}
        onPress={handleLogin}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.textoBoton}>Ingresar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RegistroScreen')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  contenedorContrasena: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    paddingRight: 10,
  },
  inputContrasena: {
    flex: 1,
    padding: 12,
  },
  textoMostrar: {
    fontSize: 18,
  },
  link: {
    color: '#FF0314',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  boton: {
    backgroundColor: '#FF0314',
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
