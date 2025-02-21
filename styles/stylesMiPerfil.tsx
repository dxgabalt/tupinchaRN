import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 📌 Contenedor principal */
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },

  /** 📌 Título */
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 25,
  },

  /** 📸 Foto de perfil */
  fotoPerfil: {
    width: 140, // 🔹 Más grande
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#FF0314',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },

  /** 📌 Botón de cambiar foto */
  botonFoto: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  textoBoton: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  textoBotonEditar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /** 📌 Campos del perfil */
  campoContainer: {
    width: '100%',
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 5,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  texto: {
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#E5E7EB',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  /** 📌 Botón de edición */
  botonEditar: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  /** 📌 Botón de guardar */
  botonGuardar: {
    backgroundColor: '#FF0314',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  /** 📌 Botón de volver */
  botonVolver: {
    backgroundColor: '#FF0314',
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  textoBotonVolver: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
