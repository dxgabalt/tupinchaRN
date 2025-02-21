import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles/stylesGestionSolicitudes';
import SolicitudService from '../../services/SolicitudService';
import SupabaseService from '../../services/SupabaseService';

const PantallaGestionSolicitudes = () => {
  const navigation = useNavigation();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const user = await SupabaseService.obtenerUsuarioAuth();
        const data = await SolicitudService.obtenerSolicitudesProveedor(user?.id);
        setSolicitudes(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las solicitudes.');
      } finally {
        setLoading(false);
      }
    };
    obtenerSolicitudes();
  }, []);

  const manejarSolicitud = async (idSolicitud, estado) => {
    try {
      await SolicitudService.actualizarEstadoSolicitud(idSolicitud, estado);
      Alert.alert('Éxito', `Solicitud ${estado}`);
      setSolicitudes(solicitudes.filter((s) => s.id !== idSolicitud));
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la solicitud.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📌 Solicitudes Recibidas</Text>

      {loading ? (
        <Text style={styles.loadingText}>Cargando solicitudes...</Text>
      ) : solicitudes.length === 0 ? (
        <Text style={styles.noSolicitudes}>No hay solicitudes pendientes.</Text>
      ) : (
        <FlatList
          data={solicitudes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.descripcion}>{item.descripcion}</Text>
              <Text style={styles.fecha}>📅 {item.fecha}</Text>
              <Text style={styles.precio}>💰 {item.precio_ofrecido} USD</Text>

              <View style={styles.botonesContainer}>
                <TouchableOpacity
                  style={styles.botonAceptar}
                  onPress={() => manejarSolicitud(item.id, 'aceptada')}
                >
                  <Text style={styles.textoBoton}>✅ Aceptar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botonRechazar}
                  onPress={() => manejarSolicitud(item.id, 'rechazada')}
                >
                  <Text style={styles.textoBoton}>❌ Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotonVolver}>⬅️ Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PantallaGestionSolicitudes;
