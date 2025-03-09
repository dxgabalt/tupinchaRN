import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
     /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
  },

  /** 🔥 Encabezado */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#1E3A8A",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    fontSize: 22,
    color: "#FFF",
    fontWeight: "bold",
  },
  bienvenida: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    flexShrink: 1, // 🔥 Evita que el texto se corte en pantallas pequeñas
    textAlign: "center",
  },
  ubicacion: {
    fontSize: 12,
    color: "#D1D5DB",
    textAlign: "right",
  },

  /** 🔍 Barra de Búsqueda */
  barraBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginVertical: 12,
    elevation: 2,
  },
  iconoBusqueda: {
    fontSize: 18,
    marginRight: 8,
  },
  inputBusqueda: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },

  /** 🌍 Botón de Filtro de Ubicación */
  botonFiltro: {
    backgroundColor: "#FF0314",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
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

  /** 🔥 Lista de Categorías */
  filaCategorias: {
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardCategoria: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emoji: {
    fontSize: 22,
    marginBottom: 5,
  },
  textoCategoria: {
    color: '#333',
    fontSize: 13,
    fontWeight: "bold",
    flexShrink: 1, // 🔥 Evita que se corten palabras en pantallas pequeñas
    textAlign: "center",
    maxWidth: "90%", // 🔥 Limita el ancho del texto para evitar cortes
    ellipsizeMode: "tail",
  },

  /** 🔥 Menú Lateral */
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  menuContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 280,
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 30,
    zIndex: 1000,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#374151",
  },
  menuCerrar: {
    marginTop: 20,
    backgroundColor: "#FF0314",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
  },
  menuCerrarTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
   
  containerBanner: {
    flexDirection: 'row',  // Alinea los botones en fila
    justifyContent: 'flex-start',  // Alinea los botones al inicio sin mucho espacio entre ellos
    alignItems: 'center',  // Alinea los botones verticalmente
    width: '100%',  // Hace que el contenedor ocupe todo el ancho disponible
    paddingHorizontal: 10,  // Añade un poco de espacio en los bordes
  },
  banner: {
    paddingVertical: 10,  // Ajusta el padding vertical para el botón
    paddingHorizontal: 15,  // Ajusta el padding horizontal
    borderRadius: 5,  // Esquinas redondeadas
    marginRight: 5,  // Reduce el espacio entre los botones
    flex: 1,  // Hace que los botones ocupen todo el ancho disponible
  },
  textoBanner: {
    color: 'white',  // Color del texto
    fontSize: 16,  // Tamaño del texto
    textAlign: 'center',  // Centra el texto dentro del botón
  },
  botonVolver: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
  },
    notification: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
    },
    unread: {
      backgroundColor: '#e0f7fa',
      borderColor: '#00bcd4',
    },
    read: {
      backgroundColor: '#ffffff',
      borderColor: '#cccccc',
    },
    icon: {
      fontSize: 24,
      marginRight: 12,
    },
    iconUnread: {
      color: '#00bcd4',
    },
    iconRead: {
      color: '#aaa',
    },
    textContainer: {
      flex: 1,
    },
    message: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    date: {
      fontSize: 12,
      color: '#888',
      marginTop: 4,
    },
  });
  export default styles;