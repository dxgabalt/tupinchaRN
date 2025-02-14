import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

  // 📌 Filtrar por estado
  const pedidosFiltrados =
    filtro === 'Todos'
      ? pedidosSimulados
      : pedidosSimulados.filter((pedido) => pedido.estado === filtro);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📜 Historial de Pedidos</Text>

      {/* 🔍 Filtros de estado */}
      <View style={styles.filtrosContainer}>
        {['Todos', 'Completado', 'Pendiente'].map((estado) => (
          <TouchableOpacity
            key={estado}
            style={[
              styles.botonFiltro,
              filtro === estado && styles.botonFiltroActivo,
            ]}
            onPress={() => setFiltro(estado)}
          >
            <Text style={styles.textoFiltro}>{estado}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 📌 Lista de pedidos */}
      <FlatList
        data={pedidosFiltrados}
        keyExtractor={(item) => item.id}
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#003366', textAlign: 'center', marginBottom: 16 },
  filtrosContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  botonFiltro: { padding: 10, backgroundColor: '#e0e0e0', marginHorizontal: 5, borderRadius: 5 },
  botonFiltroActivo: { backgroundColor: '#FF0314' },
  textoFiltro: { color: '#fff' },
  card: { flexDirection: 'row', padding: 15, backgroundColor: '#f5f5f5', borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  imagenServicio: { width: 50, height: 50, marginRight: 10 },
  textosCard: { flex: 1 },
  servicio: { fontSize: 16, fontWeight: 'bold' },
  proveedor: { fontSize: 14, color: '#555' },
  estado: { fontSize: 14, marginTop: 5 },
  estadoTexto: { fontWeight: 'bold' },
  fecha: { fontSize: 12, color: '#888', marginTop: 5 },
});

export default PantallaHistorialUsuario;
