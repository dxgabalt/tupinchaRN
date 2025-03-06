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
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/stylesDetalleSolicitud';
import { Solicitud } from '../models/Solicitud';
import SolicitudService from '../services/SolicitudService';
import { Cotizacion } from '../models/Cotizacion';
import CotizacionService from '../services/CotizacionService';
import ContraOfertaService from '../services/ContraOfertaService';
import { ContraOferta } from '../models/ContraOferta';

// 📌 Pantalla Detalle de la Solicitud
const PantallaDetalleSolicitud = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { solicitudId } = route.params || {};

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [contraofertas, setContraofertas] = useState<ContraOferta[]>([]);
  const [cotizacionesNotas, setCotizacionesNotas] = useState({});
  const [contraofertaNotas, setContraofertaNotas] = useState({});
  const [cargando, setCargando] = useState(true);
  const [enviandoNota, setEnviandoNota] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(-300)).current;
    const [descripcion, setDescripcion] = useState("");
    const [costoManoObra, setCostoManoObra] = useState("");
    const [costoMateriales, setCostoMateriales] = useState("");
  const [request, setRequest] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

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
          setContraofertas(data.contraofertas);

          // Inicializar el estado de notas para cada cotización
          const notasIniciales = {};
          const notascontraofertaIniciales = {};
          data.cotizaciones.forEach((cotizacion, index) => {
          notasIniciales[cotizacion.id] = cotizacion?.cotizacion_notas
          });         
          data.contraofertas.forEach((contraoferta, index) => {
          notasIniciales[contraoferta.id] = contraoferta?.contraoferta_notas
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
  //
  const handleCambioNotaContraoferta = (contraofertaId:number, texto:string) => {
    setContraofertaNotas(prevState => ({
      ...prevState,
      [contraofertaId]: {
        ...prevState[contraofertaId],
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
  };  // 📌 Enviar nota a la cotización
  const enviarNotaContraOferta = async (contraofertaId:number) => {
    const nota = contraofertaNotas[contraofertaId]?.texto;
    if (!nota || nota.trim() === '') {
      Alert.alert('Nota vacía', 'Por favor escribe una nota antes de enviar.');
      return;
    }
    try {
      setEnviandoNota(true);
      // Aquí deberías agregar la lógica para enviar la nota al backend
      CotizacionService.agregarNotaCotizacion(contraofertaId, nota);
      // Actualizar el estado local
      setCotizacionesNotas(prevState => {
          const nuevasNotas = [...(prevState[contraofertaId]?.notas || [])];
          nuevasNotas.push({
            id: Date.now().toString(),
            texto: nota,
            fecha: new Date().toLocaleString()
          });
          
          return {
            ...prevState,
            [contraofertaId]: {
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
  /** 📌 Aceptar/Rechazar Solicitud */
  const manejarSolicitud = async (idSolicitud: number, estado: string) => {
    try {
      await SolicitudService.actualizarEstadoSolicitud(idSolicitud, estado);
      Alert.alert("Éxito", `Solicitud ${estado} con éxito`);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la solicitud.");
    }
  };
  const mostarModalCotizacion = (request_id: number) => {
    setRequest(request_id);
    setModalVisible(true);
  };
    /** 📌 Guardar Cotizacion */
    const handleGuardar = () => {
      ContraOfertaService.agregarContraOferta(
        request,
        costoManoObra,
        costoMateriales,
        descripcion
      );
      const nuevoItemContraOferta = {
        id: obtenerUltimoIdContraOferta(request)??0 + 1, // Incrementar el id de la cotización
        costo_mano_obra: costoManoObra, // Ejemplo de costo
        costo_materiales: costoMateriales, // Ejemplo de costo
        descripcion: descripcion, // Descripción
    };

      setModalVisible(false);
    };
    const obtenerUltimoIdContraOferta = (idSolicitud:number) => {
      // Encuentra la solicitud correspondiente
     if (solicitud && solicitud.contraofertas.length > 0) {
        // Obtener el último id de la cotización
        const ultimoId = solicitud.contraofertas[solicitud.contraofertas.length - 1].id;
        return ultimoId;
      } else {
        // Si no hay cotizaciones, devuelve null o cualquier valor predeterminado
        return null;
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
  // Renderizar un item de cotización
  const renderContraOfertaItem = ({ item, index }) => {
    const contraofertaId = item.id;
    const notasInfo = contraofertaNotas[contraofertaId] || { texto: '', notas: [] };
    const hayNotas = notasInfo.length > 0;
    const ultimaNota = hayNotas ? notasInfo[notasInfo.length - 1] : null;
    const notaProviderVacia = ultimaNota ? !ultimaNota.nota_provider.trim() : true;
    return (
      <View style={styles.cotizacionItem}>
        <Text style={styles.cotizacionTitulo}>ContraOferta #{index + 1}</Text>
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
          {hayNotas ? (
            notasInfo.notas.map((nota, i) => (
              <View key={`nota-${i}`} style={styles.notaItem}>
                <Text style={styles.notaTexto}>{nota.nota_client}</Text>
                <Text style={styles.notaProveedor}>{nota.nota_provider}</Text>
                <Text style={styles.notaFecha}>{nota.created_at}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.sinNotas}>No hay notas para esta contraoferta</Text>
          )}
  
          {/* Campo para agregar nueva nota */}
          {hayNotas && (
            <View style={styles.nuevaNotaContainer}>
              <TextInput
                style={styles.inputNota}
                placeholder="Escribe una nota..."
                value={notasInfo.texto}
                onChangeText={(texto) => handleCambioNotaContraoferta(contraofertaId, texto)}
                multiline
              />
              <TouchableOpacity
                style={styles.botonEnviarNota}
                onPress={() => enviarNotaContraOferta(contraofertaId)}
                disabled={notaProviderVacia || enviandoNota}
              >
                {enviandoNota ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.textoBotonNota}>Enviar</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
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
          {solicitud?.status !== "aceptada" && (
            <View style={styles.botonesContainer}>
              <TouchableOpacity
                style={styles.botonCotizar}
                onPress={() => mostarModalCotizacion(solicitud?.id)}
              >
                <Text style={styles.textoBoton}>
                  🛒📝 Enviar Contraoferta
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botonAceptar}
                onPress={() => manejarSolicitud(solicitud?.id, "aceptada")}
              >
                <Text style={styles.textoBoton}>✅ Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botonRechazar}
                onPress={() => manejarSolicitud(solicitud?.id, "rechazada")}
              >
                <Text style={styles.textoBoton}>❌ Rechazar</Text>
              </TouchableOpacity>
            </View>
          )}

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
           {/* 📋 Contraofertas */}
          <View style={styles.cotizacionesContainer}>
            <Text style={styles.cotizacionesTitulo}>Contraofertas:</Text>
            {contraofertas && contraofertas.length > 0 ? (
              <FlatList
                data={contraofertas}
                keyExtractor={(item, index) => `contraoferta-${index}`}
                renderItem={renderContraOfertaItem}
                scrollEnabled={false}
                style={styles.cotizacionesList}
              />
            ) : (
              <Text style={styles.noCotizaciones}>No hay contraofertas disponibles</Text>
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
       {/* 🔥 Modal de Cotización */}
       <Modal visible={modalVisible} animationType="slide" transparent>
       <View style={styles.modalContainer}>
         <View style={styles.modalContenido}>
           <Text style={styles.modalTitulo}>Ingresar Información</Text>
           <TextInput
             style={styles.input}
             placeholder="Descripción"
             value={descripcion}
             onChangeText={setDescripcion}
           />
           <TextInput
             style={styles.input}
             placeholder="Costo de Mano de Obra"
             keyboardType="numeric"
             value={costoManoObra}
             onChangeText={setCostoManoObra}
           />
           <TextInput
             style={styles.input}
             placeholder="Costo de Materiales"
             keyboardType="numeric"
             value={costoMateriales}
             onChangeText={setCostoMateriales}
           />
           <TouchableOpacity
             style={styles.botonGuardar}
             onPress={handleGuardar}
           >
             <Text style={styles.textoBoton}>Guardar Cotización</Text>
           </TouchableOpacity>
           <TouchableOpacity
             style={styles.botonCerrarModal}
             onPress={() => setModalVisible(false)}
           >
             <Text style={styles.textoBoton}>Cerrar</Text>
           </TouchableOpacity>
         </View>
       </View>
     </Modal>
    </View>
  );
};

export default PantallaDetalleSolicitud;