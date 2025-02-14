import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 📌 Datos simulados de usuario
const usuarioSimulado = {
  nombre: 'Juan Pérez',
  correo: 'juanperez@email.com',
  telefono: '+505 8888 7777',
  fotoPerfil: 'https://via.placeholder.com/100',
};

const MiPerfilScreen = () => {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState(usuarioSimulado);
  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState(usuario.nombre);
  const [nuevoTelefono, setNuevoTelefono] = useState(usuario.telefono);

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

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>👤 Mi Perfil</Text>

      {/* 📸 Foto de perfil */}
      <Image source={{ uri: usuario.fotoPerfil }} style={styles.fotoPerfil} />
      <TouchableOpacity style={styles.botonFoto} onPress={() => Alert.alert('Cargar nueva foto')}>
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
        <TouchableOpacity style={styles.botonGuardar} onPress={guardarCambios}>
          <Text style={styles.textoBoton}>💾 Guardar Cambios</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.botonEditar} onPress={() => setEditando(true)}>
          <Text style={styles.textoBoton}>✏️ Editar Perfil</Text>
        </TouchableOpacity>
      )}

      {/* 🔙 Botón para volver */}
      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotonVolver}>⬅️ Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff', alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#003366', marginBottom: 16 },
  fotoPerfil: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  botonFoto: { backgroundColor: '#ddd', padding: 8, borderRadius: 5, marginBottom: 15 },
  textoBoton: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  campoContainer: { width: '100%', marginBottom: 10 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555' },
  texto: { fontSize: 16, color: '#333', paddingVertical: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5 },
  botonEditar: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 10, width: '100%', alignItems: 'center' },
  botonGuardar: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginTop: 10, width: '100%', alignItems: 'center' },
  botonVolver: { backgroundColor: '#ccc', padding: 10, borderRadius: 5, marginTop: 10, width: '100%', alignItems: 'center' },
  textoBotonVolver: { fontSize: 14, fontWeight: 'bold', color: '#000' },
});

export default MiPerfilScreen;
