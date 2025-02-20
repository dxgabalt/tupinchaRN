import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },

  /** 🔥 Encabezado */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#003366',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bienvenida: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ubicacion: {
    fontSize: 16,
    color: '#FFD700',
  },

  /** 🔥 Botón Menú Hamburguesa */
  menuButton: {
    backgroundColor: '#FF0314',
    padding: 12,
    borderRadius: 10,
    elevation: 4,
  },
  menuIcon: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  /** 🔥 Fondo Oscuro cuando el Menú está Abierto */
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Oscurece el fondo
    zIndex: 999,  // Asegura que esté sobre todo
  },

  /** 🔥 Menú Lateral (AHORA FUNCIONAL) */
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 280,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 30,
    zIndex: 1000,  // 🔥 AHORA SE MUESTRA ENCIMA
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
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
  menuCerrar: {
    marginTop: 20,
    backgroundColor: '#FF0314',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  menuCerrarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /** 🔥 Barra de Búsqueda */
  barraBusqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 3,
  },
  iconoBusqueda: {
    fontSize: 18,
    marginRight: 8,
    color: '#555',
  },
  inputBusqueda: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    maxHeight: 170, // Esto limita el tamaño máximo del ScrollView
    overflow: 'hidden',
  },
  /** 🔥 Botón de Filtro */
  botonFiltro: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FF0314',
    alignItems: 'center',
    elevation: 3,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /** 🔥 Modal de Ubicación */
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContenido: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#1E3A8A',
  },
  opcion: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 6,
    backgroundColor: '#E5E7EB',
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
  },
  opcionActiva: {
    backgroundColor: '#FF0314',
  },
  textoOpcion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  botonCerrar: {
    marginTop: 12,
    paddingVertical: 14,
    backgroundColor: '#FF0314',
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },

  /** 🔥 Categorías */
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
  },
  emoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  textoCategoria: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  /** 🔥 Botón "Ver más" */
  botonVerMas: {
    marginTop: 10,
    paddingVertical: 12,
    backgroundColor: '#003366',
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
    elevation: 3,
  },
  textoBotonVerMas: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /** 🔥 Banner Promocional */
  banner: {
    marginTop: 30,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 15,
  },
  imagenBanner: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  textoBanner: {
    position: 'absolute',
    bottom: 20,
    top: 120,
    left: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0314',
  },
});

export default styles;
