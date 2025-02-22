import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../styles/stylesGestionServicios';
import SupabaseService from '../../services/SupabaseService';
import { ServiceService } from "../../services/ServiceService";
import { AuthService } from '../../services/AuthService';

const PantallaGestionServicios = () => {
  const navigation = useNavigation();
  const [perfil, setPerfil] = useState({});
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [portafolio, setPortafolio] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const user = await SupabaseService.obtenerUsuarioAuth();
        const perfilData = await AuthService.obtenerPerfil();
        setPerfil(perfilData);
        setPortafolio(perfilData.portafolio || []);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el perfil.');
      } finally {
        setCargando(false);
      }
    };
    cargarPerfil();
  }, []);

  const agregarServicio = async () => {
    if (!nuevaEspecialidad || !nuevaDescripcion) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }
    try {
      await ServiceService.agregarServicio(perfil.id, nuevaEspecialidad, nuevaDescripcion);
      Alert.alert('Éxito', 'Servicio agregado.');
      setNuevaEspecialidad('');
      setNuevaDescripcion('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el servicio.');
    }
  };

  const seleccionarImagen = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso Denegado', 'Se requiere acceso a la galería.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled && result.assets) {
        setPortafolio([...portafolio, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>👨‍🔧 Gestión de Servicios</Text>

      {cargando ? (
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      ) : (
        <>
          <Text style={styles.label}>Teléfono: {perfil.phone}</Text>
          <Text style={styles.label}>Especialidad: {perfil.speciality}</Text>
          <Text style={styles.label}>Disponibilidad: {perfil.availability}</Text>
          
          <Text style={styles.label}>Nueva Especialidad</Text>
          <TextInput
            placeholder="Ejemplo: Electricidad Industrial"
            style={styles.input}
            value={nuevaEspecialidad}
            onChangeText={setNuevaEspecialidad}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            placeholder="Ejemplo: Instalación y mantenimiento de sistemas eléctricos."
            style={styles.input}
            value={nuevaDescripcion}
            onChangeText={setNuevaDescripcion}
            multiline
          />

          <TouchableOpacity style={styles.botonAgregar} onPress={agregarServicio}>
            <Text style={styles.textoBoton}>➕ Agregar Servicio</Text>
          </TouchableOpacity>

          <Text style={styles.label}>📸 Portafolio</Text>
          <TouchableOpacity style={styles.botonSubir} onPress={seleccionarImagen}>
            <Text style={styles.textoBoton}>📷 Subir Imagen</Text>
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.portafolioContainer}>
            {portafolio.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.imagenPortafolio} />
            ))}
          </ScrollView>
        </>
      )}

      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotonVolver}>⬅️ Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PantallaGestionServicios;
