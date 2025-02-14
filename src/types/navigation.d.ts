import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  LoginScreen: undefined;
  PantallaNegocios: undefined;
  RegistroScreen: undefined;
  OlvidarContrasenaScreen: undefined;
  PantallaConfirmacionPago: undefined;
  PantallaHistorialUsuario: undefined;
  PantallaDetallesProveedor: {idProveedor: string};
  PantallaSolicitudServicio: {idProveedor: string};
  PantallaMetodosPago: undefined;
  PantallaResultadosBusqueda: {servicio: string};
  PantallaPagoExitoso: undefined;
};

export type StackNavigation = StackNavigationProp<RootStackParamList>;
