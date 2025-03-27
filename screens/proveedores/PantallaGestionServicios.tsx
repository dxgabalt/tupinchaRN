import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Animated,
  ActivityIndicator,
  FlatList,
  Platform,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import styles from "../../styles/stylesGestionServicios";
import { AuthService } from "../../services/AuthService";
import { ProviderServiceService } from "../../services/ProviderServiceService";
import { ImageService } from "../../services/ImageService";
import { PortafolioService } from "../../services/Portafolio";
import { ServiceService } from "../../services/ServiceService";
import { Picker } from "@react-native-picker/picker";
import { PlanService } from "../../services/PlanService";
import { Portafolio } from "../../models/Portafolio";
import { MunicipioService } from "../../services/MunicipoService";
import { ProvinciaService } from "../../services/ProvinciaService";
import { ProviderLocationsService } from "../../services/ProviderLocationService";

const PantallaGestionServicios = () => {
  const navigation = useNavigation();
  const [perfil, setPerfil] = useState<any>(null);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [portafolio, setPortafolio] = useState<string[]>([]);
  const [portafolios, setPortafolios] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const menuAnim = useRef(new Animated.Value(-300)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const [foto, setFoto] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [servicios, setServicios] = useState([]);
  const [servicio, setServicio] = useState(0);
  const [plan, setPlan] = useState(0);
  const [duracionPlan, setDuracionPlan] = useState(0);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState(0);  
  const [provinciaProfileSeleccionada, setProvinciaProfileSeleccionada] = useState(null);
  const [municipioProfileSeleccionado, setMunicipioProfileSeleccionado] = useState(0);
  const [diasFaltantes, setDiasFaltantes] = useState(0);
  const [mostrarMunicipios, setMostrarMunicipios] = useState(false); // Nuevo estado
  const [mostrarProfileMunicipios, setMostrarProfileMunicipios] = useState(false); // Nuevo estado
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleProfile, setModalVisibleProfile] = useState(false);
  const [nombreMunicipioSeleccionado, setNombreMunicipioSeleccionado] =
    useState(null);
  const [nombreProvinciaSeleccionada, setNombreProvinciaSeleccionada] =
    useState(null); 
     const [nombreMunicipioProfileSeleccionado, setNombreMunicipioProfileSeleccionado] =
    useState(null);
  const [nombreProvinciaProfileSeleccionada, setNombreProvinciaProfileSeleccionada] =
    useState(null);
    const [nuevaFoto, setNuevaFoto] = useState("");
    const [esGuardarPerfil, setEsGuardarPerfil] = useState(false);
  
  /** 🔥 Cargar Perfil */
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const perfilData = await AuthService.obtenerPerfil();
        setPerfil(perfilData);
        //Ubicacion
        setNombreProvinciaProfileSeleccionada(perfilData.provincias.nombre)
        setNombreMunicipioProfileSeleccionado(perfilData.municipios.name)
        setProvinciaProfileSeleccionada(perfilData.provincia_id)
        setMunicipioProfileSeleccionado(perfilData.municipio_id)
        const portafolios = perfilData?.portafolio;
        const ubicaciones = perfilData?.provider_locations;
        const duracion = perfilData?.provider?.planes?.duracion;
        setPortafolio(perfilData.portafolio || []);
        setPortafolios(portafolios);
        setUbicaciones(ubicaciones);
        setDuracionPlan(perfilData?.provider.planes.duracion)
        // Obtener la fecha de creación
        const createdAt = new Date(perfilData?.provider.created_at);
        // Obtener la fecha actual
        const fechaActual = new Date();
        // Calcular la diferencia en milisegundos
        const diffTime = fechaActual.getTime() - createdAt.getTime();
        // Convertir la diferencia a días (usando Math.floor para obtener días completos)
        const diasTranscurridos = Math.floor(diffTime / (1000 * 3600 * 24));
        setDiasFaltantes(diasTranscurridos);
        setPlan(perfilData?.provider?.planes?.id);
      } catch (error) {
        console.log("Error", error);
        Alert.alert("Error", "No se pudo cargar el perfil.");
      } finally {
        setCargando(false);
      }
    };
    cargarPerfil();
  }, []);
  const obtenerServicios = async () => {
    try {
      const servicios = await ServiceService.obtenerTodos();
      setServicios(
        servicios.map((servicio) => ({
          id: servicio.id,
          category: servicio.category,
          icono: servicio.icono,
          tags: servicio.tags,
        }))
      );
    } catch (error) {
      console.error("Error obteniendo servicios:", error);
    }
  };
  const cambiarFotoPerfil = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Se requiere acceso a la galería para cambiar la foto."
        );
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
  
      if (!result.canceled) {
        setNuevaFoto(result.assets[0].uri);
      }
    };
  useEffect(() => {
    optenerPlanes();
  }, []);
  const optenerPlanes = async () => {
    try {
      const planes = await PlanService.obtenerTodos();
      setPlanes(planes);
    } catch (error) {
      console.error("Error obteniendo servicios:", error);
    }
  };
  useEffect(() => {
    obtenerServicios();
  }, []);

  // Obtener las provincias
  useEffect(() => {
    const obtenerProvincias = async () => {
      try {
        const provincias = await ProvinciaService.obtenerTodos();
        setProvincias(provincias);
      } catch (error) {
        console.error("Error obteniendo provincias:", error);
      }
    };
    obtenerProvincias();
  }, []);

  // Obtener municipios cuando una provincia es seleccionada
  useEffect(() => {
    if (provinciaSeleccionada) {
      const obtenerMunicipios = async () => {
        try {
          const municipios = await MunicipioService.obtenerTodos({
            provincia_id: provinciaSeleccionada,
          });
          setMunicipios(municipios);
        } catch (error) {
          console.error("Error obteniendo municipios:", error);
        }
      };
      obtenerMunicipios();
    } else if(provinciaProfileSeleccionada){
      const obtenerMunicipiosProfile = async () => {
        try {
          const municipios = await MunicipioService.obtenerTodos({
            provincia_id: provinciaProfileSeleccionada,
          });
          setMunicipios(municipios);
        } catch (error) {
          console.error("Error obteniendo municipios:", error);
        }
      };
      obtenerMunicipiosProfile();
    }
  }, [provinciaSeleccionada,provinciaProfileSeleccionada]);
  /** 📌 Guardar Cambios en Perfil */
  const guardarPerfil = async () => {
    if (
      !perfil?.phone?.trim() ||
      !perfil?.provider?.speciality?.trim() ||
      !perfil?.provider?.availability?.trim() ||
      !perfil?.provider?.description?.trim() 
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      alert("Todos los campos son obligatorios.");
      return;
    }
    if(!validarUbicacion()){
      Alert.alert("Error", "Debe seleccionar una ubicación válida.");
      alert("Debe seleccionar una ubicación válida.");
      return;
    }
    try {
        let fotoURL = perfil.profile_pic_url;
            if (nuevaFoto) {
              setEsGuardarPerfil(true)
              const urlSubida = await AuthService.subirFotoPerfil(
                perfil.user_id,
                nuevaFoto
              );
              if (urlSubida) {
                fotoURL = urlSubida;
              }
            }
      const provider = {
        id: perfil.provider.id,
        profile_id: perfil.id,
        phone: perfil.phone,
        speciality: perfil?.provider?.speciality,
        availability: perfil?.provider?.availability,
        description: perfil?.provider?.description,
        plan_id: plan ==0 ? null: plan,
        profile_pic_url: fotoURL,
        municipio_id: municipioProfileSeleccionado,
        provincia_id: provinciaProfileSeleccionada
      };
      setEsGuardarPerfil(true)
      await ProviderServiceService.actualizarProveedor(provider);
      setEditando(false);
      setEsGuardarPerfil(false)

      Alert.alert("Éxito", "Perfil actualizado correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil.");
    }
  };
  const validarUbicacion = (): boolean => {
    if(ubicaciones.length>0){
      const existeMunicipio = ubicaciones.some(
        (ubicacion) => ubicacion.municipio_id === municipioProfileSeleccionado
      );
      return !existeMunicipio;
    }
    return true;
  }; 
   const validarUbicacionProvider = (): boolean => {
    if(ubicaciones.length>0){
      const existeMunicipio = ubicaciones.some(
        (ubicacion) => ubicacion.municipio_id === municipioSeleccionado
      );
      return !existeMunicipio;
    }
    return true;
  };
  /** 📌 Agregar Nuevo Servicio */
  const agregarServicio = async () => {
    if (!nuevaEspecialidad.trim() || !nuevaDescripcion.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    try {
      const url_imagen =
        (await ImageService.subirImagen("servicios", foto)) ?? "";
      await PortafolioService.agregarServicio(
        perfil.provider.id,
        nuevaEspecialidad,
        nuevaDescripcion,
        servicio,
        url_imagen
      );
      const nuevo_item = {
        id: obtenerUltimoIdPortafolio(1) + 1, // Obtener el último id de la solicitud
        especialidad: nuevaEspecialidad,
        provider_id: perfil.provider.id,
        descripcion: nuevaDescripcion,
        imagen: url_imagen,
      };
      portafolios.push(nuevo_item);
      Alert.alert("Éxito", "Servicio agregado correctamente.");
      setNuevaEspecialidad("");
      setNuevaDescripcion("");
      setFoto("");
      setPortafolio([...portafolio, url_imagen]);
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar el servicio.");
    }
  };
   /** 📌 Agregar Nueva Ubicacion*/
  const agregarUbicacion = async () => {
    if (!provinciaSeleccionada || !municipioSeleccionado) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      alert("Todos los campos son obligatorios.")
      return;
    }
    if(!validarUbicacionProvider()){
      Alert.alert("Error", "Seleccione un municipio diferente.");
      alert("Seleccione un municipio diferente.")
      return;
    }
    try {
      await ProviderLocationsService.crear({
        provider_id: perfil.provider.id,
        provincia_id: provinciaSeleccionada,
        municipio_id: municipioSeleccionado,
      });
      const nuevo_item = {
        id: obtenerUltimoIdUbicacion(1) + 1, // Obtener el último id de la solicitud
        municipios: {
          id: municipioSeleccionado,
          name: nombreMunicipioSeleccionado,
        },
        provincias: {
          id: provinciaSeleccionada,
          nombre: nombreProvinciaSeleccionada,
        },
        provider_id: perfil.provider.id,
        provincia_id: provinciaSeleccionada,
        municipio_id: municipioSeleccionado,
      };
      ubicaciones.push(nuevo_item);
      Alert.alert("Éxito", "Servicio agregado correctamente.");
      setProvinciaSeleccionada(null);
      setMunicipioSeleccionado(null);
      setNombreMunicipioSeleccionado("");
      setNombreProvinciaSeleccionada("");
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar el servicio.");
    }
  };
  const obtenerUltimoIdUbicacion = (idPortafolio: number) => {
    // Encuentra la solicitud correspondiente

    if (ubicaciones && ubicaciones.length > 0) {
      // Obtener el último id de la cotización
      const ultimoId = ubicaciones[ubicaciones.length - 1].id;
      return ultimoId;
    } else {
      // Si no hay cotizaciones, devuelve null o cualquier valor predeterminado
      return null;
    }
  };
  const obtenerUltimoIdPortafolio = (idPortafolio: number) => {
    // Encuentra la solicitud correspondiente

    if (portafolios && portafolios.length > 0) {
      // Obtener el último id de la cotización
      const ultimoId = portafolios[portafolios.length - 1].id;
      return ultimoId;
    } else {
      // Si no hay cotizaciones, devuelve null o cualquier valor predeterminado
      return null;
    }
  };
  /** 📌 Seleccionar Imagen */
  const seleccionarImagen = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso Denegado", "Se requiere acceso a la galería.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled && result.assets) {
        const foto = result.assets[0].uri;
        setFoto(foto);
        setPortafolio([...portafolio, foto]);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };

  const actualizarCampo = (campo: string, valor: string) => {
    setPerfil((prev) => ({
      ...prev,
      provider: { ...prev.provider, [campo]: valor },
    }));
  };

  /** 📌 Mostrar/Ocultar Menú */
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnim, {
      toValue: menuVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  /** 📌 Eliminar Servicio */
  const eliminarServicio = async (id: number) => {
    try {
      if (Platform.OS === "web") {
        const confirmation = window.confirm(
          "¿Estás seguro de que deseas eliminar este servicio?"
        );
        if (confirmation) {
          await PortafolioService.eliminar(id);
          const nuevosServicios = portafolios.filter((item) => item.id !== id);
          setPortafolios(nuevosServicios);
          const especialidades =
            nuevosServicios.map((item) => item.especialidad).join(", ") || "";
          setEspecialidad(especialidades);
          window.alert("Servicio eliminado correctamente.");
        }
      } else {
        // Confirmación antes de eliminar
        Alert.alert(
          "Confirmar eliminación",
          "¿Estás seguro de que deseas eliminar este servicio?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Eliminar",
              style: "destructive",
              onPress: async () => {
                await PortafolioService.eliminar(parseInt(id));

                // Actualizar el estado eliminando el servicio
                const nuevosServicios = portafolio.filter(
                  (item) => item.id !== id
                );
                setPortafolio(nuevosServicios);

                // Actualizar la lista de especialidades
                const nuevasEspecialidades = nuevosServicios
                  .map((item) => item.especialidad)
                  .join(", ");
                setEspecialidad(nuevasEspecialidades);

                Alert.alert("Éxito", "Servicio eliminado correctamente.");
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el servicio.");
    }
  };
  /** 📌 Eliminar Ubicacion */
  const eliminarUbicacion = async (id: number) => {
    try {
      if (Platform.OS === "web") {
        const confirmation = window.confirm(
          "¿Estás seguro de que deseas eliminar este servicio?"
        );
        if (confirmation) {
          await ProviderLocationsService.eliminar(id);
          const nuevasUbicaciones = ubicaciones.filter(
            (item) => item.id !== id
          );
          setUbicaciones(nuevasUbicaciones);

          window.alert("Servicio eliminado correctamente.");
        }
      } else {
        // Confirmación antes de eliminar
        Alert.alert(
          "Confirmar eliminación",
          "¿Estás seguro de que deseas eliminar este servicio?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Eliminar",
              style: "destructive",
              onPress: async () => {
                await ProviderLocationsService.eliminar(parseInt(id));
                // Actualizar el estado eliminando el servicio
                const nuevasUbicaciones = ubicaciones.filter(
                  (item) => item.id !== id
                );
                setUbicaciones(nuevasUbicaciones);
                Alert.alert("Éxito", "Ubicacion eliminado correctamente.");
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el servicio.");
    }
  };

  /** 📌 Renderizar Item del Portafolio */
  const renderPortfolioItem = ({ item }: { item: Portafolio }) => (
    <View style={styles.portfolioItem}>
      <View style={styles.portfolioContent}>
        {item.imagen ? (
          <Image
            source={{ uri: item.imagen }}
            style={styles.portfolioImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.portfolioImage, styles.noImage]}>
            <Text style={styles.noImageText}>Sin imagen</Text>
          </View>
        )}
        <View style={styles.portfolioInfo}>
          <Text style={styles.portfolioTitle}>{item.especialidad}</Text>
          <Text style={styles.portfolioDescription}>{item.descripcion}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => eliminarServicio(item.id)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
  /** 📌 Renderizar Item de Ubicaciones */
  const renderUbicacionItem = ({ item }: { item: any }) => (
    <View style={styles.portfolioItem}>
      <View style={styles.portfolioContent}>
        <View style={styles.portfolioInfo}>
          <Text style={styles.portfolioTitle}>{item.provincias.nombre}</Text>
          <Text style={styles.portfolioDescription}>
            {item.municipios.name}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => eliminarUbicacion(item.id)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      {/* 🔥 Menú Lateral */}
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
            onPress={() => navigation.navigate("GestionSolicitudes")}
          >
            <Text style={styles.menuText}>📋 Ver Solicitudes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("PantallaNotificacion")}
          >
            <Text style={styles.menuText}>🔔 Notificaciones</Text>
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
        <Text style={styles.titulo}>👨‍🔧 Gestión de Servicios</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        {cargando ? (
          <ActivityIndicator
            size="large"
            color="#FF0314"
            style={{ marginTop: 20 }}
          />
        ) : (
          <>
            {/* 📌 Campos del Perfil */}
            <View style={{ alignItems: 'center', marginVertical: 15 }}>
            <Image
              source={{ uri: nuevaFoto || perfil?.profile_pic_url || 'https://via.placeholder.com/150' }} // URL de placeholder por si no hay imagen
              style={styles.fotoPerfil}
            />
            {editando && (
              <TouchableOpacity 
                style={styles.botonFoto} 
                onPress={cambiarFotoPerfil}
              >
                <Text style={[styles.textoBoton, { color: '#FF0314' }]}>📷 Cambiar Foto</Text>
              </TouchableOpacity>
            )}
          </View>
            <Text style={styles.label}>📞 Teléfono:</Text>
            <TextInput
              style={styles.input}
              value={perfil?.phone}
              editable={editando}
              onChangeText={(text) => setPerfil({ ...perfil, phone: text })}
            />

            <Text style={styles.label}>🛠 Especialidad:</Text>
            <TextInput
              style={styles.input}
              value={perfil?.provider?.speciality || ''} // Asegúrate de que el valor no sea undefined
              editable={editando}
              onChangeText={(text) => actualizarCampo("speciality", text)} // Usa la función actualizarCampo
            />

            <Text style={styles.label}>📅 Disponibilidad:</Text>
            <TextInput
              style={styles.input}
              value={perfil?.provider?.availability}
              editable={editando}
              onChangeText={(text) => actualizarCampo("availability", text)}
            />            
            <Text style={styles.label}>📝 Descripcion:</Text>
            <TextInput
              style={styles.input}
              value={perfil?.provider?.description}
              editable={editando}
              multiline
              onChangeText={(text) => actualizarCampo("description", text)}
            />
             {/* 🌍 Botón para seleccionar ubicación */}
             <TouchableOpacity
             style={styles.botonFiltro}
             disabled={!editando}
             onPress={() => setModalVisibleProfile(true)}
           >
             <Text style={styles.textoBoton}>
               {provinciaProfileSeleccionada
                 ? `${nombreProvinciaProfileSeleccionada} - ${
                     nombreMunicipioProfileSeleccionado || "Selecciona municipio"
                   }`
                 : "Seleccionar Ubicación"}
             </Text>
           </TouchableOpacity>
            {diasFaltantes -  perfil?.provider?.planes?.duracion == 1 && (
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Plan {plan}</Text>
                <Picker
                  style={styles.input}
                  selectedValue={plan}
                  onValueChange={(itemValue) => setPlan(itemValue)}
                >
                  {planes.map((plan) => (
                    <Picker.Item
                      key={plan.id}
                      label={plan.nombre}
                      value={plan.id}
                    />
                  ))}
                </Picker>
              </View>
            )}

            {editando ? (
              <TouchableOpacity
                style={styles.botonGuardar}
                onPress={guardarPerfil}
                disabled={esGuardarPerfil}
              >
                <Text style={styles.textoBoton}>💾 Guardar Cambios</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.botonEditar}
                onPress={() => setEditando(true)}
              >
                <Text style={styles.textoBoton}>✏️ Editar Perfil</Text>
              </TouchableOpacity>
            )}

            {/* 📌 Agregar Nuevo Servicio */}
            <Text style={styles.sectionTitle}>📁 Mi Portafolio</Text>
            <Text style={styles.label}>➕ Nueva Especialidad</Text>
            <TextInput
              style={styles.input}
              placeholder="Ejemplo: Electricidad"
              value={nuevaEspecialidad}
              onChangeText={setNuevaEspecialidad}
            />
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Categoria</Text>
              <Picker
                style={styles.input}
                selectedValue={servicio}
                onValueChange={(itemValue) => setServicio(itemValue)}
              >
                {servicios.map((servicio_data) => (
                  <Picker.Item
                    key={servicio_data.id}
                    label={servicio_data.category}
                    value={servicio_data.id}
                  />
                ))}
              </Picker>
            </View>
            <Text style={styles.label}>📝 Descripción</Text>
            <TextInput
              style={styles.input}
              placeholder="Ejemplo: Instalaciones y mantenimiento."
              value={nuevaDescripcion}
              onChangeText={setNuevaDescripcion}
              multiline
            />
            {/* 📌 Portafolio */}
            <TouchableOpacity
              style={styles.botonSubir}
              onPress={seleccionarImagen}
            >
              <Text style={styles.textoBoton}>📷 Subir Imagen</Text>
            </TouchableOpacity>
            {/* 🔥 Previsualización de Imagen */}
            {foto ? (
              <View style={{ position: "relative", width: 200, height: 200 }}>
                <Image
                  source={{ uri: foto }}
                  style={{ width: 200, height: 200, borderRadius: 10 }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => setFoto("")}
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    backgroundColor: "red",
                    padding: 5,
                    borderRadius: 50,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <TouchableOpacity
            style={styles.botonAgregar}
            onPress={agregarServicio}
          >
            <Text style={styles.textoBoton}>✅ Agregar Servicio</Text>
          </TouchableOpacity>
            {/* 📌 Lista de Portafolio */}
            {portafolios.length > 0 ? (
              <FlatList
                data={portafolios}
                renderItem={renderPortfolioItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyMessage}>
                No hay servicios en tu portafolio. Agrega uno nuevo.
              </Text>
            )}
            {/* 📌 Lista de Ubicaciones */}
            <Text style={styles.sectionTitle}>Ubicaciones</Text>
            {/* 🌍 Botón para seleccionar ubicación */}
            <TouchableOpacity
              style={styles.botonFiltro}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.textoBoton}>
                {provinciaSeleccionada
                  ? `${nombreProvinciaSeleccionada} - ${
                      nombreMunicipioSeleccionado || "Selecciona municipio"
                    }`
                  : "Seleccionar Ubicación"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botonAgregar}
              onPress={agregarUbicacion}
            >
              <Text style={styles.textoBoton}>✅ Agregar Ubicacion</Text>
            </TouchableOpacity>

            {ubicaciones.length > 0 ? (
              <FlatList
                data={ubicaciones}
                renderItem={renderUbicacionItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyMessage}>
                No hay servicios en tu portafolio. Agrega uno nuevo.
              </Text>
            )}
          </>
        )}
      </ScrollView>
      <Modal visible={modalVisibleProfile} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>
            {!mostrarProfileMunicipios ? (
              <>
                <Text style={styles.modalTitulo}>Selecciona una Provincia</Text>
                <ScrollView style={styles.scrollView}>
                  {provincias.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.opcion,
                        provinciaSeleccionada === item.id &&
                          styles.opcionActiva,
                      ]}
                      onPress={() => {
                       setProvinciaProfileSeleccionada(item.id);
                        setNombreProvinciaProfileSeleccionada(item.nombre);
                        setMunicipioProfileSeleccionado(null);
                        setMunicipios([]);
                        setMostrarProfileMunicipios(true); // Cambia a mostrar municipios
                      }}
                    >
                      <Text style={styles.textoOpcion}>{item.nombre}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setMostrarProfileMunicipios(false)}
                  style={styles.botonVolver}
                >
                  <Text style={styles.textoBoton}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitulo}>Selecciona un Municipio</Text>
                <FlatList
                  data={municipios}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.opcion,
                        municipioProfileSeleccionado === item.id &&
                          styles.opcionActiva,
                      ]}
                      onPress={() => {
                        setMunicipioProfileSeleccionado(item.id);
                        setNombreMunicipioProfileSeleccionado(item.name);
                        setModalVisibleProfile(false);
                      }}
                    >
                      <Text style={styles.textoOpcion}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}

            <TouchableOpacity
              style={styles.botonCerrar}
              onPress={() => setModalVisibleProfile(false)}
            >
              <Text style={styles.textoBoton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>   
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>
            {!mostrarMunicipios ? (
              <>
                <Text style={styles.modalTitulo}>Selecciona una Provincia</Text>
                <ScrollView style={styles.scrollView}>
                  {provincias.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.opcion,
                        provinciaSeleccionada === item.id &&
                          styles.opcionActiva,
                      ]}
                      onPress={() => {
                        setProvinciaSeleccionada(item.id);
                        setNombreProvinciaSeleccionada(item.nombre);
                        setMunicipioSeleccionado(null);
                        setMunicipios([]);
                        setMostrarMunicipios(true); // Cambia a mostrar municipios
                      }}
                    >
                      <Text style={styles.textoOpcion}>{item.nombre}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setMostrarMunicipios(false)}
                  style={styles.botonVolver}
                >
                  <Text style={styles.textoBoton}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitulo}>Selecciona un Municipio</Text>
                <FlatList
                  data={municipios}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.opcion,
                        municipioSeleccionado === item.id &&
                          styles.opcionActiva,
                      ]}
                      onPress={() => {
                        setMunicipioSeleccionado(item.id);
                        setNombreMunicipioSeleccionado(item.name);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.textoOpcion}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}

            <TouchableOpacity
              style={styles.botonCerrar}
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

export default PantallaGestionServicios;
