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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  preguntaContainer: {
    paddingVertical: 10,
  },
  pregunta: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  respuestaContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 5,
  },
  respuesta: {
    fontSize: 14,
    color: '#555555',
  },
  botonWhatsApp: {
    backgroundColor: '#25D366',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBoton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonVolver: {
    backgroundColor: '#FF0314',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotonVolver: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
