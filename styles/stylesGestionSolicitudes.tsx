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
});

export default styles;
