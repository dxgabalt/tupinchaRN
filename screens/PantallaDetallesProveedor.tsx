import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/stylesDetallesProveedor';
import { ProviderServiceService } from '../services/ProviderServiceService';
import { ProviderService } from '../models/ProviderService';

// 📌 Datos simulados del proveedor
/*const proveedorSimulado = {
  id: '1',
  nombre: 'Fontanería Express',
  especialidad: 'Fontanería',
  descripcion: 'Reparaciones de tuberías, grifos y sistemas de drenaje.',
  ubicacion: 'La Habana, Playa',
  calificacion: 4.8,
  telefono: '+53 5555 5555',
  correo: 'fontaneria@email.com',
  imagenPortada: 'https://tupincha.com/wp-content/uploads/2024/03/ORIGINAL75.png',
  imagenPerfil: 'https://tupincha.com/wp-content/uploads/2024/03/ORIGINAL75.png',
};*/

const PantallaDetallesProveedor = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { idProveedor } = route.params || {};

  const [proveedor, setProveedor] = useState<ProviderService | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = new Animated.Value(menuVisible ? 0 : -300);

  // 📌 Función para contactar al proveedor
  const contactarProveedor = () => {
    Alert.alert(
      'Contacto',
      `Puedes contactar a ${proveedor?.providers.profiles.name}:\n📞 ${proveedor?.providers.phone}\n📧 ${proveedor?.providers.profiles.name}`
    );
  };

  // 📌 Función para alternar el menú hamburguesa
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnim, {
      toValue: menuVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
 useEffect(() => {
    const obtenerNegocios = async () => {
      try {
        const provider_service = await ProviderServiceService.obtenerPorId(idProveedor);
        setProveedor(provider_service);
      } catch (error) {
        console.error("Error obteniendo servicios:", error);
      }
    };
    obtenerNegocios();
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
            <Text style={styles.menuText}>🔍 Buscar Negocios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaResultadosBusqueda')}>
            <Text style={styles.menuText}>📌 Resultados</Text>
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

      {/* 🔥 Encabezado con Menú Hamburguesa */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Detalles del Proveedor</Text>
      </View>

      <ScrollView>
        {/* 📌 Imagen de Portada */}
        <Image source={{ uri: proveedor?.providers.profiles.profile_pic_url }} style={styles.imagenPortada} />

        {/* 📌 Información del Proveedor */}
        <View style={styles.perfilContainer}>
          <Image source={{ uri: proveedor?.providers.profiles.profile_pic_url }} style={styles.imagenPerfil} />
          <Text style={styles.nombre}>{proveedor?.providers.profiles.name}</Text>
          <Text style={styles.especialidad}>{proveedor?.providers.speciality}</Text>
          <Text style={styles.ubicacion}>📍 </Text>
          <Text style={styles.calificacion}>⭐ {proveedor?.providers.profiles.rating} / 5</Text>
        </View>

        {/* 📌 Descripción */}
        <View style={styles.detallesContainer}>
          <Text style={styles.tituloSeccion}>Sobre el Servicio</Text>
          <Text style={styles.descripcion}>{proveedor?.providers.description}</Text>
        </View>

        {/* 📌 Botones de Acción */}
        <View style={styles.botonesContainer}>
          <TouchableOpacity style={styles.botonContacto} onPress={contactarProveedor}>
            <Text style={styles.textoBoton}>📞 Contactar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botonSolicitar}
            //proveedor?.proveedor?.services.id
           
            onPress={() => navigation.navigate('PantallaSolicitudServicio', { 
              idProveedor, 
              service_id: proveedor?.services.id 
            })}
          >
            <Text style={styles.textoBoton}>🛠️ Solicitar Servicio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PantallaDetallesProveedor;
