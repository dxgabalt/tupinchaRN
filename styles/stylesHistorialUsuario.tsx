import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },

  /** 🔥 Título */
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003366',
    marginBottom: 15,
  },

  /** 🔍 Barra de Búsqueda */
  barraBusqueda: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 15,
  },
  inputBusqueda: {
    fontSize: 16,
    color: '#333',
  },

  /** 🔍 Filtros */
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  botonFiltro: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botonFiltroActivo: {
    backgroundColor: '#FF0314',
  },
  textoFiltro: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  /** 🔄 Botón Actualizar */
  botonActualizar: {
    backgroundColor: '#003366',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /** 📌 Tarjetas de Pedidos */
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagenServicio: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  textosCard: {
    marginLeft: 10,
    flex: 1,
  },
  servicio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  proveedor: {
    fontSize: 14,
    color: '#555',
  },
  estadoTexto: {
    fontWeight: 'bold',
  },
  fecha: {
    fontSize: 14,
    color: '#555',
  },
});

export default styles;
