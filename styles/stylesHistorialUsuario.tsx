import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 20,
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  botonFiltro: {
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  botonFiltroActivo: {
    backgroundColor: '#FF0314',
  },
  textoFiltro: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    alignItems: 'center',
  },
  imagenServicio: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  textosCard: {
    flex: 1,
  },
  servicio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  proveedor: {
    fontSize: 16,
    color: '#333333',
  },
  estado: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  estadoTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF0314',
  },
  fecha: {
    fontSize: 14,
    color: '#777777',
  },
  textoVacio: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default styles;
