"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  StyleSheet,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { AuthService } from "../services/AuthService"
import { MaterialIcons } from "@expo/vector-icons"

const LoginScreen = () => {
  const navigation = useNavigation()
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Función para iniciar sesión - sin animaciones que interfieran
  const handleLogin = async () => {
    if (!correo.trim() || !contrasena.trim()) {
      Alert.alert("Error", "Por favor, ingresa tu correo y contraseña.")
      return
    }

    setLoading(true)
    try {
      const response = await AuthService.autenticarUsuario(correo, contrasena)
      if (!response.success) {
        Alert.alert("Error", "Credenciales incorrectas. Inténtalo de nuevo.")
        setLoading(false)
        return
      }

      // Redirección según el rol del usuario
      if (response.role === 3) {
        navigation.navigate("GestionSolicitudes")
      } else {
        navigation.navigate("PantallaNegocios")
      }
    } catch (error) {
      console.error("Error de autenticación:", error)
      Alert.alert("Error", "Ocurrió un error inesperado. Inténtalo más tarde.")
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      <View style={styles.container}>
        <View style={styles.formContainer}>
          {/* Logo y título */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="vpn-key" size={32} color="#FFD700" />
            </View>
            <Text style={styles.titulo}>Iniciar Sesión</Text>
          </View>

          {/* Formulario */}
          <View style={styles.inputsContainer}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color="#888888" style={styles.inputIcon} />
              <TextInput
                placeholder="Correo Electrónico"
                style={styles.input}
                value={correo}
                keyboardType="email-address"
                onChangeText={setCorreo}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#888888" style={styles.inputIcon} />
              <TextInput
                placeholder="Contraseña"
                style={styles.input}
                value={contrasena}
                secureTextEntry={!showPassword}
                onChangeText={setContrasena}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={22} color="#888888" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botón de ingreso */}
          <TouchableOpacity style={styles.boton} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <View style={styles.buttonContent}>
                <MaterialIcons name="login" size={20} color="#FFFFFF" />
                <Text style={styles.textoBoton}>Ingresar</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Enlaces */}
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("OlvidarContrasena")}>
              <Text style={styles.forgotPasswordLink}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("RegistroScreen")}>
              <Text style={styles.registerLink}>
                ¿No tienes cuenta? <Text style={styles.registerHighlight}>Regístrate aquí</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#003366",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#003366",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    justifyContent: "center",
  },
  logoContainer: {
    marginRight: 10,
    width: 50,
    height: 50,
    backgroundColor: "#003366",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
    marginLeft: 10,
  },
  inputsContainer: {
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    height: 50,
  },
  eyeIcon: {
    padding: 5,
  },
  boton: {
    backgroundColor: "#FF0000",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textoBoton: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  linksContainer: {
    alignItems: "center",
  },
  forgotPasswordLink: {
    color: "#FF0000",
    fontSize: 14,
    marginBottom: 15,
    fontWeight: "500",
  },
  registerLink: {
    color: "#333333",
    fontSize: 14,
  },
  registerHighlight: {
    color: "#FF0000",
    fontWeight: "500",
  },
})

export default LoginScreen

