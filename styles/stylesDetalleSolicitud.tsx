import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },

  /** 🔥 Título Principal */
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 20,
  },

  /** 🔥 Estado de la Solicitud */
  estado: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    width: '60%',
    alignSelf: 'center',
  },

  /** 🔥 Colores según el Estado */
  pendiente: {
    backgroundColor: '#FFBA08',
    color: '#663C00',
  },
  completado: {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
  },

  /** 🔥 Imagen del Servicio */
  imagenServicio: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  /** 🔥 Información del Servicio */
  servicio: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'justify',
    lineHeight: 22,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  fecha: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    marginBottom: 20,
  },
  item: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
  },

  /** 🔥 Cotizaciones */
  cotizacionesContainer: {
    marginBottom: 20,
    width: '100%',
  },
  cotizacionesTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 10,
  },
  cotizacionesList: {
    width: '100%',
  },
  cotizacionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cotizacionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
  },
  cotizacionDetalle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  cotizacionLabel: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '500',
  },
  cotizacionValor: {
    fontSize: 15,
    color: '#333333',
    fontWeight: 'bold',
  },
  cotizacionValorTotal: {
    fontSize: 16,
    color: '#FF0314',
    fontWeight: 'bold',
  },
  cotizacionDescripcion: {
    fontSize: 14,
    color: '#4A4A4A',
    marginTop: 10,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 5,
    fontStyle: 'italic',
  },
  noCotizaciones: {
    fontSize: 16,
    color: '#888888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  
  /** 🔥 Notas de Cotización */
  notasContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  notasTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  notaItem: {
    backgroundColor: '#F0F7FF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1E3A8A',
  },
  notaTexto: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
  }, 
   notaProveedor: {
    fontSize: 14,
    color: '#0DA36AFF',
    marginBottom: 5,
  },
  notaFecha: {
    fontSize: 12,
    color: '#777777',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  sinNotas: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },
  nuevaNotaContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputNota: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    minHeight: 40,
    maxHeight: 100,
    marginRight: 10,
    fontSize: 14,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  botonEnviarNota: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    height: 40,
  },
  textoBotonNota: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  /** 🔥 Contenido del ScrollView */
  content: {
    paddingBottom: 30,
  },

  /** 🔥 Tarjeta del Proveedor */
  cardProveedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    elevation: 5,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  /** 🔥 Imagen del Proveedor */
  imagenProveedor: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },

  /** 🔥 Nombre y Teléfono del Proveedor */
  nombreProveedor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  telefonoProveedor: {
    fontSize: 16,
    color: '#555555',
  },

  /** 🔥 Botón de Contacto */
  botonContactar: {
    backgroundColor: '#FF0314',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /** 🔥 Botón de Volver */
  botonVolver: {
    backgroundColor: '#CCCCCC',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  textoBotonVolver: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /** 🔥 Menú Lateral */
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 280,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  /** 🔥 Fondo Oscuro cuando el Menú está Abierto */
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },

  /** 🔥 Botones dentro del Menú */
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
  },

  /** 🔥 Botón de Cerrar Menú */
  menuCerrar: {
    marginTop: 20,
    backgroundColor: '#FF0314',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  menuCerrarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /** 🔥 Encabezado con Menú */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E3A8A',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 15,
  },
  menuButton: {
    marginRight: 10,
  },
  menuIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  tituloHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  /** 🔥 Botones de Aceptar y Rechazar */
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botonAceptar: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 5,
  },  
  botonCotizar: {
    flex: 1,
    backgroundColor: '#074366FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 5,
  },
  botonRechazar: {
    flex: 1,
    backgroundColor: '#FF0314',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 5,
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

});

export default styles;