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
  estado: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 8,
    marginBottom: 15,
    width: '50%',
    alignSelf: 'center',
  },
  pendiente: {
    backgroundColor: '#FFBA08',
    color: '#663C00',
  },
  completado: {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
  },
  imagenServicio: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  servicio: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 10,
  },
  fecha: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardProveedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  imagenProveedor: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  nombreProveedor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  telefonoProveedor: {
    fontSize: 16,
    color: '#333333',
  },
  botonContactar: {
    backgroundColor: '#FF0314',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonVolver: {
    backgroundColor: '#CCCCCC',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonVolver: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
