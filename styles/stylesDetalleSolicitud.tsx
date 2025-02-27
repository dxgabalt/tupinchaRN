import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },

  /** 🔥 Título Principal */
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 20,
  },

  /** 🔥 Estado de la Solicitud */
  estado: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    width: '60%',
    alignSelf: 'center',
  },

  /** 🔥 Colores según el Estado */
  pendiente: {
    backgroundColor: '#FFBA08',
    color: '#663C00',
  },
  completado: {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
  },

  /** 🔥 Imagen del Servicio */
  imagenServicio: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  /** 🔥 Información del Servicio */
  servicio: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'justify',
    lineHeight: 22,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  fecha: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    marginBottom: 20,
  },

  /** 🔥 Tarjeta del Proveedor */
  cardProveedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    elevation: 5,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  /** 🔥 Imagen del Proveedor */
  imagenProveedor: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },

  /** 🔥 Nombre y Teléfono del Proveedor */
  nombreProveedor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  telefonoProveedor: {
    fontSize: 16,
    color: '#555555',
  },

  /** 🔥 Botón de Contacto */
  botonContactar: {
    backgroundColor: '#FF0314',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /** 🔥 Botón de Volver */
  botonVolver: {
    backgroundColor: '#CCCCCC',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  textoBotonVolver: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /** 🔥 Menú Lateral */
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 280,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  /** 🔥 Fondo Oscuro cuando el Menú está Abierto */
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },

  /** 🔥 Botones dentro del Menú */
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
  },

  /** 🔥 Botón de Cerrar Menú */
  menuCerrar: {
    marginTop: 20,
    backgroundColor: '#FF0314',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  menuCerrarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /** 🔥 Encabezado con Menú */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E3A8A',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  menuButton: {
    marginRight: 10,
  },
  menuIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});

export default styles;
