import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },

  /** 🔥 Título Principal */
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003366',
    marginBottom: 15,
  },

  /** 🔥 Contenedor de Información */
  infoContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 20,
  },

  /** 🔥 Etiquetas */
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  valor: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },

  /** 🔥 Subtítulo */
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
    textAlign: 'center',
  },

  /** 💳 Métodos de Pago */
  botonMetodo: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  textoMetodo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  /** 💳 Método de Pago Seleccionado */
  metodoSeleccionado: {
    backgroundColor: '#FF0314',
    borderColor: '#FF0314',
  },

  /** 📌 Botón Confirmar */
  botonConfirmar: {
    backgroundColor: '#003366',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default styles;