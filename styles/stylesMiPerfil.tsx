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
    marginBottom: 20,
  },
  fotoPerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF0314',
    marginBottom: 10,
  },
  botonFoto: {
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  textoBoton: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoBotton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  campoContainer: {
    width: '90%',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  texto: {
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  botonEditar: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  botonGuardar: {
    backgroundColor: '#FF0314',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  botonVolver: {
    backgroundColor: '#FF0314',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  textoBotonVolver: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
