import React, { useEffect, useState, useRef } from "react";
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
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "../styles/stylesDetalleSolicitud";
import { Solicitud } from "../models/Solicitud";
import SolicitudService from "../services/SolicitudService";
import { Cotizacion } from "../models/Cotizacion";
import CotizacionService from "../services/CotizacionService";
import ContraOfertaService from "../services/ContraOfertaService";
import { ContraOferta } from "../models/ContraOferta";
import { RequestNota } from "../models/RequestNota";

// 📌 Pantalla Detalle de la Solicitud
const PantallaDetalleSolicitud = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { solicitudId } = route.params || {};

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [notasSolicitud, setNotasSolicitud] = useState<RequestNota[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [contraofertas, setContraofertas] = useState<ContraOferta[]>([]);
  const [cotizacionesNotas, setCotizacionesNotas] = useState({});
  const [cotizacionNota,setCotizacionNota] = useState("")
  const [contraofertaNotas, setContraofertaNotas] = useState({});
  const [requestNotas, setRequestNotas] = useState({});
  const [cargando, setCargando] = useState(true);
  const [enviandoNota, setEnviandoNota] = useState(false);
  const [enviandoNotaSolicitud, setEnviandoNotaSolicitud] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(-300)).current;
  const [descripcion, setDescripcion] = useState("");
  const [costoManoObra, setCostoManoObra] = useState("");
  const [costoMateriales, setCostoMateriales] = useState("");
  const [request, setRequest] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCalificacionVisible, setModalCalificacionVisible] = useState(false);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  // 📌 Animación para el botón de contacto
  const animacion = useRef(new Animated.Value(1)).current;

  const animarBoton = () => {
    Animated.sequence([
      Animated.timing(animacion, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animacion, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
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
          setNotasSolicitud(data.request_notas);
        } else {
          console.log(
            "No se encontraron cotizaciones o no es un array:",
            data?.cotizaciones
          );
          setCotizaciones([]);
        }
      } catch (error) {
        console.error("Error obteniendo la solicitud:", error);
        Alert.alert(
          "Error",
          "No se pudo obtener la información de la solicitud."
        );
      } finally {
        setCargando(false);
      }
    };

    if (solicitudId) {
      obtenerSolicitud();
    } else {
      console.error("No se proporcionó un ID de solicitud");
      Alert.alert("Error", "Identificador de solicitud no válido.");
      setCargando(false);
    }
  }, [solicitudId]);
  const guardarCalificacion = async (idSolicitud:number) => {
    if (calificacion === 0) {
      Alert.alert("Error", "Por favor, selecciona una calificación.");
      return;
    }
  
    try {
      // Aquí deberías agregar la lógica para enviar la calificación al backend
      // Por ejemplo:
      await SolicitudService.guardarCalificacion(idSolicitud, calificacion, comentario);
      await SolicitudService.actualizarEstadoSolicitud(idSolicitud, "Completado");
      //actualzar status de solicitud
      setSolicitud((prevSolicitud) => {
        return {
          ...prevSolicitud,
          status: "Completado",
        };
      });
      Alert.alert("Éxito", "Calificación guardada correctamente.");
      setModalCalificacionVisible(false);
      setCalificacion(0);
      setComentario("");
    } catch (error) {
      console.error("Error guardando la calificación:", error);
      Alert.alert("Error", "No se pudo guardar la calificación. Intenta nuevamente.");
    }
  };
  // 📌 Función para contactar al proveedor
  const contactarProveedor = () => {
    animarBoton();
        const mensaje = "Hola, deseeo informaccion acerca de servicio de: "+solicitud?.providers?.description;
    abrirWhatsApp(solicitud?.providers?.profiles?.phone??"", mensaje??" ");
  };
