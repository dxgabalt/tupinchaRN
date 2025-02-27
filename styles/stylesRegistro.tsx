import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 20,
  },

  /** 📸 Foto de perfil */
  fotoPerfilContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  fotoPerfil: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  textoFotoPerfil: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },

  /** 📌 Campos de entrada */
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 10,
  },

  /** 📌 Switch para proveedores */
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  labelSwitch: {
    fontSize: 16,
    color: '#374151',
  },

  /** 📌 Botón de registro */
  botonRegistrar: {
    backgroundColor: '#FF0314',
    paddingVertical: 14,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /** 🔗 Link para iniciar sesión */
  link: {
    color: '#1E3A8A',
    fontSize: 16,
    marginTop: 15,
    textDecorationLine: 'underline',
  },

  /** ✅ Mensaje de validación */
  mensajeValidacion: {
    fontSize: 14,
    color: '#FF0314',
    textAlign: 'center',
    marginBottom: 10,
  },
    /** 🌍 Botón de Filtro de Ubicación */
    botonFiltro: {
      backgroundColor: "#FF0314",
      borderRadius: 10,
      paddingVertical: 12,
      width: '100%',
      alignItems: "center",
      marginBottom: 12,
    },
  /** 🔥 Modal de Selección de Ubicación */
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContenido: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    maxHeight: "80%",
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1E3A8A",
  },
  scrollView: {
    width: "100%",
    maxHeight: 200, // 🔥 Máximo alto para evitar overflow en pantallas pequeñas
  },
  opcion: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    width: "100%",
    alignItems: "center",
  },
  opcionActiva: {
    backgroundColor: "#1E3A8A",
  },
  textoOpcion: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
  },
  botonCerrar: {
    marginTop: 10,
    backgroundColor: "#FF0314",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },

});

export default styles;
