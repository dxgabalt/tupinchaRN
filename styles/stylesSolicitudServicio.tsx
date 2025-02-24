import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: '100%',
    backgroundColor: '#FF0314',
    paddingVertical: 30,
    paddingHorizontal: 20,
    zIndex: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  menuCerrar: {
    marginTop: 20,
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  menuCerrarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /** 🔥 Fondo Oscuro cuando el Menú está Abierto */
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },

  /** 🔥 Encabezado */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#003366',
    justifyContent: 'space-between',
  },
  menuButton: {
    backgroundColor: '#FF0314',
    padding: 12,
    borderRadius: 10,
    elevation: 5,
  },
  menuIcon: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /** 🔥 Formulario */
  formContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },

  /** 🔥 Selección de Fecha */
  botonSubir: {
    backgroundColor: '#FF0314',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  textoFecha: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },

  /** 🔥 Imágenes */
  imagenesContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  imagenWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  imagen: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  botonEliminarImagen: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF0314',
    borderRadius: 12,
    padding: 4,
  },
  textoEliminar: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  /** 🔥 Botones */
  botonEnviar: {
    backgroundColor: '#003366',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
  },
  botonRegresar: {
    backgroundColor: '#D1D5DB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

});

export default styles;
