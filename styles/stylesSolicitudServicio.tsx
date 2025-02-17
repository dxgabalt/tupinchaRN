import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  botonSubir: {
    backgroundColor: '#1E3A8A',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagenesContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  imagen: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  botonEnviar: {
    backgroundColor: '#FF0314',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // 📌 Mensaje de Error si no hay `idProveedor`
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF0314',
    textAlign: 'center',
    marginTop: 50,
  },
  botonRegresar: {
    backgroundColor: '#1E3A8A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default styles;
