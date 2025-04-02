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
import styles from "../styles/stylesRegistro.styles";
import { AuthService } from "../services/AuthService";
import { Picker } from "@react-native-picker/picker";
import { ServiceService } from "../services/ServiceService";
import { Service } from "../models/Service";
import { MunicipioService } from "../services/MunicipoService";
import { ProvinciaService } from "../services/ProvinciaService";
import { PlanService } from "../services/PlanService";
import { ConfiguracionService } from "../services/ConfiguracionService";
import { Configuracion } from "../models/Configuracion";
import { Controller, useForm } from "react-hook-form";

const RegistroScreen = () => {
  const navigation = useNavigation();
  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [servicios, setServicios] = useState<Service[]>([]);
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [configuracion, setConfiguracion] = useState<Configuracion | null>(
    null
  );
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreMunicipioSeleccionado, setNombreMunicipioSeleccionado] =
    useState(null);
  const [mostrarMunicipios, setMostrarMunicipios] = useState(false); // Nuevo estado
  const [nombreProvinciaSeleccionada, setNombreProvinciaSeleccionada] =
    useState(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      nombre: "",
      correo: "",
      contrasena: "",
      telefono: "",
      esProveedor: false,
      esComision: false,
      especialidad: "",
      servicio: 0,
      plan: 1,
      descripcion: "",
      provinciaSeleccionada: 0,
      municipioSeleccionado: 0,
    },
  });
  const esProveedor = watch("esProveedor");
  const esComision = watch("esComision");
  // 📌 Permitir al usuario subir una imagen desde su galería
  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets) {
      setImagenPerfil(resultado.assets[0].uri);
    }
  };

  // 📌 Validar campos antes de registrar
  const validarCampos = () => {
    if (getValues("esProveedor") && !imagenPerfil) {
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
  const obtenerConfiguracion = async () => {
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
  const registrarUsuario = async (data: any) => {
    if (!validarCampos()) return;
    setLoading(true);

    try {
      const id_usuario = await AuthService.crearUsuarioAuth(
        data.correo,
        data.contrasena
      );

      if (data.esProveedor) {
        const url_foto = await AuthService.subirFotoPerfil(
          id_usuario,
          imagenPerfil
        );
        AuthService.guardarPerfil({
          usuario_id: id_usuario,
          nombre: data.nombre,
          telefono: data.telefono,
          municipio_id: data.municipioSeleccionado,
          servicio_id: data.servicio,
          plan_id: data.plan,
          esProveedor: data.esProveedor,
          especialidad: data.especialidad,
          descripcion: data.descripcion,
          url_foto,
          esComision: data.esComision,
        });
      } else {
        AuthService.guardarPerfil({
          usuario_id: id_usuario,
          nombre: data.nombre,
          telefono: data.telefono,
          municipio_id: data.municipioSeleccionado,
          esProveedor: data.esProveedor,
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
      console.error("Error registrando usuario:", error);
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
    if (getValues("provinciaSeleccionada")) {
      const obtenerMunicipios = async () => {
        try {
          const municipios = await MunicipioService.obtenerTodos({
            provincia_id: getValues("provinciaSeleccionada"),
          });
          setMunicipios(municipios);
        } catch (error) {
          console.error("Error obteniendo municipios:", error);
        }
      };
      obtenerMunicipios();
    }
  }, [getValues("provinciaSeleccionada")]);

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
      <Controller
        control={control}
        name="nombre"
        rules={{ required: "Nombre es obligatorio" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Nombre Completo"
            style={styles.input}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.nombre && (
        <Text style={styles.errorText}>{errors.nombre.message}</Text>
      )}

      <Controller
        control={control}
        name="correo"
        rules={{
          required: "Correo es obligatorio",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Correo inválido",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Correo Electrónico"
            style={styles.input}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="email-address"
          />
        )}
      />
      {errors.correo && (
        <Text style={styles.errorText}>{errors.correo.message}</Text>
      )}

      <Controller
        control={control}
        name="contrasena"
        rules={{ required: "Contraseña es obligatoria" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry
          />
        )}
      />
      {errors.contrasena && (
        <Text style={styles.errorText}>{errors.contrasena.message}</Text>
      )}
      <Controller
        control={control}
        name="telefono"
        rules={{ required: "Telefono es obligatorio" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Telefono"
            style={styles.input}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.telefono && (
        <Text style={styles.errorText}>{errors.telefono.message}</Text>
      )}

      {/* 📌 Modal de selección de ubicación */}
      {/* 🌍 Botón para seleccionar ubicación */}
      <TouchableOpacity
        style={styles.botonFiltro}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textoBoton}>
          {getValues("provinciaSeleccionada")
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
                        getValues("provinciaSeleccionada") === item.id &&
                          styles.opcionActiva,
                      ]}
                      onPress={() => {
                        setValue("provinciaSeleccionada", item.id);
                        setNombreProvinciaSeleccionada(item.nombre);
                        setValue("municipioSeleccionado", 0);
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
                        getValues("municipioSeleccionado") === item.id &&
                          styles.opcionActiva,
                      ]}
                      onPress={() => {
                        setValue("municipioSeleccionado", item.id);
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
      <Controller
        control={control}
        name="esProveedor"
        render={({ field: { onChange, value } }) => (
          <View style={styles.switchContainer}>
            <Text style={styles.labelSwitch}>
              ¿Te registras como proveedor?
            </Text>
            <Switch value={value} onValueChange={onChange} />
          </View>
        )}
      />
      {/* 📌 Campos adicionales para proveedores */}
      {getValues("esProveedor") && (
        <>
          <Controller
            control={control}
            name="especialidad"
            rules={{
              required: watch("esProveedor")
                ? "Especialidad es obligatoria"
                : false,
              minLength: {
                value: 3,
                message: "Mínimo 3 caracteres",
              },
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <TextInput
                  placeholder="Especialidad"
                  style={[styles.input]}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </>
            )}
          />
          <Controller
            control={control}
            name="descripcion"
            rules={{
              required: watch("esProveedor")
                ? "Descripción es obligatoria"
                : false,
              minLength: {
                value: 10,
                message: "Mínimo 10 caracteres",
              },
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <TextInput
                  placeholder="Descripción del servicio"
                  style={[styles.input]}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  multiline
                />
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="servicio"
            rules={{
              validate: (value) =>
                !watch("esProveedor") ||
                value !== 0 ||
                "Debes seleccionar un servicio",
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View style={error ? styles.pickerError : styles.switchContainer}>
                <Text style={styles.labelSwitch}>Categoria</Text>
                 <Picker  style={styles.input} 
                 selectedValue={value} 
                 onValueChange={onChange}>
                  <Picker.Item label="Selecciona un servicio" value={0} />
                  {servicios.map((servicio) => (
                    <Picker.Item
                      key={servicio.id}
                      label={servicio.category}
                      value={servicio.id}
                    />
                  ))}
                </Picker>
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </View>
            )}
          />
          {/* 📌 Toggle para comision */}
          <Controller
            control={control}
            name="esComision"
            render={({ field: { onChange, value } }) => (
              <View style={styles.switchContainer}>
                <Text style={styles.labelSwitch}>
                  ¿Deseas suscripcion por porcentaje?
                </Text>
                <Switch value={value} onValueChange={onChange} />
              </View>
            )}
          />

          {esComision && (
            <Text style={styles.labelSwitch}>Porcentaje Comision (%)</Text>
          )}
        </>
      )}

      {/* 📌 Botón de registro */}
      <TouchableOpacity
        style={styles.botonRegistrar}
        onPress={handleSubmit(registrarUsuario)}
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
