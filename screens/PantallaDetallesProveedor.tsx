import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/stylesDetallesProveedor';
import { ProviderServiceService } from '../services/ProviderServiceService';
import { ProviderService } from '../models/ProviderService';

const PantallaDetallesProveedor = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { idProveedor } = route.params || {};

  const [proveedor, setProveedor] = useState<ProviderService | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(-300)).current;

  // 📌 Animación del Menú Hamburguesa
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnim, {
      toValue: menuVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 📌 Función para contactar al proveedor
  const contactarProveedor = () => {
    Alert.alert(
      'Contacto',
      `Puedes contactar a ${proveedor?.providers.profiles.name}:\n📞 ${proveedor?.providers.phone}\n📧 ${proveedor?.providers.profiles.email}`
    );
  };

  // 📌 Obtener datos del proveedor
  useEffect(() => {
    const obtenerProveedor = async () => {
      try {
        const providerService = await ProviderServiceService.obtenerPorId(idProveedor);
        setProveedor(providerService);
      } catch (error) {
        console.error('Error obteniendo datos del proveedor:', error);
        Alert.alert('Error', 'No se pudo cargar la información del proveedor.');
      } finally {
        setLoading(false);
      }
    };
    obtenerProveedor();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🔥 Menú Lateral con Animación */}
      {menuVisible && <View style={styles.overlay} />}
      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnim }] }]}>
        <ScrollView>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaInicio')}>
            <Text style={styles.menuText}>🏠 Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaNegocios')}>
            <Text style={styles.menuText}>🔍 Buscar Proveedores</Text>
          </TouchableOpacity>
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
        <Text style={styles.tituloHeader}>Detalles del Proveedor</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF0314" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView>
          {/* 📌 Imagen de Portada */}
          <Image source={{ uri: proveedor?.providers.profiles.profile_pic_url }} style={styles.imagenPortada} />

          {/* 📌 Información del Proveedor */}
          <View style={styles.perfilContainer}>
            <Image source={{ uri: proveedor?.providers.profiles.profile_pic_url }} style={styles.imagenPerfil} />
            <Text style={styles.nombre}>{proveedor?.providers.profiles.name}</Text>
            <Text style={styles.especialidad}>{proveedor?.providers.speciality}</Text>
            <Text style={styles.ubicacion}>📍 {proveedor?.providers.ubicacion}</Text>
            <Text style={styles.calificacion}>⭐ {proveedor?.providers.profiles.rating} / 5</Text>
          </View>

          {/* 📌 Descripción */}
          <View style={styles.detallesContainer}>
            <Text style={styles.tituloSeccion}>Sobre el Servicio</Text>
            <Text style={styles.descripcion}>{proveedor?.providers.description}</Text>
          </View>

          {/* 📌 Portafolio de Trabajos */}
          <View style={styles.portafolioContainer}>
            <Text style={styles.tituloSeccion}>📸 Portafolio</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {proveedor?.providers.portafolio_provider?.map((portafolio, index) => (
                <Image key={index} source={{ uri: portafolio.imagen }} style={styles.imagenPortafolio} />
              ))}
            </ScrollView>
          </View>

          {/* 📌 Botones de Acción */}
          <View style={styles.botonesContainer}>
            <TouchableOpacity style={styles.botonContacto} onPress={contactarProveedor}>
              <Text style={styles.textoBoton}>📞 Contactar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botonSolicitar}
              onPress={() =>
                navigation.navigate('PantallaSolicitudServicio', {
                  proveedor,
                  idProveedor:proveedor?.provider_id,
                  service_id: proveedor?.services.id,
                })
              }
            >
              <Text style={styles.textoBoton}>🛠️ Solicitar Servicio</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default PantallaDetallesProveedor;
