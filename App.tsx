import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Importar las pantallas
import LoginScreen from './screens/LoginScreen';
import PantallaNegocios from './screens/PantallaNegocios';
import RegistroScreen from './screens/RegistroScreen';
import OlvidarContrasenaScreen from './screens/OlvidarContrasenaScreen';
import PantallaResultadosBusqueda from './screens/PantallaResultadosBusqueda';
import PantallaDetallesProveedor from './screens/PantallaDetallesProveedor';
import PantallaSolicitudServicio from './screens/PantallaSolicitudServicio';
import PantallaMetodosPago from './screens/PantallaMetodosPago';
import PantallaConfirmacionPago from './screens/PantallaConfirmacionPago';
import PantallaPagoExitoso from './screens/PantallaPagoExitoso';
import PantallaHistorialUsuario from './screens/PantallaHistorialUsuario';
import PantallaSoporteFAQ from './screens/PantallaSoporteFAQ';
import MiPerfilScreen from './screens/MiPerfilScreen';
import PantallaDetalleSolicitud from './screens/PantallaDetalleSolicitud';
import PantallaGestionSolicitudes from './screens/proveedores/GestionSolicitudes';
import PantallaGestionServicios from './screens/proveedores/PantallaGestionServicios';
import OnboardingScreen from './screens/OnboardingScreen';

const Stack = createStackNavigator();

/** 🔥 Configuración del StackNavigator */
const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="PantallaNegocios" component={PantallaNegocios} />
      <Stack.Screen name="RegistroScreen" component={RegistroScreen} />
      <Stack.Screen
        name="OlvidarContrasena"
        component={OlvidarContrasenaScreen}
      />
      <Stack.Screen
        name="PantallaResultadosBusqueda"
        component={PantallaResultadosBusqueda}
      />
      <Stack.Screen
        name="PantallaDetallesProveedor"
        component={PantallaDetallesProveedor}
      />
      <Stack.Screen
        name="PantallaSolicitudServicio"
        component={PantallaSolicitudServicio}
      />
      <Stack.Screen
        name="PantallaMetodosPago"
        component={PantallaMetodosPago}
      />
      <Stack.Screen
        name="PantallaConfirmacionPago"
        component={PantallaConfirmacionPago}
      />
      <Stack.Screen
        name="PantallaPagoExitoso"
        component={PantallaPagoExitoso}
      />     
       <Stack.Screen
        name="GestionSolicitudes"
        component={PantallaGestionSolicitudes}
      />
      <Stack.Screen
        name="GestionServicios"
        component={PantallaGestionServicios}
      />
      <Stack.Screen
        name="PantallaHistorialUsuario"
        component={PantallaHistorialUsuario}
      />
      <Stack.Screen name="PantallaSoporteFAQ" component={PantallaSoporteFAQ} />
      <Stack.Screen name="MiPerfil" component={MiPerfilScreen} />
      <Stack.Screen
        name="PantallaDetalleSolicitud"
        component={PantallaDetalleSolicitud}
      />
    </Stack.Navigator>
  );
};

/** 🔥 Contenedor principal de la aplicación */
export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}