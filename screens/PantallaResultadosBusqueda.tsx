import React, { useEffect, useState, useRef } from 'react';
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
import { ProviderServiceService } from '../services/ProviderServiceService';

const PantallaResultadosBusqueda = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { servicio } = route.params || {};

  const [busqueda, setBusqueda] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [loading, setLoading] = useState(true); // Estado de carga
  const [menuVisible, setMenuVisible] = useState(false);

  // 🔥 Animación de entrada
  useEffect(() => {
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
          nombre: servicio.providers?.profiles?.name || '',
          tags: servicio.services.tags || [],
          categoria: servicio.services?.category || '',
          descripcion: servicio.providers?.description || 'No hay descripción disponible',
          ubicacion: servicio.providers?.profiles?.location || 'Sin ubicación',
          imagen: servicio.providers?.profiles?.profile_pic_url || 'https://via.placeholder.com/100',
          calificacion: servicio.providers?.calificacion || 0,
        }));
        setNegocios(negocios);
      } catch (error) {
        console.error("Error obteniendo servicios:", error);
      } finally {
        setLoading(false); // Oculta el estado de carga
      }
    };
    obtenerNegocios();
  }, []);

  // 🔥 Filtrar negocios según la búsqueda o el servicio seleccionado
  const negociosFiltrados = negocios.filter(negocio => {
    const matchNombre = negocio.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = negocio.categoria.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoriaSeleccionada = negocio.categoria.toLowerCase().includes(categoriaSeleccionada.toLowerCase());
    return matchNombre || matchCategoria || matchCategoriaSeleccionada;
  });

  // 🔥 Animación del Menú Hamburguesa
  const menuAnim = useRef(new Animated.Value(-300)).current;
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnim, {
      toValue: menuVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* 🔥 Menú Lateral con Animación */}
      {menuVisible && <View style={styles.overlay} />}
      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX: menuAnim }] },
        ]}
      >
        <ScrollView>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("PantallaHistorialUsuario")}
          >
            <Text style={styles.menuText}>🕒 Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("PantallaSoporteFAQ")}
          >
            <Text style={styles.menuText}>❓ Soporte</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("MiPerfil")}
          >
            <Text style={styles.menuText}>👤 Mi Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuCerrar} onPress={toggleMenu}>
            <Text style={styles.menuCerrarTexto}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* 🔥 Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.bienvenida}>Hola, Usuario!</Text>
        <Text style={styles.ubicacion}>
          📍 {servicio || "Selecciona ubicación"}
        </Text>
      </View>

      {/* 🔍 Barra de búsqueda */}
      <View style={styles.barraBusqueda}>
        <TextInput
          style={styles.input}
          placeholder="Buscar negocios..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* 📌 Lista de negocios */}
      <Animated.View style={[{ opacity: fadeAnim }, styles.listaNegocios]}>
        {loading ? (
          <Text style={styles.textoVacio}>Cargando negocios...</Text>
        ) : negociosFiltrados.length === 0 ? (
          <Text style={styles.textoVacio}>No se encontraron resultados.</Text>
        ) : (
          <FlatList
            data={negociosFiltrados}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
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
          />
        )}
      </Animated.View>
    </View>
  );
};

export default PantallaResultadosBusqueda;
