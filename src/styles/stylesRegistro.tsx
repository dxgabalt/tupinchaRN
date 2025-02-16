import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    paddingVertical: 30,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    width: '90%',
    marginBottom: 15,
  },
  contenedorImagen: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  imagenPerfil: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  textoImagen: {
    color: '#6B7280',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
  },
  botonRegistrar: {
    backgroundColor: '#FF0314',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: 'bold',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});

export default styles;