const abrirWhatsApp = (phone:string,mensaje:string) => {
    Linking.openURL(`https://wa.me/${phone}?text=${mensaje}`);
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
  const handleCambioNota = (cotizacionId: number, texto: string) => {
    setCotizacionesNotas((prevState) => ({
      ...prevState,
      [cotizacionId]: {
        ...prevState[cotizacionId],
        texto,
      },
    }));
  };

  //
  const handleResponderNotaSolicitud = (
    notasolicitudId: number,
    texto: string
  ) => {
    setRequestNotas((prevState) => ({
      ...prevState,
      [notasolicitudId]: {
        ...prevState[notasolicitudId],
        texto,
      },
    }));
  };
  const handleCambioNotaContraoferta = (
    contraofertaId: number,
    texto: string
  ) => {
    setContraofertaNotas((prevState) => ({
      ...prevState,
      [contraofertaId]: {
        ...prevState[contraofertaId],
        texto,
      },
    }));    
  };

  // 📌 Enviar nota a la cotización
  const enviarNota = async (cotizacionId: number) => {
    const nota = cotizacionNota;
    if (!nota || nota.trim() === "") {
      Alert.alert("Nota vacía", "Por favor escribe una nota antes de enviar.");
      return;
    }
    try {
      setEnviandoNota(true);
      // Aquí deberías agregar la lógica para enviar la nota al backend
      CotizacionService.agregarNotaCotizacion(cotizacionId, nota);
      // Actualizar el estado local
      const nuevoItemNotaCotizacion = {
        id: obtenerUltimoIdNotaCotizacion,
        nota_client: nota,
        nota_provider: "",
        created_at: new Date().toLocaleString(),
      };
      setCotizaciones((prevSolicitudes) =>
        prevSolicitudes.map((cotizacion) =>
          cotizacion.id === cotizacionId
            ? {
                ...cotizacion,
                cotizacion_notas: [
                  ...(cotizacion.cotizacion_notas || []),
                  nuevoItemNotaCotizacion,
                ],
              }
            : cotizacion
        )
      );
      setCotizacionNota("")
      Keyboard.dismiss();
      setEnviandoNota(false);
      Alert.alert("Éxito", "Nota enviada correctamente.");
    } catch (error) {
      console.error("Error enviando nota:", error);
      Alert.alert("Error", "No se pudo enviar la nota. Intenta nuevamente.");
      setEnviandoNota(false);
    }
  };
  const obtenerUltimoIdNotaCotizacion = (notaCotizacionId: number) => {
    const notaCotizacion = cotizacionesNotas.find(
      (nota_cotizacion) => nota_cotizacion.id === notaCotizacionId
    );

    // Encuentra la solicitud correspondiente
    if (notaCotizacion && cotizacionesNotas.length > 0) {
      // Obtener el último id de la cotización
      const ultimoId = cotizacionesNotas[cotizacionesNotas.length - 1].id;
      return ultimoId;
    } else {
      // Si no hay cotizaciones, devuelve null o cualquier valor predeterminado
      return null;
    }
  };
  const enviarNotaSolicitud = async (requestNotasId: number) => {
    const nota = requestNotas[requestNotasId] || { texto: "", notas: [] };
    if (!nota.texto || nota.texto.trim() === "") {
      Alert.alert("Nota vacía", "Por favor escribe una nota antes de enviar.");
      return;
    }
    try {
      setEnviandoNota(true);
      // Aquí deberías agregar la lógica para enviar la nota al backend
      await SolicitudService.agregarNotaCotizacion(requestNotasId, nota.texto);
      // Actualizar el estado local
      const index = notasSolicitud.findIndex(
        (obj) => obj.id === requestNotasId
      );
      if (index !== -1) {
        notasSolicitud[index].nota_client = nota.texto;
      }
      requestNotas[requestNotasId] = { texto: " " };
      Keyboard.dismiss();
      setEnviandoNota(false);
      Alert.alert("Éxito", "Nota enviada correctamente.");
    } catch (error) {
      console.error("Error enviando nota:", error);
      Alert.alert("Error", "No se pudo enviar la nota. Intenta nuevamente.");
      setEnviandoNota(false);
    }
  };
  // 📌 Enviar nota a la contraoferta
  const enviarNotaContraOferta = async (notaContraofertaId: number) => {
    const nota = contraofertaNotas[notaContraofertaId]?.texto;
    if (!nota || nota.trim() === "") {
      Alert.alert("Nota vacía", "Por favor escribe una nota antes de enviar.");
      return;
    }

    try {
      //setEnviandoNota(true);
      // Aquí deberías agregar la lógica para enviar la nota al backend
      await ContraOfertaService.agregarNotaContraOferta(
        notaContraofertaId,
        nota
      );

      // Actualizar el estado local
      setContraofertas((prevState) =>
        prevState.map((contraoferta) => {
          // Actualizar las notas específicas dentro de la contraoferta
          const updatedNotas = contraoferta.contraoferta_notas.map(
            (nota_data) => {
              if (nota_data.id === notaContraofertaId) {
                // Actualizar el campo `nota_client` con la nueva respuesta
                return {
                  ...nota_data,
                  nota_client: nota, // Actualiza el campo `nota_client`
                };
              }
              return nota_data;
            }
          );

          return {
            ...contraoferta,
            contraoferta_notas: updatedNotas, // Actualiza el arreglo de contraoferta_notas
          };
        })
      );
      contraofertaNotas[notaContraofertaId] = { texto: " " };
      Keyboard.dismiss();
      setEnviandoNota(false);
      Alert.alert("Éxito", "Nota enviada correctamente.");
    } catch (error) {
      console.error("Error enviando nota:", error);
      Alert.alert("Error", "No se pudo enviar la nota. Intenta nuevamente.");
      setEnviandoNota(false);
    }
  };

  /** 📌 Aceptar/Rechazar Solicitud */
  const manejarSolicitud = async (idSolicitud: number, estado: string) => {
    try {
     
      Alert.alert("Éxito", `Solicitud ${estado} con éxito`);
      if(estado == 'Completado'){
        setModalCalificacionVisible(true);
      }else{
        await SolicitudService.actualizarEstadoSolicitud(idSolicitud, estado);
        //actualzar status de solicitud
        setSolicitud((prevSolicitud) => {
          return {
            ...prevSolicitud,
            status: estado,
          };
        });
      }
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
      id: obtenerUltimoIdContraOferta(request) ?? 0 + 1, // Incrementar el id de la cotización
      costo_mano_obra: costoManoObra, // Ejemplo de costo
      costo_materiales: costoMateriales, // Ejemplo de costo
      descripcion: descripcion, // Descripción
    };

    setModalVisible(false);
  };
  const obtenerUltimoIdContraOferta = (idSolicitud: number) => {
    // Encuentra la solicitud correspondiente
    if (solicitud && solicitud.contraofertas.length > 0) {
      // Obtener el último id de la cotización
      const ultimoId =
        solicitud.contraofertas[solicitud.contraofertas.length - 1].id;
      return ultimoId;
    } else {
      // Si no hay cotizaciones, devuelve null o cualquier valor predeterminado
      return null;
    }
  };
  const renderNotaSolicitudItem = ({ item, index }) => {
    const hayNotas = item.nota_client === null &&(solicitud?.status === "aceptada" || solicitud?.status === "aceptada por proveedor" || solicitud?.status === "Pendiente");
    const notasInfo = requestNotas[item.id] || { texto: "", notas: [] };
    return (
      <View style={styles.notasContainer}>
        <Text style={styles.notasTitulo}>Nota #{index + 1}</Text>
        <Text style={styles.notaProveedor}>{item.nota_provider}</Text>
        <Text style={styles.notaTexto}>{item.nota_client}</Text>
        <Text style={styles.notaFecha}>{item.created_at}</Text>
        {/* Campo para agregar nueva nota */}
        {hayNotas && (
          <View style={styles.nuevaNotaContainer}>
            <TextInput
              style={styles.inputNota}
              placeholder="Escribe una nota..."
              value={notasInfo.texto}
              onChangeText={(texto) =>
                handleResponderNotaSolicitud(item.id, texto)
              }
              multiline
            />
            <TouchableOpacity
              style={styles.botonEnviarNota}
              onPress={() => enviarNotaSolicitud(item.id)}
              disabled={enviandoNotaSolicitud}
            >
              {enviandoNotaSolicitud ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.textoBotonNota}>Enviar</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  // Renderizar un item de cotización
  const renderCotizacionItem = ({ item, index }) => {
    const cotizacionId = item.id;
    const notasInfo = cotizacionesNotas[cotizacionId] || {
      texto: "",
      notas: [],
    };
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
            $
            {parseFloat(item.costo_mano_obra || 0) +
              parseFloat(item.costo_materiales || 0)}
          </Text>
        </View>
        <Text style={styles.cotizacionDescripcion}>{item.descripcion}</Text>

        {/* Sección de Notas */}
        <View style={styles.notasContainer}>
          <Text style={styles.notasTitulo}>Notas:</Text>

          {/* Lista de notas existentes */}
          {item.cotizacion_notas.length > 0 ? (
            item.cotizacion_notas.map((nota, i) => (
              <View key={`nota-${i}`} style={styles.notaItem}>
                <Text style={styles.notaTexto}>{nota.nota_client}</Text>
                <Text style={styles.notaProveedor}>{nota.nota_provider}</Text>
                <Text style={styles.notaFecha}>{nota.created_at}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.sinNotas}>
              No hay notas para esta cotización
            </Text>
          )}

          {/* Campo para agregar nueva nota */}
{(solicitud?.status === "aceptada" || solicitud?.status === "aceptada por proveedor" || solicitud?.status === "Pendiente") && (
  <View style={styles.nuevaNotaContainer}>
    <TextInput
      style={styles.inputNota}
      placeholder="Escribe una nota..."
      value={cotizacionNota}
      onChangeText={(texto) =>setCotizacionNota(texto)}
      multiline
    />
    <TouchableOpacity
      style={styles.botonEnviarNota}
      onPress={() => enviarNota(cotizacionId)}
      disabled={enviandoNota}
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
  // Renderizar un item de contraoferta
  const renderContraOfertaItem = ({ item, index }) => {
    const contraofertaId = item.id;
    const hayNotas = item.contraoferta_notas.length > 0 ;
  
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
            $
            {parseFloat(item.costo_mano_obra || 0) +
              parseFloat(item.costo_materiales || 0)}
          </Text>
        </View>
        <Text style={styles.cotizacionDescripcion}>{item.descripcion}</Text>
  
        {/* Sección de Notas */}
        <View style={styles.notasContainer}>
          <Text style={styles.notasTitulo}>Notas:</Text>
  
          {/* Lista de notas existentes */}
          {hayNotas ? (
            item.contraoferta_notas.map((nota, i) => {
              const notasInfo = contraofertaNotas[nota.id] || { texto: "", notas: [] };
  
              return (
                <View key={`nota-${i}`} style={styles.notaItem}>
                  <Text style={styles.notaTexto}>{nota.nota_client}</Text>
                  <Text style={styles.notaProveedor}>{nota.nota_provider}</Text>
                  <Text style={styles.notaFecha}>{nota.created_at}</Text>
  
                  {/* Campo para agregar nueva nota */}
                  {nota.nota_client === null &&(solicitud?.status === "aceptada" || solicitud?.status === "aceptada por proveedor" || solicitud?.status === "Pendiente") && (
                    <View style={styles.nuevaNotaContainer}>
                    <TextInput
                      style={styles.inputNota}
                      placeholder="Escribe una nota..."
                      value={notasInfo.texto}
                      onChangeText={(texto) =>
                        handleCambioNotaContraoferta(nota.id, texto)
                      }
                      multiline
                    />
                    <TouchableOpacity
                      style={styles.botonEnviarNota}
                      onPress={() => enviarNotaContraOferta(nota.id)}
                      disabled={enviandoNota}
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
              );
            })
          ) : (
            <Text style={styles.sinNotas}>
              No hay notas para esta contraoferta
            </Text>
          )}
        </View>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      {/* 🔥 Menú de Navegación */}
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
            onPress={() => navigation.navigate("PantallaInicio")}
          >
            <Text style={styles.menuText}>🏠 Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("PantallaHistorialUsuario")}
          >
            <Text style={styles.menuText}>📜 Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("PantallaNegocios")}
          >
            <Text style={styles.menuText}>🔍 Buscar Negocios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("PantallaSoporteFAQ")}
          >
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
        <ActivityIndicator
          size="large"
          color="#FF0314"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {/* 🏷️ Estado de la Solicitud */}
          <Text
            style={[
              styles.estado,
              solicitud?.status === "Pendiente" && styles.pendiente,
              solicitud?.status === "Rechazada" && styles.rechazada,
              solicitud?.status !== "Pendiente" && solicitud?.status !== "Rechazada" && styles.completado
            ]}
          >
            {solicitud?.status || "Desconocido"}
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
          <Text style={styles.servicio}>
            {solicitud?.services?.category || "Servicio no especificado"}
          </Text>
          <Text style={styles.descripcion}>
            📝 {solicitud?.request_description || "Sin descripción"}
          </Text>
          <Text style={styles.fecha}>
            📅 {solicitud?.service_date || "Fecha no especificada"}
          </Text>
          {(solicitud?.status === "aceptada" || solicitud?.status === "aceptada por proveedor" || solicitud?.status === "Pendiente") && (
            <View style={styles.botonesContainer}>
            {(solicitud?.status ==="aceptada" || solicitud?.status ==="aceptada por proveedor") &&(
              <TouchableOpacity
                style={styles.botonCotizar}
                onPress={() => mostarModalCotizacion(solicitud?.id)}
              >
                <Text style={styles.textoBoton}>🛒📝 Enviar Contraoferta</Text>
              </TouchableOpacity>
            )}
              {solicitud?.status ==="Pendiente"&&(
                <TouchableOpacity
                style={styles.botonAceptar}
                onPress={() => manejarSolicitud(solicitud?.id, "aceptada")}
              >
                <Text style={styles.textoBoton}>✅ Aceptar</Text>
              </TouchableOpacity>  
              )}
            
              {(solicitud?.status ==="aceptada" || solicitud?.status ==="aceptada por proveedor") &&(
                  <TouchableOpacity
                    style={styles.botonAceptar}
                    onPress={() => manejarSolicitud(solicitud?.id, "Completado")}
                  >
                    <Text style={styles.textoBoton}>✅ Confirmar</Text>
                  </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.botonRechazar}
                onPress={() => manejarSolicitud(solicitud?.id, "Rechazada")}
              >
                <Text style={styles.textoBoton}>❌ Rechazar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 📋 Notas */}
          <View style={styles.cotizacionesContainer}>
            <Text style={styles.cotizacionesTitulo}>Notas:</Text>
            {notasSolicitud && notasSolicitud.length > 0 ? (
              <FlatList
                data={notasSolicitud}
                keyExtractor={(item, index) => `nota-${index}`}
                renderItem={renderNotaSolicitudItem}
                scrollEnabled={false}
                style={styles.cotizacionesList}
              />
            ) : (
              <Text style={styles.noCotizaciones}>
                No hay notas disponibles
              </Text>
            )}
          </View>
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
              <Text style={styles.noCotizaciones}>
                No hay cotizaciones disponibles
              </Text>
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
              <Text style={styles.noCotizaciones}>
                No hay contraofertas disponibles
              </Text>
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
                <Text style={styles.nombreProveedor}>
                  {solicitud.providers.profiles.name || "Proveedor"}
                </Text>
              </View>
            </View>
          )}

          {/* 📞 Botón para Contactar */}
          {solicitud?.providers?.is_premium && (
            <Animated.View style={{ transform: [{ scale: animacion }] }}>
              <TouchableOpacity
                style={styles.botonContactar}
                onPress={contactarProveedor}
                disabled={!solicitud?.providers?.profiles?.phone}
              >
                <Text style={styles.textoBoton}>📲 Contactar Proveedor</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* 🔙 Botón para Volver */}
          <TouchableOpacity
            style={styles.botonVolver}
            onPress={() => navigation.goBack()}
          >
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
      <Modal visible={modalCalificacionVisible} animationType="slide" transparent>
  <View style={styles.modalContainer}>
    <View style={styles.modalContenido}>
      <Text style={styles.modalTitulo}>Calificar Servicio</Text>
      
      {/* Selector de calificación */}
      <View style={styles.calificacionContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setCalificacion(star)}>
            <Text style={styles.estrella}>{calificacion >= star ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Campo de comentario */}
      <TextInput
        style={styles.input}
        placeholder="Escribe un comentario..."
        value={comentario}
        onChangeText={setComentario}
        multiline
      />

      {/* Botones */}
      <TouchableOpacity
        style={styles.botonGuardar}
        onPress={() => {
          // Lógica para guardar la calificación
          guardarCalificacion(solicitud?.id??0);
        }}
      >
        <Text style={styles.textoBoton}>Guardar Calificación</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.botonCerrarModal}
        onPress={() => setModalCalificacionVisible(false)}
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
