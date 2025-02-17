import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/stylesResultadosBusqueda';

// 📌 Datos simulados de negocios
const negociosSimulados = [
  {
    id: '1',
    nombre: 'Fontanería Express',
    categoria: 'Fontanería',
    descripcion: 'Reparaciones de tuberías y grifos.',
    ubicacion: 'La Habana, Playa',
    calificacion: 4.8,
    imagen: 'https://tupincha.com/wp-content/uploads/2024/03/ORIGINAL75.png',
  },
  {
    id: '2',
    nombre: 'Electricidad Segura',
    categoria: 'Electricidad',
    descripcion: 'Instalaciones y mantenimiento eléctrico.',
    ubicacion: 'Matanzas, Varadero',
    calificacion: 4.5,
    imagen: 'https://tupincha.com/wp-content/uploads/2024/03/ORIGINAL75.png',
  },
  {
    id: '3',
    nombre: 'Carpintería Fina',
    categoria: 'Carpintería',
    descripcion: 'Muebles a medida y reparaciones.',
    ubicacion: 'Villa Clara, Santa Clara',
    calificacion: 4.9,
    imagen: 'https://tupincha.com/wp-content/uploads/2024/03/ORIGINAL75.png',
  },
  {
    id: '4',
    nombre: 'Limpieza Total',
    categoria: 'Servicios de Limpieza',
    descripcion: 'Limpieza profunda de hogares y oficinas.',
    ubicacion: 'Santiago de Cuba, Centro',
    calificacion: 4.7,
    imagen: 'https://tupincha.com/wp-content/uploads/2024/03/ORIGINAL75.png',
  },
];

const PantallaResultadosBusqueda = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { servicio } = route.params || {};

  const [busqueda, setBusqueda] = useState('');
  const [negocios, setNegocios] = useState(negociosSimulados);
  const [fadeAnim] = useState(new Animated.Value(0));

  // 🔥 Animación de entrada
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // 🔍 Filtrar negocios según la búsqueda o el servicio seleccionado
  const negociosFiltrados = negocios.filter(
    negocio =>
      negocio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      negocio.categoria.toLowerCase().includes(servicio?.toLowerCase() || '')
  );

  return (
    <View style={styles.container}>
      {/* 🔥 Título Principal */}
      <Text style={styles.titulo}>
        {servicio ? `Negocios de ${servicio}` : 'Resultados de Búsqueda'}
      </Text>

      {/* 🔍 Barra de búsqueda */}
      <View style={styles.barraBusqueda}>
        <TextInput
          style={styles.input}
          placeholder="Buscar negocios..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* 🔥 Categorías de búsqueda */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {['Fontanería', 'Electricidad', 'Carpintería', 'Limpieza'].map((categoria, index) => (
          <TouchableOpacity key={index} style={styles.chip}>
            <Text style={styles.chipText}>{categoria}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 📌 Lista de negocios */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <FlatList
          data={negociosFiltrados}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('PantallaDetallesProveedor', { idProveedor: item.id })}
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
          ListEmptyComponent={
            <Text style={styles.textoVacio}>No se encontraron resultados.</Text>
          }
        />
      </Animated.View>
    </View>
  );
};

export default PantallaResultadosBusqueda;
