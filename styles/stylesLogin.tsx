import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },

  /** 🔥 Título */
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
  },

  /** 🔥 Campos de Entrada */
  input: {
    width: '100%',
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    fontSize: 16,
    marginBottom: 15,
  },

  /** 🔥 Botón de Iniciar Sesión */
  boton: {
    width: '100%',
    backgroundColor: '#FF0314',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /** 🔗 Link de "Olvidaste tu contraseña" y "Registrarse" */
  link: {
    fontSize: 16,
    color: '#FF0314',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
});

export default styles;
