import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  Modal,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import styles from "../styles/stylesMiPerfil";
import { AuthService } from "../services/AuthService";
import { MunicipioService } from "../services/MunicipoService";
import { ProvinciaService } from "../services/ProvinciaService";
import { Controller, useForm } from "react-hook-form";
import { Provincia } from "../models/Provincia";
import { Municipio } from "../models/Municipio";

const usuarioDefault = {
  id: "",
  name: "",
  email: "",
  phone: "",
  profile_pic_url: "",
  user_id: "",
  rol_id: 0,
};
type PerfilData = {
  email: string;
  nuevoTelefono: string;
  nuevoNombre: string;
  municipio_id: number;
  provincia_id: number;
};
const MiPerfilScreen = () => {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState(usuarioDefault);
  const [editando, setEditando] = useState(false);
  const [nuevaFoto, setNuevaFoto] = useState("");
  const animacionBoton = new Animated.Value(1);

  const [modalVisible, setModalVisible] = useState(false);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const [nombreMunicipioSeleccionado, setNombreMunicipioSeleccionado] =
    useState<String| null>(null);
  const [nombreProvinciaSeleccionada, setNombreProvinciaSeleccionada] =
    useState<String |null>(null);
  const [mostrarMunicipios, setMostrarMunicipios] = useState(false);
const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
      setValue,
      watch,
    } = useForm<PerfilData>({
      defaultValues: {
        email: "",
        nuevoTelefono: "",
        nuevoNombre: "",
        municipio_id: 0,
        provincia_id: 0,
      },
    });
    const provinciaSeleccionada  = watch("provincia_id");
   const municipioSeleccionado = watch("municipio_id"); 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await AuthService.obtenerPerfil();
        if (profile) {
          reset({
            nuevoTelefono: profile.phone || "",
            email: profile.email || "",
            nuevoNombre:profile.name || "",
            municipio_id: profile.municipios.id || 0,
            provincia_id: profile.provincias.id || 0,
          });
          setUsuario(profile);
          setNombreProvinciaSeleccionada(profile.provincias.nombre);
          setNombreMunicipioSeleccionado(profile.municipios.name);
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo obtener el perfil.");
      }
    };
    fetchProfile();
  }, []);

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

  const guardarCambios = async (data:PerfilData) => {
    try {
      let fotoURL = usuario.profile_pic_url;

      if (nuevaFoto) {
        const urlSubida = await AuthService.subirFotoPerfil(
          usuario.user_id,
          nuevaFoto
        );
        if (urlSubida) {
          fotoURL = urlSubida;
        }
      }
      await AuthService.actualizarPerfil(
        usuario.user_id,
        data.nuevoNombre,
        data.nuevoTelefono,
        usuario.rol_id === 3,
        provinciaSeleccionada??0,
        municipioSeleccionado??0,
        fotoURL
      );
      setUsuario((prev) => ({
        ...prev,
        name: data.nuevoNombre,
        phone: data.nuevoTelefono,
        profile_pic_url: fotoURL,
        municipio_id: municipioSeleccionado,
        provincia_id: provinciaSeleccionada
      }));

      setEditando(false);
      Alert.alert(
        "Perfil actualizado",
        "Los cambios se guardaron correctamente."
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil.");
    }
  };

  const animarBoton = () => {
    Animated.sequence([
      Animated.timing(animacionBoton, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animacionBoton, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
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
      <Text style={styles.titulo}>👤 Mi Perfil</Text>
      <Image
        source={{ uri: nuevaFoto || usuario.profile_pic_url }}
        style={styles.fotoPerfil}
      />
      <TouchableOpacity style={styles.botonFoto} onPress={cambiarFotoPerfil}>
        <Text style={styles.textoBoton}>📷 Cambiar Foto</Text>
      </TouchableOpacity>
      {/* 📝 Campos de usuario */}
      <View style={styles.campoContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <Controller
        control={control}
        name="nuevoNombre"
        rules={{ required: 'Nombre es requerida' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            editable={editando}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            multiline
          />
        )}
      />
      {errors.nuevoNombre && (
        <Text style={styles.errorText}>{errors.nuevoNombre.message}</Text>
      )}
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Correo:</Text>
        <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            editable={false}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            multiline
          />
        )}
      />
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Teléfono:</Text>
        <Controller
        control={control}
        name="nuevoTelefono"
        rules={{ required: 'Numero de Telefono es requerido' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Telefono"
            editable={editando}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            multiline
          />
        )}
      />
      {errors.nuevoTelefono && (
        <Text style={styles.errorText}>{errors.nuevoTelefono.message}</Text>
      )}
      </View>

      {/* 📌 Botón para editar/guardar */}
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

      {editando ? (
        <Animated.View style={{ transform: [{ scale: animacionBoton }] }}>
          <TouchableOpacity
            style={styles.botonGuardar}
            onPress={() => {
              handleSubmit(guardarCambios)();
              animarBoton();
            }}
          >
            <Text style={styles.textoBoton}>💾 Guardar Cambios</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <TouchableOpacity
          style={styles.botonEditar}
          onPress={() => setEditando(true)}
        >
          <Text style={styles.textoBotonEditar}>✏️ Editar Perfil</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.botonVolver}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoBotonVolver}>⬅️ Volver</Text>
      </TouchableOpacity>

      {/* ✅ MODAL */}
      <Modal visible={modalVisible && editando} animationType="slide" transparent>
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
                        setValue('provincia_id',item.id||0);
                        setNombreProvinciaSeleccionada(item.nombre||"");
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
                  keyExtractor={(item) => item.id?.toString()||""}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.opcion,
                        municipioSeleccionado === item.id &&
                          styles.opcionActiva,
                      ]}
                      onPress={() => {
                        setValue('municipio_id',item.id||0);
                        setNombreMunicipioSeleccionado(item.name||"");
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
    </ScrollView>
  );
};

export default MiPerfilScreen;
