import React, { useState } from 'react';
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

// 📌 Datos simulados para mostrar historial de pedidos
const pedidosSimulados = [
  {
    id: '1',
    servicio: 'Fontanería',
    proveedor: 'Carlos López',
    estado: 'Completado',
    fecha: '2024-02-10',
    imagen: 'https://cdn-icons-png.flaticon.com/512/3063/3063826.png',
  },
  {
    id: '2',
    servicio: 'Electricidad',
    proveedor: 'María Gómez',
    estado: 'Pendiente',
    fecha: '2024-02-12',
    imagen: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
  },
  {
    id: '3',
    servicio: 'Reparación de Electrodomésticos',
    proveedor: 'Juan Pérez',
    estado: 'Completado',
    fecha: '2024-02-08',
    imagen: 'https://cdn-icons-png.flaticon.com/512/1053/1053244.png',
  },
];

const PantallaHistorialUsuario = () => {
  const navigation = useNavigation();
  const [filtro, setFiltro] = useState('Todos');

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
      ? pedidosSimulados
      : pedidosSimulados.filter(pedido => pedido.estado === filtro);

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
            <Image source={{ uri: item.imagen }} style={styles.imagenServicio} />
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
