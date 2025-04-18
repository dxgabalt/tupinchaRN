import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },

  /** 🔥 Menú de Navegación */
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#FF0314',
    padding: 20,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuCerrar: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#003366',
    borderRadius: 8,
    alignItems: 'center',
  },
  menuCerrarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  /** 🔥 Encabezado */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#003366',
    borderRadius: 12,
    marginBottom: 10,
  },
  menuButton: {
    marginRight: 10,
  },
  menuIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /** 🔥 Cargando */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },

  /** 🔥 Mensaje cuando no hay solicitudes */
  noSolicitudes: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },

  /** 🔥 Tarjetas de Solicitudes */
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardAceptada: {
    backgroundColor: '#E3FCEF',
  },
  cardPendiente: {
    backgroundColor: '#FFF8E1',
  },

  /** 🔥 Imagen del Solicitante */
  imagenSolicitante: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },

  /** 🔥 Contenedor de Información */
  infoContainer: {
    flex: 1,
  },

  /** 🔥 Texto de la solicitud */
  descripcion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  fecha: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  precio: {
    fontSize: 14,
    color: '#FF0314',
    fontWeight: 'bold',
    marginTop: 5,
  },

  /** 🔥 Estado de la solicitud */
  estado: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 6,
    borderRadius: 8,
    textAlign: 'center',
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  estadoAceptado: {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
  },
  estadoPendiente: {
    backgroundColor: '#FFBA08',
    color: '#663C00',
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
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  cardCotizacion: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
        width: 0,
        height: 3,
    },
    elevation: 3, // Solo para Android
},
cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
},
icon: {
    fontSize: 20,
    marginRight: 10,
},
notasContainer: {
  marginTop: 10,
  marginVertical: 10,
  padding: 5,
  backgroundColor: "#f9f9f9",
  borderRadius: 5,
},
tituloNotas: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 8,
  color: '#333',
},
fechaNota: {
  fontSize: 12,
  color: '#999',
  marginBottom: 2,
},
fechaCliente: {
  alignSelf: 'flex-start',
  textAlign: 'left',
},
fechaProveedor: {
  alignSelf: 'flex-end',
  textAlign: 'right',
},
burbujaCliente: {
  backgroundColor: '#e1f5fe',
  padding: 10,
  borderRadius: 15,
  maxWidth: '75%',
  alignSelf: 'flex-start',
  borderTopLeftRadius: 0,
},
burbujaProveedor: {
  backgroundColor: '#dcedc8',
  padding: 10,
  borderRadius: 15,
  maxWidth: '75%',
  alignSelf: 'flex-end',
  borderTopRightRadius: 0,
},
notaItem: {
  padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
notaCliente: {
  backgroundColor: '#e1f5fe', // Azul claro para cliente
  borderLeftWidth: 5,
  borderLeftColor: '#0288d1',
},
notaProveedor: {
  backgroundColor: '#f1f8e9', // Verde claro para proveedor
  borderLeftWidth: 5,
  borderLeftColor: '#43a047',
},
notaTextoCliente: {
  fontSize: 16,
  color: '#0277bd',
  marginBottom: 4,
},
notaTextoProveedor: {
  fontSize: 16,
  color: '#388e3c',
  marginBottom: 4,
},
contenedorFila: {
  flexDirection: 'row', // Alineación horizontal
  alignItems: 'center', // Alineación vertical
  gap: 10, // Espacio entre el input y el botón
},
estiloInput: {
  width: 60, // Tamaño suficiente para 4 dígitos
  borderWidth: 1,
  borderColor: '#ccc',
  backgroundColor: "#f9f9f9",
  padding: 8,
  borderRadius: 5,
},
estiloBoton: {
  backgroundColor: '#007bff',
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 5,
},
estiloTextoBoton: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
},
estiloPrecio: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},

});

export default styles;
