import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// 📌 Datos simulados de negocios
const negociosSimulados = [
  {
    id: '1',
    nombre: 'Fontanería Express',
    categoria: 'Fontanería',
    descripcion: 'Reparaciones de tuberías y grifos.',
    ubicacion: 'La Habana, Playa',
    calificacion: 4.8,
    imagen: 'https://source.unsplash.com/100x100/?plumbing',
  },
  {
    id: '2',
    nombre: 'Electricidad Segura',
    categoria: 'Electricidad',
    descripcion: 'Instalaciones y mantenimiento eléctrico.',
    ubicacion: 'Matanzas, Varadero',
    calificacion: 4.5,
    imagen: 'https://source.unsplash.com/100x100/?electrician',
  },
  {
    id: '3',
    nombre: 'Carpintería Fina',
    categoria: 'Carpintería',
    descripcion: 'Muebles a medida y reparaciones.',
    ubicacion: 'Villa Clara, Santa Clara',
    calificacion: 4.9,
    imagen: 'https://source.unsplash.com/100x100/?woodwork',
  },
  {
    id: '4',
    nombre: 'Limpieza Total',
    categoria: 'Servicios de Limpieza',
    descripcion: 'Limpieza profunda de hogares y oficinas.',
    ubicacion: 'Santiago de Cuba, Centro',
    calificacion: 4.7,
    imagen: 'https://source.unsplash.com/100x100/?cleaning',
  },
];

const PantallaResultadosBusqueda = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { servicio } = route.params || {};

  const [busqueda, setBusqueda] = useState('');
  const [negocios, setNegocios] = useState(negociosSimulados);

  // Filtrar negocios según la búsqueda o el servicio seleccionado
  const negociosFiltrados = negocios.filter((negocio) =>
    negocio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    negocio.categoria.toLowerCase().includes(servicio?.toLowerCase() || '')
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {servicio ? `Negocios de ${servicio}` : 'Resultados de Búsqueda'}
      </Text>

      {/* Barra de búsqueda */}
      <TextInput
        style={styles.input}
        placeholder="Buscar negocios..."
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {/* Lista de negocios */}
      <FlatList
        data={negociosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('PantallaDetallesProveedor', { idProveedor: item.id })
            }
          >
            <Image source={{ uri: item.imagen }} style={styles.imagen} />
            <View style={styles.infoContainer}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.descripcion}>{item.descripcion}</Text>
              <Text style={styles.ubicacion}>📍 {item.ubicacion}</Text>
              <Text style={styles.calificacion}>⭐ {item.calificacion} / 5</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.textoVacio}>No se encontraron resultados.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#003366', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#cccccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  imagen: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  infoContainer: { flex: 1 },
  nombre: { fontSize: 18, fontWeight: 'bold', color: '#003366' },
  descripcion: { fontSize: 14, color: '#666' },
  ubicacion: { fontSize: 14, color: '#444', marginTop: 5 },
  calificacion: { fontSize: 14, fontWeight: 'bold', color: '#FF0314', marginTop: 5 },
  textoVacio: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },
});

export default PantallaResultadosBusqueda;
