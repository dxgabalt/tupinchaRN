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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/stylesPantallaNegocios";
import { ServiceService } from "../services/ServiceService";
import { Service } from "../models/Service";
import { MunicipioService } from "../services/MunicipoService";
import { Municipio } from "../models/Municipio";
import { ProvinciaService } from "../services/ProvinciaService";
import { Provincia } from "../models/Provincia";

const PantallaNegocios = () => {
  const navigation = useNavigation();
  const [busqueda, setBusqueda] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<string | null>(null);
  const [nombreprovinciaSeleccionada, setNombreProvinciaSeleccionada] = useState<string | null>(null);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<string | null>(null);
  const [nombremunicipioSeleccionado, setNombreMunicipioSeleccionado] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [categorias, setCategorias] = useState<Service[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]); // Estado para las provincias
  const [municipios, setMunicipios] = useState<Municipio[]>([]); // Estado para los municipios

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
  const categoriasFiltradas = categorias.filter((categoria: Service) =>
    categoria.category.toLowerCase().includes(busqueda.toLowerCase())
  );

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
          const municipios = await MunicipioService.obtenerTodos({provincia_id:provinciaSeleccionada});
          setMunicipios(municipios);
        } catch (error) {
          console.error("Error obteniendo municipios:", error);
        }
      };
      obtenerMunicipios();
    }
  }, [provinciaSeleccionada]);

  // Obtener las categorías
  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const servicios = await ServiceService.obtenerTodos();
        const categoriasFormateadas = servicios.map((servicio) => ({
          id: servicio.id,
          category: servicio?.category,
          icono: servicio.icono,
          tags: servicio.tags,
        }));
        setCategorias(categoriasFormateadas);
      } catch (error) {
        console.error("Error obteniendo servicios:", error);
      }
    };
    obtenerCategorias();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🔥 Menú Lateral con Animación */}
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
            onPress={() => navigation.navigate("PantallaHistorialUsuario")}
          >
            <Text style={styles.menuText}>🕒 Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("PantallaSoporteFAQ")}
          >
            <Text style={styles.menuText}>❓ Soporte</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("MiPerfil")}
          >
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
        <Text style={styles.ubicacion}>
          📍 {nombreprovinciaSeleccionada || "Selecciona ubicación"}
        </Text>
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
      <TouchableOpacity
        style={styles.botonFiltro}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textoBoton}>
          {provinciaSeleccionada
            ? `${nombreprovinciaSeleccionada} - ${
                nombremunicipioSeleccionado || "Selecciona municipio"
              }`
            : "Seleccionar Ubicación"}
        </Text>
      </TouchableOpacity>

      {/* 📌 Modal de selección de ubicación */}
      <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContenido}>
          <Text style={styles.modalTitulo}>Selecciona una Provincia</Text>
          <ScrollView style={styles.scrollView}>
            {provincias.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.opcion,
                  provinciaSeleccionada === item.id && styles.opcionActiva,
                ]}
                onPress={() => {setProvinciaSeleccionada(item.id)
                  setNombreProvinciaSeleccionada(item.nombre)
                }}
              >
                <Text style={styles.textoOpcion}>{item.nombre}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
    
          {provinciaSeleccionada && (
            <>
              <Text style={styles.modalTitulo}>Selecciona un Municipio</Text>
              <FlatList
                data={municipios}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.opcion,
                      municipioSeleccionado === item.id && styles.opcionActiva,
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
    </Modal>      {/* 🔥 Categorías con iconos */}
      <FlatList
        data={categoriasFiltradas}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.filaCategorias}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardCategoria}
            onPress={() =>
              navigation.navigate("PantallaResultadosBusqueda", {
                servicio: item.category,
              })
            }
          >
            <Text style={styles.emoji}>{item.icono}</Text>
            <Text style={styles.textoCategoria}>{item.category}</Text>
          </TouchableOpacity>
        )}
      />


      {/* 📌 Banner Promocional */}
      <TouchableOpacity style={styles.banner}>
        <Image
          source={{
            uri: "https://servicios.tupincha.com/wp-content/uploads/2024/01/Tu-Pincha-letras-blancas-3.png",
          }}
          style={styles.imagenBanner}
        />
        <Text style={styles.textoBanner}>
          Reserva tu servicio fácil y rápido
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PantallaNegocios;
