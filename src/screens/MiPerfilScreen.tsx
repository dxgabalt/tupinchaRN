import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from 'src/styles/stylesMiPerfil';

// 📌 Datos simulados de usuario
const usuarioSimulado = {
  nombre: 'Juan Pérez',
  correo: 'juanperez@email.com',
  telefono: '+505 8888 7777',
  fotoPerfil: 'https://via.placeholder.com/150',
};

const MiPerfilScreen = () => {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState(usuarioSimulado);
  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState(usuario.nombre);
  const [nuevoTelefono, setNuevoTelefono] = useState(usuario.telefono);
  const animacionBoton = new Animated.Value(1);

  // 📌 Guardar cambios en el perfil
  const guardarCambios = () => {
    if (!nuevoNombre.trim() || !nuevoTelefono.trim()) {
      Alert.alert('Error', 'El nombre y teléfono no pueden estar vacíos.');
      return;
    }

    setUsuario((prev) => ({
      ...prev,
      nombre: nuevoNombre,
      telefono: nuevoTelefono,
    }));
    setEditando(false);
    Alert.alert('Perfil actualizado', 'Los cambios se guardaron correctamente.');
  };

  // 📌 Animación para el botón de guardar
  const animarBoton = () => {
    Animated.sequence([
      Animated.timing(animacionBoton, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animacionBoton, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>👤 Mi Perfil</Text>

      {/* 📸 Foto de perfil */}
      <Image source={{ uri: usuario.fotoPerfil }} style={styles.fotoPerfil} />
      <TouchableOpacity
        style={styles.botonFoto}
        onPress={() => Alert.alert('Cargar nueva foto')}>
        <Text style={styles.textoBoton}>📷 Cambiar Foto</Text>
      </TouchableOpacity>

      {/* 📝 Campos de usuario */}
      <View style={styles.campoContainer}>
        <Text style={styles.label}>Nombre:</Text>
        {editando ? (
          <TextInput
            style={styles.input}
            value={nuevoNombre}
            onChangeText={setNuevoNombre}
          />
        ) : (
          <Text style={styles.texto}>{usuario.nombre}</Text>
        )}
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Correo:</Text>
        <Text style={styles.texto}>{usuario.correo}</Text>
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Teléfono:</Text>
        {editando ? (
          <TextInput
            style={styles.input}
            value={nuevoTelefono}
            keyboardType="phone-pad"
            onChangeText={setNuevoTelefono}
          />
        ) : (
          <Text style={styles.texto}>{usuario.telefono}</Text>
        )}
      </View>

      {/* 📌 Botón para editar/guardar */}
      {editando ? (
        <Animated.View style={{ transform: [{ scale: animacionBoton }] }}>
          <TouchableOpacity
            style={styles.botonGuardar}
            onPress={() => {
              guardarCambios();
              animarBoton();
            }}>
            <Text style={styles.textoBoton}>💾 Guardar Cambios</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <TouchableOpacity style={styles.botonEditar} onPress={() => setEditando(true)}>
          <Text style={styles.textoBotton}>✏️ Editar Perfil</Text>
        </TouchableOpacity>
      )}

      {/* 🔙 Botón para volver */}
      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotonVolver}>⬅️ Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MiPerfilScreen;
