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
  FlatList,
  TextInput,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/stylesDetalleSolicitud';
import { Solicitud } from '../models/Solicitud';
import SolicitudService from '../services/SolicitudService';
import { Cotizacion } from '../models/Cotizacion';
import CotizacionService from '../services/CotizacionService';

// 📌 Pantalla Detalle de la Solicitud
const PantallaDetalleSolicitud = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { solicitudId } = route.params || {};

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [cotizacionesNotas, setCotizacionesNotas] = useState({});
  const [cargando, setCargando] = useState(true);
  const [enviandoNota, setEnviandoNota] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(-300)).current;

  // 📌 Animación para el botón de contacto
  const animacion = useRef(new Animated.Value(1)).current;

  const animarBoton = () => {
    Animated.sequence([
      Animated.timing(animacion, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(animacion, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // 📌 Obtener datos de la solicitud
  useEffect(() => {
    const obtenerSolicitud = async () => {
      try {
        setCargando(true);
        const data = await SolicitudService.obtenerSolicitudPorId(solicitudId);
        setSolicitud(data);
        
        // Verificar si hay cotizaciones y asignarlas
        if (data && data.cotizaciones && Array.isArray(data.cotizaciones)) {
          setCotizaciones(data.cotizaciones);
          // Inicializar el estado de notas para cada cotización
          const notasIniciales = {};
          data.cotizaciones.forEach((cotizacion, index) => {
          notasIniciales[cotizacion.id] = cotizacion?.cotizacion_notas
          });
          setCotizacionesNotas(notasIniciales);
        } else {
          console.log("No se encontraron cotizaciones o no es un array:", data?.cotizaciones);
          setCotizaciones([]);
        }

      } catch (error) {
        console.error("Error obteniendo la solicitud:", error);
        Alert.alert('Error', 'No se pudo obtener la información de la solicitud.');
      } finally {
        setCargando(false);
      }
    };
    
    if (solicitudId) {
      obtenerSolicitud();
    } else {
      console.error("No se proporcionó un ID de solicitud");
      Alert.alert('Error', 'Identificador de solicitud no válido.');
      setCargando(false);
    }
  }, [solicitudId]); 


  // 📌 Función para contactar al proveedor
  const contactarProveedor = () => {
    animarBoton();
    Alert.alert(
      'Contacto',
      `Llamando a ${solicitud?.providers?.profiles?.name} al ${solicitud?.providers?.profiles?.phone}...`
    );
  };

  // 📌 Mostrar/Ocultar Menú de Navegación
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnim, {
      toValue: menuVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 📌 Manejar cambio de texto en notas
  const handleCambioNota = (cotizacionId:number, texto:string) => {
    setCotizacionesNotas(prevState => ({
      ...prevState,
      [cotizacionId]: {
        ...prevState[cotizacionId],
        texto
      }
    }));
  };

  // 📌 Enviar nota a la cotización
  const enviarNota = async (cotizacionId:number) => {
    const nota = cotizacionesNotas[cotizacionId]?.texto;
    if (!nota || nota.trim() === '') {
      Alert.alert('Nota vacía', 'Por favor escribe una nota antes de enviar.');
      return;
    }
    try {
      setEnviandoNota(true);
      // Aquí deberías agregar la lógica para enviar la nota al backend
      CotizacionService.agregarNotaCotizacion(cotizacionId, nota);
      // Actualizar el estado local
      setCotizacionesNotas(prevState => {
          const nuevasNotas = [...(prevState[cotizacionId]?.notas || [])];
          nuevasNotas.push({
            id: Date.now().toString(),
            texto: nota,
            fecha: new Date().toLocaleString()
          });
          
          return {
            ...prevState,
            [cotizacionId]: {
              texto: '',
              notas: nuevasNotas
            }
          };
        });
        Keyboard.dismiss();
        setEnviandoNota(false);
        Alert.alert('Éxito', 'Nota enviada correctamente.');
      
    } catch (error) {
      console.error("Error enviando nota:", error);
      Alert.alert('Error', 'No se pudo enviar la nota. Intenta nuevamente.');
      setEnviandoNota(false);
    }
  };

  // Renderizar un item de cotización
  const renderCotizacionItem = ({ item, index }) => {
    const cotizacionId = item.id;
    const notasInfo = cotizacionesNotas[cotizacionId] || { texto: '', notas: [] };
    return (
      <View style={styles.cotizacionItem}>
        <Text style={styles.cotizacionTitulo}>Cotización #{index + 1}</Text>
        <View style={styles.cotizacionDetalle}>
          <Text style={styles.cotizacionLabel}>Mano de obra:</Text>
          <Text style={styles.cotizacionValor}>${item.costo_mano_obra}</Text>
        </View>
        <View style={styles.cotizacionDetalle}>
          <Text style={styles.cotizacionLabel}>Materiales:</Text>
          <Text style={styles.cotizacionValor}>${item.costo_materiales}</Text>
        </View>
        <View style={styles.cotizacionDetalle}>
          <Text style={styles.cotizacionLabel}>Total:</Text>
          <Text style={styles.cotizacionValorTotal}>
            ${parseFloat(item.costo_mano_obra || 0) + parseFloat(item.costo_materiales || 0)}
          </Text>
        </View>
        <Text style={styles.cotizacionDescripcion}>{item.descripcion}</Text>
        
        {/* Sección de Notas */}
        <View style={styles.notasContainer}>
          <Text style={styles.notasTitulo}>Notas:</Text>
          
          {/* Lista de notas existentes */}
          {notasInfo.length > 0 ? (
            notasInfo.map((nota, i) => (
              <View key={`nota-${i}`} style={styles.notaItem}>
                <Text style={styles.notaTexto}>{nota.nota_client}</Text>
                <Text style={styles.notaProveedor}>{nota.nota_provider}</Text>
                <Text style={styles.notaFecha}>{nota.created_at}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.sinNotas}>No hay notas para esta cotización</Text>
          )}
          
          {/* Campo para agregar nueva nota */}
          <View style={styles.nuevaNotaContainer}>
            <TextInput
              style={styles.inputNota}
              placeholder="Escribe una nota..."
              value={notasInfo.texto}
              onChangeText={(texto) => handleCambioNota(cotizacionId, texto)}
              multiline
            />
            <TouchableOpacity 
              style={styles.botonEnviarNota}
              onPress={() => enviarNota(cotizacionId, index)}
              disabled={enviandoNota}
            >
              {enviandoNota ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.textoBotonNota}>Enviar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔥 Menú de Navegación */}
      {menuVisible && <View style={styles.overlay} />}
      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnim }] }]}>
        <ScrollView>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaInicio')}>
            <Text style={styles.menuText}>🏠 Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaHistorialUsuario')}>
            <Text style={styles.menuText}>📜 Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaNegocios')}>
            <Text style={styles.menuText}>🔍 Buscar Negocios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaSoporteFAQ')}>
            <Text style={styles.menuText}>❓ Soporte</Text>
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
        <Text style={styles.tituloHeader}>Detalles de la Solicitud</Text>
      </View>

      {/* 📌 Cargando */}
      {cargando ? (
        <ActivityIndicator size="large" color="#FF0314" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {/* 🏷️ Estado de la Solicitud */}
          <Text style={[styles.estado, solicitud?.status === 'Pendiente' ? styles.pendiente : styles.completado]}>
            {solicitud?.status || 'Desconocido'}
          </Text>

          {/* 📌 Imagen del Servicio */}
          {solicitud?.images && (
            <Image 
              source={{ uri: solicitud.images }} 
              style={styles.imagenServicio} 
              resizeMode="cover"
            />
          )}

          {/* 🛠️ Información del Servicio */}
          <Text style={styles.servicio}>{solicitud?.services?.category || 'Servicio no especificado'}</Text>
          <Text style={styles.descripcion}>📝 {solicitud?.request_description || 'Sin descripción'}</Text>
          <Text style={styles.fecha}>📅 {solicitud?.service_date || 'Fecha no especificada'}</Text>
     
          {/* 📋 Cotizaciones */}
          <View style={styles.cotizacionesContainer}>
            <Text style={styles.cotizacionesTitulo}>Cotizaciones:</Text>
            {cotizaciones && cotizaciones.length > 0 ? (
              <FlatList
                data={cotizaciones}
                keyExtractor={(item, index) => `cotizacion-${index}`}
                renderItem={renderCotizacionItem}
                scrollEnabled={false}
                style={styles.cotizacionesList}
              />
            ) : (
              <Text style={styles.noCotizaciones}>No hay cotizaciones disponibles</Text>
            )}
          </View>

          {/* 👤 Información del Proveedor */}
          {solicitud?.providers?.profiles && (
            <View style={styles.cardProveedor}>
              {solicitud.providers.profiles.profile_pic_url && (
                <Image 
                  source={{ uri: solicitud.providers.profiles.profile_pic_url }} 
                  style={styles.imagenProveedor}
                />
              )}
              <View>
                <Text style={styles.nombreProveedor}>{solicitud.providers.profiles.name || 'Proveedor'}</Text>
                <Text style={styles.telefonoProveedor}>📞 {solicitud.providers.profiles.phone || 'Sin teléfono'}</Text>
              </View>
            </View>
          )}

          {/* 📞 Botón para Contactar */}
          <Animated.View style={{ transform: [{ scale: animacion }] }}>
            <TouchableOpacity 
              style={styles.botonContactar} 
              onPress={contactarProveedor}
              disabled={!solicitud?.providers?.profiles?.phone}
            >
              <Text style={styles.textoBoton}>📲 Contactar Proveedor</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* 🔙 Botón para Volver */}
          <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
            <Text style={styles.textoBotonVolver}>⬅️ Volver</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default PantallaDetalleSolicitud;