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

const PantallaGestionServicios = () => {
  const navigation = useNavigation();
  const [perfil, setPerfil] = useState<any>(null);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [portafolio, setPortafolio] = useState<string[]>([]);
  const [portafolios, setPortafolios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const menuAnim = useRef(new Animated.Value(-300)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const [foto, setFoto] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [servicios, setServicios] = useState([]);
  const [servicio, setServicio] = useState(0);
  const [plan, setPlan] = useState(0);
  const [planes, setPlanes] = useState<Plan[]>([]);
  /** 🔥 Cargar Perfil */
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const perfilData = await AuthService.obtenerPerfil();
        setPerfil(perfilData);
        const especialidades =
          perfilData?.portafolio?.map((item) => item.especialidad).join(", ") ||
          "";
        const portafolios = perfilData?.portafolio;
        setEspecialidad(especialidades);
        setPortafolio(perfilData.portafolio || []);
        setPortafolios(portafolios);
        setPlan(perfilData?.provider?.planes?.id)
      } catch (error) {
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
      setServicios(servicios.map(servicio => ({
        id: servicio.id,
        category: servicio.category,
        icono: servicio.icono,
        tags: servicio.tags,
      })));
    } catch (error) {
      console.error("Error obteniendo servicios:", error);
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
  /** 📌 Guardar Cambios en Perfil */
  const guardarPerfil = async () => {
    if (
      !perfil?.phone?.trim() ||
      !perfil?.provider?.speciality?.trim() ||
      !perfil?.provider?.availability?.trim()
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    try {
      const provider = {
        id: perfil.provider.id,
        phone: perfil.phone,
        speciality: perfil?.provider?.speciality,
        availability: perfil?.provider?.availability,
        plan_id: plan,
      };
      await ProviderServiceService.actualizarProveedor(provider);
      Alert.alert("Éxito", "Perfil actualizado correctamente.");
      setEditando(false);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil.");
    }
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
      const nuevo_item ={
        id: obtenerUltimoIdPortafolio(1) + 1,  // Obtener el último id de la solicitud
        especialidad: nuevaEspecialidad,
        provider_id: perfil.provider.id,
        descripcion: nuevaDescripcion,
        imagen: url_imagen,
      }
      portafolios.push(nuevo_item);
      Alert.alert("Éxito", "Servicio agregado correctamente.");
      const especialidad_nueva = especialidad + ", " + nuevaEspecialidad;
      setEspecialidad(especialidad_nueva);
      setNuevaEspecialidad("");
      setNuevaDescripcion("");
      setFoto("")
      setPortafolio([...portafolio, url_imagen]);
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar el servicio.");
    }
  };
  const obtenerUltimoIdPortafolio= (idPortafolio:number) => {
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
          const nuevosServicios = portafolios.filter(item => item.id !== id);
          setPortafolios(nuevosServicios);
          const especialidades =
          nuevosServicios.map((item) => item.especialidad).join(", ") ||
          "";
        setEspecialidad(especialidades);
          window.alert("Servicio eliminado correctamente.");
        }
      }else{
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

  /** 📌 Renderizar Item del Portafolio */
  const renderPortfolioItem = ({ item }: { item: PortfolioItem }) => (
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
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("PantallaNotificacion")}>
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
              value={perfil?.provider?.speciality??" " + "," + especialidad}
              editable={editando}
              onChangeText={(text) =>
                setPerfil({ ...perfil, speciality: text })
              }
            />

            <Text style={styles.label}>📅 Disponibilidad:</Text>
            <TextInput
              style={styles.input}
              value={perfil?.provider?.availability}
              editable={editando}
              onChangeText={(text) => actualizarCampo("availability", text)}
            />
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
            {editando ? (
              <TouchableOpacity
                style={styles.botonGuardar}
                onPress={guardarPerfil}
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

            <TouchableOpacity
              style={styles.botonAgregar}
              onPress={agregarServicio}
            >
              <Text style={styles.textoBoton}>✅ Agregar Servicio</Text>
            </TouchableOpacity>

            {/* 📌 Portafolio */}
            <Text style={styles.label}>📸 Portafolio</Text>
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
            {/* 📌 Lista de Portafolio */}
            <Text style={styles.sectionTitle}>📁 Mi Portafolio</Text>
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
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default PantallaGestionServicios;
