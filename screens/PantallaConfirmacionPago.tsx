import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "../styles/stylesConfirmacionPago";
import SolicitudService from "../services/SolicitudService";
import SupabaseService from "../services/SupabaseService";
import { AuthService } from "../services/AuthService";

const PantallaConfirmacionPago = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 📌 Recibe datos de la Pantalla de Solicitud
  const {
    service_id,
    servicio,
    id_proveedor,
    proveedor,
    descripcion,
    url_imagen,
    fecha,
    fechaFormateada,
    precio,
    direccion,
  } =
    (route.params as {
      service_id: number;
      servicio: string;
      id_proveedor: number;
      proveedor: string;
      descripcion: string;
      url_imagen: string;
      fecha: Date;
      fechaFormateada: string;
      precio: number;
      direccion: string;
    }) || {};

  // 📌 Estado para el método de pago
  const [metodoPago, setMetodoPago] = useState("");
  const [isConfirming, setIsConfirming] = useState(false); // ✅ Estado para deshabilitar el botón

  // 📌 Función para confirmar pago y solicitud
  const confirmarPago = () => {
    if (!metodoPago) {
      Alert.alert("Error", "Por favor, selecciona un método de pago.");
      return;
    }
    setIsConfirming(true); // 🔥 Deshabilitar el botón al iniciar
    enviarSolicitud();
    Alert.alert(
      "✅ Pago Confirmado",
      `Se ha confirmado la solicitud de servicio con el método de pago: ${metodoPago}.`,
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("PantallaPagoExitoso"),
        },
      ]
    );
    if (Platform.OS === "web") {
      navigation.navigate("PantallaPagoExitoso");
    }
  };
  // 📌 Enviar solicitud con validación
  const enviarSolicitud = async () => {
    if (!descripcion.trim()) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      const profile = await AuthService.obtenerPerfil();
      const userId = profile.user_id || "";
      const id = await SolicitudService.crearSolicitudDeServicio({
        provider_id: id_proveedor,
        service_id,
        descripcion,
        fecha: fecha.toISOString().split("T")[0],
        precio,
        userId,
        url_imagen,
        direccion,
        metodoPago
      });
      if (id == 0) {
        Alert.alert("Error", "No se pudo crear la solicitud.");
        throw new Error("No se pudo crear la solicitud.");
      }
    } catch (error: any) {
      Alert.alert("Error", "No se pudo enviar la solicitud.");
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Confirmación de Pago</Text>

      {/* 🔧 Información del Servicio */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>🔧 Servicio:</Text>
        <Text style={styles.valor}>{servicio}</Text>

        <Text style={styles.label}>👨‍🔧 Proveedor:</Text>
        <Text style={styles.valor}>{proveedor}</Text>

        <Text style={styles.label}>📅 Fecha del Servicio:</Text>
        <Text style={styles.valor}>{fechaFormateada}</Text>

        <Text style={styles.label}>💰 Total a Pagar:</Text>
        <Text style={styles.valor}>$ {precio}</Text>
      </View>

      {/* 💳 Selección de Método de Pago */}
      <Text style={styles.subtitulo}>Elige un Método de Pago</Text>

      <TouchableOpacity
        style={[
          styles.botonMetodo,
          metodoPago === "Tarjeta de Crédito" && styles.metodoSeleccionado,
        ]}
        onPress={() => setMetodoPago("Tarjeta de Crédito")}
      >
        <Text style={styles.textoMetodo}>💳 Tarjeta de Crédito</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.botonMetodo,
          metodoPago === "Transferencia Bancaria" && styles.metodoSeleccionado,
        ]}
        onPress={() => setMetodoPago("Transferencia Bancaria")}
      >
        <Text style={styles.textoMetodo}>🏦 Transferencia Bancaria</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.botonMetodo,
          metodoPago === "Pago en Efectivo" && styles.metodoSeleccionado,
        ]}
        onPress={() => setMetodoPago("Pago en Efectivo")}
      >
        <Text style={styles.textoMetodo}>💵 Pago en Efectivo</Text>
      </TouchableOpacity>

      {/* 📌 Botón Confirmar */}
      <TouchableOpacity
        style={styles.botonConfirmar}
        onPress={confirmarPago}
        disabled={isConfirming} // ✅ Deshabilitar el botón
      >
        <Text style={styles.textoBoton}>✅ Confirmar Pago</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PantallaConfirmacionPago;
