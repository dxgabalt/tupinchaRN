import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
  },

  /** 🔥 Menú Hamburguesa */
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 260,
    height: '100%',
    backgroundColor: '#FF0314',
    padding: 20,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuCerrar: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#003366',
    borderRadius: 8,
    alignItems: 'center',
  },
  menuCerrarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
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
    marginRight: 10,
  },
  menuIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /** 🔥 Contenedor del formulario */
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  /** 🔥 Campos de texto */
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },

  /** 🔥 Botones */
  botonAgregar: {
    backgroundColor: '#003366',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  botonSubir: {
    backgroundColor: '#FF0314',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /** 🔥 Portafolio */
  portafolioContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  imagenPortafolio: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },

  /** 🔥 Mensaje de vacío */
  textoVacio: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },

  /** 🔥 Botón de volver */
  botonVolver: {
    backgroundColor: '#CCCCCC',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotonVolver: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default styles;
