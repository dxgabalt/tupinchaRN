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
  descripcion: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  botonRecuperar: {
    backgroundColor: '#FF0314',
    paddingVertical: 14,
    paddingHorizontal: 20,
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
