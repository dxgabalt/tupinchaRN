import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 20,
  },

  /** 🔥 Menú de Navegación */
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: '100%',
    backgroundColor: '#FF0314',
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff3',
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuCerrar: {
    marginTop: 30,
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  menuCerrarTexto: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99,
  },

  /** 🔥 Encabezado */
   header: {
     backgroundColor: "#003366",
     paddingTop: Platform.OS === "ios" ? 0 : 10,
     paddingBottom: 15,
   },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    fontSize: 26,
    color: '#FFFFFF',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },

  /** 🔥 Formulario */
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  valor: {
    fontSize: 16,
    color: '#555',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  /** 🔥 Botones */
  botonGuardar: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  botonEditar: {
    backgroundColor: '#FFA500',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  errorText: {
    color: "#FF0314",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  pickerError: {
    marginBottom: 15,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
  },
  inputError: {
    backgroundColor: 'white',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
  },
  botonSubir: {
    backgroundColor: '#003366',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  botonAgregar: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  botonVolver: {
    backgroundColor: '#BBBBBB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  textoBotonVolver: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },

  /** 🔥 Portafolio */
  portafolioContainer: {
    marginTop: 15,
    flexDirection: 'row',
  },
  imagenPortafolio: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
    borderColor: '#FF0314',
    borderWidth: 2,
  },
  textoVacio: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    marginVertical: 10,
  },

  /** 🔥 Animaciones */
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  
  // Portfolio item styles
  portfolioItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  
  portfolioContent: {
    flexDirection: 'row',
    flex: 1,
  },
  
  portfolioImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  
  noImage: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  noImageText: {
    color: '#888',
    fontSize: 12,
  },
  
  portfolioInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  
  portfolioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  
  portfolioDescription: {
    fontSize: 14,
    color: '#666',
  },
  
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ffefef',
    marginLeft: 10,
  },
  
  deleteButtonText: {
    fontSize: 18,
  },
  
  // Preview image container
  previewContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    marginVertical: 15,
    alignSelf: 'center',
  },
  
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  removeImageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  
  // Text area for description
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  
  // Empty message
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  
  // Disabled button
  botonDesactivado: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
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
 /** 📸 Foto de perfil */
  fotoPerfil: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#FF0314',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    alignSelf: 'center', // Asegura el centrado horizontal
  },
  
   /** 📌 Botón de cambiar foto */
   botonFoto: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default styles;
