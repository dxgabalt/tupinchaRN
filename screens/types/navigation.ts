// Define los parámetros de cada ruta
export type RootStackParamList = {
  Onboarding: undefined;  
  Login: undefined;
  PantallaNegocios: undefined;
  RegistroScreen: undefined; 
  PantallaNotificacion: undefined;
  OlvidarContrasena: undefined;
  PantallaResultadosBusqueda: undefined;
  PantallaDetallesProveedor: undefined;
  PantallaSolicitudServicio: undefined;
  PantallaMetodosPago: undefined;
  PantallaConfirmacionPago: undefined;
  PantallaPagoExitoso: undefined;
  GestionSolicitudes: undefined;
  GestionServicios: undefined;
  PantallaHistorialUsuario: undefined;
  PantallaSoporteFAQ: undefined; 
  MiPerfil: undefined;
  PantallaDetalleSolicitud: undefined;
};
  
  // Extiende los tipos de React Navigation
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }