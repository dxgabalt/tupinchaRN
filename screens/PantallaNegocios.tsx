import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  ScrollView,
  Animated,
  Alert,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/stylesPantallaNegocios";
import { ServiceService } from "../services/ServiceService";
import { MunicipioService } from "../services/MunicipoService";
import { ProvinciaService } from "../services/ProvinciaService";
import { AuthService } from "../services/AuthService";

const PantallaNegocios = () => {
  const navigation = useNavigation();
  const [busqueda, setBusqueda] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
  const [nombreProvinciaSeleccionada, setNombreProvinciaSeleccionada] = useState(null);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState(null);
  const [nombreMunicipioSeleccionado, setNombreMunicipioSeleccionado] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [usuario, setUsuario] = useState({ id: "", name: "", email: "", phone: "", profile_pic_url: "", user_id: "" });
  const [mostrarMunicipios, setMostrarMunicipios] = useState(false); // Nuevo estado

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

  // Obtener usuario autenticado
  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const profile = await AuthService.obtenerPerfil();
        setUsuario(profile || usuario);
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
      }
    };
    obtenerUsuario();
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
          const municipios = await MunicipioService.obtenerTodos({ provincia_id: provinciaSeleccionada });
          setMunicipios(municipios);
        } catch (error) {
          console.error("Error obteniendo municipios:", error);
        }
      };
      obtenerMunicipios();
    }
  }, [provinciaSeleccionada]);

  // Obtener las categorías
  const obtenerCategorias = async () => {
    try {
      const servicios = await ServiceService.obtenerTodos();
      setCategorias(servicios.map(servicio => ({
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
    obtenerCategorias();
  }, []);
  const handlePress = () => {
    Linking.openURL("https://servicios.tupincha.com/shop/"); // Cambia la URL según lo necesites
  };
  const buscar = (texto:string) => {
    texto.length === 0 ? obtenerCategorias():setCategorias(categorias.filter(c => c.category.toLowerCase().includes(texto.toLowerCase())));
    setBusqueda(texto);
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
        <Text style={styles.bienvenida}>Hola, {usuario.name || "Usuario"}</Text>
        <Text style={styles.ubicacion}>📍 {nombreProvinciaSeleccionada || "Selecciona ubicación"}</Text>
      </View>

      {/* 🔍 Barra de búsqueda */}
      <View style={styles.barraBusqueda}>
        <Text style={styles.iconoBusqueda}>🔍</Text>
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar servicio..."
          value={busqueda}
          onChangeText={buscar}
        />
      </View>

      {/* 🌍 Botón para seleccionar ubicación */}
      <TouchableOpacity style={styles.botonFiltro} onPress={() => setModalVisible(true)}>
        <Text style={styles.textoBoton}>
          {provinciaSeleccionada ? `${nombreProvinciaSeleccionada} - ${nombreMunicipioSeleccionado || "Selecciona municipio"}` : "Seleccionar Ubicación"}
        </Text>
      </TouchableOpacity>

      {/* 📌 Modal de selección de ubicación */}
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
                      style={[styles.opcion, provinciaSeleccionada === item.id && styles.opcionActiva]}
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
                <TouchableOpacity onPress={() => setMostrarMunicipios(false)} style={styles.botonVolver}>
                  <Text style={styles.textoBoton}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitulo}>Selecciona un Municipio</Text>
                <FlatList
                  data={municipios}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[styles.opcion, municipioSeleccionado === item.id && styles.opcionActiva]}
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
      
            <TouchableOpacity style={styles.botonCerrar} onPress={() => setModalVisible(false)}>
              <Text style={styles.textoBoton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🔥 Categorías */}
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cardCategoria} onPress={() => navigation.navigate("PantallaResultadosBusqueda", { servicio: item.category , service_id: item.id })}>
            <Text style={styles.emoji}>{item.icono}</Text>
            <Text style={styles.textoCategoria} numberOfLines={1} ellipsizeMode="tail">{item.category}</Text>
          </TouchableOpacity>
        )}
      />
    {/* 📌 Banner Promocional */}
    <TouchableOpacity style={styles.banner} onPress={handlePress}>
      <Image
        source={{
          uri: "https://servicios.tupincha.com/wp-content/uploads/2024/01/Tu-Pincha-letras-blancas-3.png",
        }}
        style={styles.imagenBanner}
      />
    <Text style={styles.textoBanner}>Reserva tu servicio fácil y rápido</Text>
    </TouchableOpacity>
    </View>
  );
};

export default PantallaNegocios;
