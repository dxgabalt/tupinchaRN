import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
  },

  /** 🔥 Encabezado */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1E3A8A',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 10,
    borderRadius: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bienvenida: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ubicacion: {
    fontSize: 14,
    color: '#FFFFFF',
  },

  /** 🔍 Barra de Búsqueda */
  barraBusqueda: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  /** 🔥 Lista de Negocios */
  listaNegocios: {
    flex: 1,
    flexGrow: 1,
    paddingBottom: 20,
  },

  /** 🔥 Tarjetas de Negocios */
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagen: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#EEEEEE',
  },
  infoContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 3,
  },
  descripcion: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  ubicacion: {
    fontSize: 13,
    color: '#888',
  },
  calificacion: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 3,
  },

  /** 🔥 Texto cuando no hay resultados */
  textoVacio: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },

  /** 🔥 Menú Lateral */
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
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
    zIndex: 1000,
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
  containerDescription: {
    height: 150, // Define una altura fija o usa porcentajes como '40%'
    marginVertical: 10,
  },

  scrollViewContent: {
    // Estilos para el contenido dentro del ScrollView
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
});

export default styles;
