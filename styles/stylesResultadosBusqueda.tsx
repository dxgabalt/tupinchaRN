import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1, // 🔹 Se asegura de que ocupe toda la pantalla
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    paddingBottom: 10, // 🔹 Evita espacios vacíos al final
  },

  /** 🔥 Título */
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
    textAlign: 'center',
  },

  /** 🔍 Barra de Búsqueda */
  barraBusqueda: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
    elevation: 2,
  },
  input: {
    fontSize: 15,
    color: '#333',
  },

  /** 🔥 Contenedor de Categorías */
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E63946',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    margin: 5,
    minWidth: 90,
    height: 34,
    justifyContent: 'center',
    elevation: 1,
  },

  chipSeleccionado: {
    backgroundColor: '#FF8C00',
    borderWidth: 1,
    borderColor: '#FFA500',
  },

  chipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 3,
  },

  /** 🔥 Lista de Negocios */
  listaNegocios: {
    flex: 1, // 🔹 Se asegura que la lista ocupe todo el espacio
    alignSelf: 'stretch',
  },

  /** 🔥 Tarjetas de Negocios */
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  imagen: {
    width: 80, // 🔹 Tamaño aumentado para mejorar visibilidad
    height: 80,
    borderRadius: 8,
    marginRight: 10,
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
    fontSize: 13,
    color: '#555',
    marginBottom: 3,
  },

  ubicacion: {
    fontSize: 16,
    color: '#FFFF',
  },

  calificacion: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 3,
  },

  /** 🔥 Texto cuando no hay resultados */
  textoVacio: {
    textAlign: 'center',
    fontSize: 15,
    color: '#777',
    marginTop: 15,
  },

    /** 🔥 Encabezado */
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
      backgroundColor: '#FF0314',
    },
    menuButton: {
      padding: 12,
      borderRadius: 10,
    },
    menuIcon: {
      fontSize: 22,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },

    bienvenida: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
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
    paddingVertical: 30,
    zIndex: 1000,
    elevation: 10,
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
});

export default styles;
