import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, Modal, Image, ScrollView, Animated 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/stylesPantallaNegocios';

// 🔥 Datos de categorías y ubicaciones
const categoriasSimuladas = [
  { id: '1', nombre: 'Fontanería', icono: '🚰' },
  { id: '2', nombre: 'Electricidad', icono: '⚡' },
  { id: '3', nombre: 'Carpintería', icono: '🪵' },
  { id: '4', nombre: 'Construcción', icono: '🏗️' },
  { id: '5', nombre: 'Limpieza', icono: '🧹' },
  { id: '6', nombre: 'Jardinería', icono: '🌿' },
  { id: '7', nombre: 'Pintura', icono: '🎨' },
  { id: '8', nombre: 'Mecánica', icono: '🚗' },
  { id: '9', nombre: 'Tecnología', icono: '💻' },
];

const provinciasCubanas = ['La Habana', 'Matanzas', 'Villa Clara', 'Santiago de Cuba'];
const municipios = {
  'La Habana': ['Playa', 'Centro Habana', 'Habana Vieja'],
  'Matanzas': ['Matanzas', 'Cárdenas', 'Varadero'],
  'Villa Clara': ['Santa Clara', 'Remedios', 'Caibarién'],
  'Santiago de Cuba': ['Santiago Centro', 'Contramaestre', 'San Luis'],
};

const PantallaNegocios = () => {
  const navigation = useNavigation();
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<string | null>(null);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Animación del Menú Hamburguesa
  const menuAnim = useRef(new Animated.Value(-300)).current;

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnim, {
      toValue: menuVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 🔍 Filtrar categorías según búsqueda
  const categoriasFiltradas = categoriasSimuladas.filter(categoria =>
    categoria.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 🔥 Menú Lateral con Animación */}
      {menuVisible && <View style={styles.overlay} />}
      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnim }] }]}>
        <ScrollView>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaHistorialUsuario')}>
            <Text style={styles.menuText}>🕒 Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaSoporteFAQ')}>
            <Text style={styles.menuText}>❓ Soporte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MiPerfil')}>
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
        <Text style={styles.ubicacion}>📍 {provinciaSeleccionada || 'Selecciona ubicación'}</Text>
      </View>

      {/* 🔍 Barra de búsqueda */}
      <View style={styles.barraBusqueda}>
        <Text style={styles.iconoBusqueda}>🔍</Text>
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar servicio..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* 🌍 Botón para seleccionar ubicación */}
      <TouchableOpacity style={styles.botonFiltro} onPress={() => setModalVisible(true)}>
        <Text style={styles.textoBoton}>
          {provinciaSeleccionada
            ? `${provinciaSeleccionada} - ${municipioSeleccionado || 'Selecciona municipio'}`
            : 'Seleccionar Ubicación'}
        </Text>
      </TouchableOpacity>

      {/* 📌 Modal de selección de ubicación */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Selecciona una Provincia</Text>
            <FlatList
              data={provinciasCubanas}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.opcion, provinciaSeleccionada === item && styles.opcionActiva]}
                  onPress={() => setProvinciaSeleccionada(item)}>
                  <Text style={styles.textoOpcion}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            {provinciaSeleccionada && (
              <>
                <Text style={styles.modalTitulo}>Selecciona un Municipio</Text>
                <FlatList
                  data={municipios[provinciaSeleccionada] || []}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.opcion, municipioSeleccionado === item && styles.opcionActiva]}
                      onPress={() => {
                        setMunicipioSeleccionado(item);
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textoOpcion}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
            <TouchableOpacity style={styles.botonCerrar} onPress={() => setModalVisible(false)}>
              <Text style={styles.textoBoton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🔥 Categorías con iconos */}
      <FlatList
        data={categoriasFiltradas}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={styles.filaCategorias}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cardCategoria} onPress={() => navigation.navigate('PantallaResultadosBusqueda', { servicio: item.nombre })}>
            <Text style={styles.emoji}>{item.icono}</Text>
            <Text style={styles.textoCategoria}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 📌 Botón "Ver más" */}
      <TouchableOpacity style={styles.botonVerMas}>
        <Text style={styles.textoBotonVerMas}>Ver más</Text>
      </TouchableOpacity>

      {/* 📌 Banner Promocional */}
      <TouchableOpacity style={styles.banner}>
        <Image source={{ uri: 'https://servicios.tupincha.com/wp-content/uploads/2024/01/Tu-Pincha-letras-blancas-3.png' }} style={styles.imagenBanner} />
        <Text style={styles.textoBanner}>Reserva tu servicio fácil y rápido</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PantallaNegocios;