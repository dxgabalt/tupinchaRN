import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /** 🔥 Menú Hamburguesa */
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
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
  },
  menuButton: {
    marginRight: 10,
  },
  menuIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  tituloHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  imagenPortada: {
    width: '100%',
    height: 220,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  /** 🔥 Perfil del Proveedor */
  perfilContainer: {
    alignItems: 'center',
    marginTop: -50,
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingVertical: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  imagenPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF',
    marginBottom: 10,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
    textAlign: 'center',
  },
  especialidad: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF0314',
    backgroundColor: '#FFF2F2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 5,
  },
  ubicacion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginTop: 5,
  },
  calificacion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 8,
  },

  /** 🔥 Sección Sobre el Servicio */
  detallesContainer: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    marginTop: 15,
  },
  tituloSeccion: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#FF0314',
    paddingBottom: 4,
  },
  descripcion: {
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 24,
    textAlign: 'justify',
  },

  /** 🔥 Botones de Acción */
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
  },
  botonContacto: {
    flex: 1,
    backgroundColor: '#003366',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  botonSolicitar: {
    flex: 1,
    backgroundColor: '#FF0314',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default styles;
