import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/stylesHistorialUsuario';
import SolicitudService from '../services/SolicitudService'; // Importa el Servicio
import {HistorialItem} from '../models/HistorialItem';
import { AuthService } from '../services/AuthService';

const PantallaHistorialUsuario = () => {
  const navigation = useNavigation();
  const [filtro, setFiltro] = useState('Todos');
  const [historial, setHistorial] = useState<HistorialItem[]>([]); // Estado para almacenar el historial

  // 📌 Animación para la selección de filtro
  const animacionFiltro = new Animated.Value(1);

  const animarFiltro = () => {
    Animated.sequence([
      Animated.timing(animacionFiltro, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(animacionFiltro, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // 📌 Filtrar por estado
  const pedidosFiltrados =
    filtro === 'Todos'
      ? historial
      : historial.filter(pedido => pedido.estado === filtro);

  // 📌 Obtener historial desde el servicio
  const obtenerHistorial = async () => {
    try {
      const profile = await AuthService.obtenerPerfil();
      const user_id = profile?.user_id;
      if (!user_id) {
        console.error('No se pudo obtener el ID del usuario');
        return;
      }  
     const historialData = await SolicitudService.obtenerHistorialSolicitud(user_id); // Sustituir 'user-id' por el ID real del usuario
    
      setHistorial(historialData);
    } catch (error:any) {
      console.error("Error al obtener el historial:", error.message);
    }
  };

  useEffect(() => {
    obtenerHistorial(); // Obtener historial cuando el componente se monta
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📜 Historial de Pedidos</Text>

      {/* 🔍 Filtros de estado */}
      <View style={styles.filtrosContainer}>
        {['Todos', 'Completado', 'Pendiente'].map(estado => (
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

      {/* 📌 Lista de pedidos */}
      <FlatList
        data={pedidosFiltrados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('PantallaDetalleSolicitud', {
                solicitudId: item.id,
              })
            }
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
        ListEmptyComponent={<Text style={styles.textoVacio}>No hay pedidos en el historial.</Text>}
      />
    </View>
  );
};

export default PantallaHistorialUsuario;
