import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/stylesHistorialUsuario';
import SolicitudService from '../services/SolicitudService';
import { HistorialItem } from '../models/HistorialItem';
import { AuthService } from '../services/AuthService';

const PantallaHistorialUsuario = () => {
  const navigation = useNavigation();
  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [cargando, setCargando] = useState(true);

  // 📌 Animación de Filtro
  const animacionFiltro = useRef(new Animated.Value(1)).current;

  const animarFiltro = () => {
    Animated.sequence([
      Animated.timing(animacionFiltro, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(animacionFiltro, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // 📌 Función para Obtener Historial de Pedidos
  const obtenerHistorial = async () => {
    try {
      setCargando(true);
      const profile = await AuthService.obtenerPerfil();
      const user_id = profile?.user_id;
      if (!user_id) {
        console.error('No se pudo obtener el ID del usuario');
        return;
      }
      const historialData = await SolicitudService.obtenerHistorialSolicitud(user_id);
      setHistorial(historialData);
    } catch (error) {
      console.error('Error al obtener el historial:', error);
      Alert.alert('Error', 'No se pudo obtener el historial de pedidos.');
    } finally {
      setCargando(false);
    }
  };

  // 📌 Efecto para Cargar Pedidos al Montar
  useEffect(() => {
    obtenerHistorial();
  }, []);

  // 📌 Función para Filtrar Pedidos
  const pedidosFiltrados = historial.filter(pedido => {
    const cumpleFiltro = filtro === 'Todos' || pedido.estado === filtro;
    const coincideBusqueda = pedido.servicio.toLowerCase().includes(busqueda.toLowerCase()) ||
                             pedido.proveedor.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && coincideBusqueda;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📜 Historial de Pedidos</Text>

      {/* 🔍 Barra de Búsqueda */}
      <View style={styles.barraBusqueda}>
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar servicio o proveedor..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* 🔍 Filtros de Estado */}
      <View style={styles.filtrosContainer}>
        {['Todos', 'Completado', 'Pendiente', 'Cancelado'].map(estado => (
          <Animated.View key={estado} style={{ transform: [{ scale: animacionFiltro }] }}>
            <TouchableOpacity
              style={[styles.botonFiltro, filtro === estado && styles.botonFiltroActivo]}
              onPress={() => {
                setFiltro(estado);
                animarFiltro();
              }}
            >
              <Text style={styles.textoFiltro}>{estado}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* 🔄 Botón de Actualizar */}
      <TouchableOpacity style={styles.botonActualizar} onPress={obtenerHistorial}>
        <Text style={styles.textoBoton}>🔄 Actualizar Pedidos</Text>
      </TouchableOpacity>

      {/* 📌 Lista de Pedidos */}
      {cargando ? (
        <ActivityIndicator size="large" color="#FF0314" style={{ marginTop: 20 }} />
      ) : pedidosFiltrados.length === 0 ? (
        <Text style={styles.textoVacio}>No hay pedidos en el historial.</Text>
      ) : (
        <FlatList
          data={pedidosFiltrados}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('PantallaDetalleSolicitud', { solicitudId: item.id })}
            >
              <Image source={{ uri: item.fotoProveedor }} style={styles.imagenServicio} />
              <View style={styles.textosCard}>
                <Text style={styles.servicio}>{item.servicio}</Text>
                <Text style={styles.proveedor}>👤 {item.proveedor}</Text>
                <Text style={styles.estado}>
                  🏷️ Estado: <Text style={styles.estadoTexto}>{item.estado}</Text>
                </Text>
                <Text style={styles.fecha}>📅 {item.fecha}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default PantallaHistorialUsuario;
