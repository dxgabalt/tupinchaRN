import React, { useEffect, useState } from 'react';
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
import { Negocio } from '../models/Negocio';
import { NegocioService } from '../services/NegocioService';
import { ProviderServiceService } from '../services/ProviderServiceService';

const PantallaResultadosBusqueda = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { servicio } = route.params || {};

  const [busqueda, setBusqueda] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [negocios, setNegocios] = useState<Negocio[]>([]);

  // 🔥 Animación de entrada
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  useEffect(() => {
    const obtenerNegocios = async () => {
      try {
        const providers_services = await ProviderServiceService.obtenerTodos();
        
        const negocios = providers_services.map((servicio) => ({
          id: servicio.id,
          nombre: servicio.providers?.profiles?.name ||'',
          tags: servicio.services.tags,
          categoria: servicio.services?.category,
          descripcion: servicio.providers.description,
          ubicacion: '',
          imagen: servicio.providers.profiles.profile_pic_url,
          calificacion:0,
        }));
        setNegocios(negocios);
      } catch (error) {
        console.error("Error obteniendo servicios:", error);
      }
    };
    obtenerNegocios();
  }, []);
  // 🔍 Filtrar negocios según la búsqueda o el servicio seleccionado
  const negociosFiltrados = negocios.filter(negocio => {
    // Filtro por nombre
    console.log(negocio.categoria)
    const matchNombre = busqueda.length === 0?negocio.nombre.toLowerCase().includes(servicio?.toLowerCase()):negocio.nombre.toLowerCase().includes(busqueda?.toLowerCase());
    const matchCategoria = busqueda.length === 0?negocio.categoria.toLowerCase().includes(servicio?.toLowerCase()):negocio.categoria.toLowerCase().includes(busqueda?.toLowerCase());
    return matchNombre || matchCategoria;
  });


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
