import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  Modal,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // 📌 Importar librería para seleccionar imágenes
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/stylesRegistro";
import { AuthService } from "../services/AuthService";
import { Picker } from "@react-native-picker/picker";
import { ServiceService } from "../services/ServiceService";
import { Service } from "../models/Service";
import { MunicipioService } from "../services/MunicipoService";
import { ProvinciaService } from "../services/ProvinciaService";
import { PlanService } from "../services/PlanService";
import { ConfiguracionService } from "../services/ConfiguracionService";
import { Configuracion } from "../models/Configuracion";

const RegistroScreen = () => {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [esProveedor, setEsProveedor] = useState(false);
  const [esComision, setEsComision] = useState(false);
  const [especialidad, setEspecialidad] = useState("");
  const [servicio, setServicio] = useState(0);
  const [plan, setPlan] = useState(1);
  const [descripcion, setDescripcion] = useState("");
  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [servicios, setServicios] = useState<Service[]>([]);
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [configuracion, setConfiguracion] = useState<Configuracion |null>(null);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState(0);
  const [nombreMunicipioSeleccionado, setNombreMunicipioSeleccionado] =
    useState(null);
  const [mostrarMunicipios, setMostrarMunicipios] = useState(false); // Nuevo estado
  const [nombreProvinciaSeleccionada, setNombreProvinciaSeleccionada] =
    useState(null);

  // 📌 Permitir al usuario subir una imagen desde su galería
  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a tu galería para subir la imagen."
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.cancelled && resultado.assets) {
      const imageUri = resultado.assets[0].uri;
      setImagenPerfil(imageUri);
    }
  };

  // 📌 Validar campos antes de registrar
  const validarCampos = () => {
    if (
      !nombre.trim() ||
      !correo.trim() ||
      !contrasena.trim() ||
      !telefono.trim()
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return false;
    }

    if (!correo.includes("@")) {
      Alert.alert("Error", "Por favor, ingresa un correo válido.");
      return false;
    }

    if (contrasena.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    if (esProveedor && !imagenPerfil) {
      Alert.alert("Error", "Los proveedores deben subir una imagen de perfil.");
      return false;
    }

    return true;
  };
  // Obtener las categorías
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
   const obtenerConfiguracion= async () => {
    try {
      const configuracion = await ConfiguracionService.obtenerPorId(1);
     setConfiguracion(configuracion);
    } catch (error) {
      console.error("Error obteniendo servicios:", error);
    }
  };
  const obtenerPlanes = async () => {
    try {
      const servicios = await PlanService.obtenerTodos();
      setPlanes(
        servicios.map((plan) => ({
          id: plan.id,
          nombre: plan.nombre,
          costo: plan.costo,
          duracion: plan.duracion,
          created_at: plan.created_at,
        }))
      );
    } catch (error) {
      console.error("Error obteniendo servicios:", error);
    }
  };
  useEffect(() => {
    obtenerConfiguracion();
  }, []);  
  useEffect(() => {
    obtenerServicios();
  }, []);
  useEffect(() => {
    obtenerPlanes();
  }, []);
  // 📌 Función simulada para registrar usuario
  const registrarUsuario = async () => {
    if (!validarCampos()) return;
    setLoading(true);
    try {
      const id_usuario = await AuthService.crearUsuarioAuth(correo, contrasena);
      if (esProveedor) {
        const url_foto = await AuthService.subirFotoPerfil(
          id_usuario,
          imagenPerfil
        );
        AuthService.guardarPerfil({
          usuario_id: id_usuario,
          nombre,
          telefono,
          municipio_id: municipioSeleccionado,
          servicio_id: servicio,
          plan_id: plan,
          esProveedor,
          especialidad,
          descripcion,
          url_foto,
          esComision,
        });
      } else {
        AuthService.guardarPerfil({
          usuario_id: id_usuario,
          nombre,
          telefono,
          municipio_id: municipioSeleccionado,
          esProveedor,
        });
      }
      const perfil = await AuthService.obtenerPerfil();

      if (perfil?.role_id !== 3) {
        navigation.navigate("PantallaNegocios");
      } else {
        Alert.alert(
          "Registro exitoso",
          "Tu cuenta ha sido creada y será validada en 24 horas."
        );        
        alert(
          "Registro exitoso, Tu cuenta ha sido creada y será validada en 24 horas. "
        );
        navigation.navigate("GestionSolicitudes");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "No se pudo registrar el usuario.");
    }
  };

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
    }
  }, [provinciaSeleccionada]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>📝 Registro de Cuenta</Text>

      {/* 📸 Foto de perfil */}
      {esProveedor && (
        <>
          <TouchableOpacity
            style={styles.fotoPerfilContainer}
            onPress={seleccionarImagen}
          >
            {imagenPerfil ? (
              <Image source={{ uri: imagenPerfil }} style={styles.fotoPerfil} />
            ) : (
              <Text style={styles.textoFotoPerfil}>📷 Subir Imagen</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.mensajeValidacion}>
            ✅ Tu cuenta será validada en las próximas 24 horas.
          </Text>
        </>
      )}

      {/* 📌 Campos de entrada */}
      <TextInput
        placeholder="Nombre Completo"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        placeholder="Correo Electrónico"
        style={styles.input}
        value={correo}
        keyboardType="email-address"
        onChangeText={setCorreo}
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={contrasena}
        secureTextEntry
        onChangeText={setContrasena}
      />
      <TextInput
        placeholder="Teléfono"
        style={styles.input}
        value={telefono}
        keyboardType="phone-pad"
        onChangeText={setTelefono}
      />
      {/* 📌 Modal de selección de ubicación */}
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

      {/* 📌 Toggle para proveedores */}
      <View style={styles.switchContainer}>
        <Text style={styles.labelSwitch}>¿Te registras como proveedor?</Text>
        <Switch value={esProveedor} onValueChange={setEsProveedor} />
      </View>

      {/* 📌 Campos adicionales para proveedores */}
      {esProveedor && (
        <>
          <TextInput
            placeholder="Especialidad (Ej: Fontanería, Electricidad)"
            style={styles.input}
            value={especialidad}
            onChangeText={setEspecialidad}
          />
          <TextInput
            placeholder="Descripción del servicio"
            style={styles.input}
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
          />
          <View style={styles.switchContainer}>
            <Text style={styles.labelSwitch}>Categoria</Text>
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
          {/* 📌 Toggle para comision */}
          <View style={styles.switchContainer}>
            <Text style={styles.labelSwitch}>
              ¿Deseas suscripcion por porcentaje?
            </Text>
            <Switch value={esComision} onValueChange={setEsComision} />
          </View>
          {esComision && (
            <Text style={styles.labelSwitch}>
            Porcentaje Comision (%)
            </Text>
          )}
          
        </>
      )}

      {/* 📌 Botón de registro */}
      <TouchableOpacity
        style={styles.botonRegistrar}
        onPress={registrarUsuario}
        disabled={loading}
      >
        <Text style={styles.textoBoton}>✅ Registrarse</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#FF0314"
          style={{ marginTop: 10 }}
        />
      )}

      {/* 🔗 Link para iniciar sesión */}
      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        ¿Ya tienes una cuenta? Iniciar sesión
      </Text>
    </ScrollView>
  );
};

export default RegistroScreen;
