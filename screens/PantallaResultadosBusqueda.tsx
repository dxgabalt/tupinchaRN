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
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/stylesResultadosBusqueda';
import { ProviderServiceService } from '../services/ProviderServiceService';
import { AuthService } from '../services/AuthService';

const PantallaResultadosBusqueda = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { servicio,service_id } = route.params || {};

  const [busqueda, setBusqueda] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const usuarioDefault = { id: '', name: '', email: '', phone: '', profile_pic_url: '', user_id: '' };
  const [usuario, setUsuario] = useState(usuarioDefault);

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
        const providers_services = await ProviderServiceService.obtenerPorServicio(service_id);
        const negociosFormateados = providers_services.map((servicio) => ({
          id: servicio.id,
          nombre: servicio.providers?.profiles?.name || 'Sin nombre',
          tags: servicio.services?.tags || [],
          categoria: servicio.services?.category || 'Sin categoría',
          descripcion: servicio.providers?.description || 'No hay descripción disponible',
          ubicacion: servicio.providers?.ubicacion || 'Sin ubicación',
          imagen: servicio.providers?.profiles?.profile_pic_url || '',
          calificacion: servicio.providers?.profiles?.rating || 0,
        }));
        setNegocios(negociosFormateados);
      } catch (error) {
        console.error("Error obteniendo servicios:", error);
      } finally {
        setLoading(false);
      }
    };
    obtenerNegocios();
  }, []);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const profile = await AuthService.obtenerPerfil();
        setUsuario(profile || usuarioDefault);
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
      }
    };
    obtenerUsuario();
  }, []);

  // 🔥 Filtrar negocios según la búsqueda
  const negociosFiltrados = negocios.filter(negocio => {
    return negocio.nombre.toLowerCase().includes(busqueda.toLowerCase()) || negocio.categoria.toLowerCase().includes(busqueda.toLowerCase());
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
      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnim }] }]}>
        <ScrollView>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("PantallaNegocios")}>
            <Text style={styles.menuText}>🔎 Buscar Proveedores</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("PantallaHistorialUsuario")}>
            <Text style={styles.menuText}>🕒 Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("PantallaSoporteFAQ")}>
            <Text style={styles.menuText}>❓ Soporte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("MiPerfil")}>
            <Text style={styles.menuText}>👤 Mi Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
  style={styles.menuCerrar}
  onPress={async () => {
    const logoutSuccess = await AuthService.logout();
    if (logoutSuccess) {
      navigation.replace("Login");
    } else {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  }}
>
  <Text style={styles.menuCerrarTexto}>🚪 Cerrar Sesión</Text>
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
        <Text style={styles.bienvenida}>Hola, {usuario?.name || "Usuario"}</Text>
        <Text style={styles.ubicacion}>📍 {servicio || "Selecciona un servicio"}</Text>
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
          <ActivityIndicator size="large" color="#FF0314" />
        ) : negociosFiltrados.length === 0 ? (
          <Text style={styles.textoVacio}>No se encontraron resultados.</Text>
        ) : (
          <FlatList
            data={negociosFiltrados}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('PantallaDetallesProveedor', { idProveedor: item.id })}
              >
                {item.imagen ? (
                  <Image source={{ uri: item.imagen }} style={styles.imagen} />
                ) : (
                  <View style={[styles.imagen, { backgroundColor: '#ccc' }]} />
                )}
                
                <View style={styles.infoContainer}>
                  <Text style={styles.nombre}>{item.nombre}</Text>
                  <Text style={styles.descripcion}>{item.descripcion}</Text>
                  <Text style={styles.ubicacion}>📍 {item.ubicacion}</Text>
                  <Text style={styles.calificacion}>⭐ {item.calificacion}/5</Text>
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
