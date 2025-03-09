import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  /** 🔥 Menú Hamburguesa */
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: '100%',
    backgroundColor: '#FF0314',
    paddingVertical: 30,
    paddingHorizontal: 20,
    zIndex: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  menuCerrar: {
    marginTop: 20,
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  menuCerrarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /** 🔥 Fondo Oscuro cuando el Menú está Abierto */
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },

  /** 🔥 Encabezado */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#003366',
    justifyContent: 'space-between',
    elevation: 5,
  },
  menuButton: {
    backgroundColor: '#FF0314',
    padding: 12,
    borderRadius: 10,
    elevation: 5,
  },
  menuIcon: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tituloHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },

  /** 🔥 Imagen de Portada */
  imagenPortada: {
    width: '100%',
    height: 240,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  /** 🔥 Perfil del Proveedor */
  perfilContainer: {
    alignItems: 'center',
    marginTop: -60,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  imagenPerfil: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginBottom: 12,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
    textAlign: 'center',
  },
  especialidad: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF0314',
    backgroundColor: '#FFF2F2',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 6,
  },
  ubicacion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginTop: 6,
  },
  calificacion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 10,
  },

  /** 🔥 Sección Sobre el Servicio */
  detallesContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    marginTop: 15,
    elevation: 2,
  },
  tituloSeccion: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#FF0314',
    paddingBottom: 4,
  },
  descripcion: {
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 24,
    textAlign: 'justify',
  },
  containerDescription: {
    height: 150, // Define una altura fija o usa porcentajes como '40%'
    marginVertical: 10,
  },

  scrollViewContent: {
    // Estilos para el contenido dentro del ScrollView
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  /** 🔥 Sección de Horario */
  horarioContainer: {
    backgroundColor: '#F8F9FA',
    padding: 18,
    marginHorizontal: 20,
    borderRadius: 15,
    marginTop: 15,
    elevation: 2,
  },
  horarioTexto: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },

  /** 🔥 Sección Portafolio */
  portafolioContainer: {
    marginHorizontal: 20,
    marginTop: 15,
  },
  imagenPortafolio: {
    width: 120,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  /** 🔥 Botones de Acción */
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
  },
  botonContacto: {
    flex: 1,
    backgroundColor: '#003366',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    elevation: 3,
  },
  botonSolicitar: {
    flex: 1,
    backgroundColor: '#FF0314',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 10,
    elevation: 3,
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  /** 🔥 Modal de Selección de Ubicación */
modalContainer: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
},
scrollView: {
  width: "100%",
  maxHeight: 200, // 🔥 Máximo alto para evitar overflow en pantallas pequeñas
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
input: {
  width: "100%",
  borderWidth: 1,
  borderColor: "gray",
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
},
boton: {
  backgroundColor: "blue",
  padding: 10,
  borderRadius: 5,
  marginTop: 10,
  width: "100%",
  alignItems: "center",
},
botonGuardar: {
  backgroundColor: "#28a745",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
  marginTop: 10,
},
botonCerrarModal: {
  backgroundColor: "#FF0314",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
  marginTop: 10,
},

imageContainer: {
  width: "100%",
  height: "80%", // Asegura que la imagen ocupe suficiente espacio vertical
  justifyContent: "center",
  alignItems: "center",
},
fullscreenImage: {
  width: "100%",
  height: "100%",
  resizeMode: "contain",
},

});

export default styles;
