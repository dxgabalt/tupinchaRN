import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Importamos el menú lateral
import CustomDrawer from '../components/CustomDrawer';

// Importamos todas las pantallas
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import OlvidarContrasenaScreen from '../screens/OlvidarContrasenaScreen';
import PantallaNegocios from '../screens/PantallaNegocios';
import PantallaResultadosBusqueda from '../screens/PantallaResultadosBusqueda';
import PantallaDetallesProveedor from '../screens/PantallaDetallesProveedor';
import PantallaSolicitudServicio from '../screens/PantallaSolicitudServicio';
import PantallaMetodosPago from '../screens/PantallaMetodosPago';
import PantallaConfirmacionPago from '../screens/PantallaConfirmacionPago';
import PantallaPagoExitoso from '../screens/PantallaPagoExitoso';
import PantallaHistorialUsuario from '../screens/PantallaHistorialUsuario';
import PantallaDetalleSolicitud from '../screens/PantallaDetalleSolicitud';
import PantallaSoporteFAQ from '../screens/PantallaSoporteFAQ';
import MiPerfilScreen from '../screens/MiPerfilScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/** 🔥 BOTTOM TABS: Navegación principal */
const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#FF0314',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { backgroundColor: '#fff', height: 60, paddingBottom: 5 },
    }}
  >
    <Tab.Screen name="Inicio" component={PantallaNegocios} />
    <Tab.Screen name="Historial" component={PantallaHistorialUsuario} />
    <Tab.Screen name="Perfil" component={MiPerfilScreen} />
  </Tab.Navigator>
);

/** 🔥 DRAWER NAVIGATOR: Menú lateral */
const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false, // Oculta el header en todas las pantallas
      drawerActiveTintColor: '#FF0314',
      drawerInactiveTintColor: 'gray',
    }}
  >
    <Drawer.Screen name="PantallaNegocios" component={BottomTabNavigator} />
    <Drawer.Screen name="MiPerfil" component={MiPerfilScreen} />
    <Drawer.Screen name="HistorialUsuario" component={PantallaHistorialUsuario} />
    <Drawer.Screen name="Soporte" component={PantallaSoporteFAQ} />
  </Drawer.Navigator>
);

/** 🔥 STACK NAVIGATOR: Autenticación y App */
const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Registro" component={RegistroScreen} />
    <Stack.Screen name="OlvidarContrasena" component={OlvidarContrasenaScreen} />
    <Stack.Screen name="PantallaNegocios" component={DrawerNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="PantallaResultadosBusqueda" component={PantallaResultadosBusqueda} />
    <Stack.Screen name="PantallaDetallesProveedor" component={PantallaDetallesProveedor} />
    <Stack.Screen name="PantallaSolicitudServicio" component={PantallaSolicitudServicio} />
    <Stack.Screen name="PantallaMetodosPago" component={PantallaMetodosPago} />
    <Stack.Screen name="PantallaConfirmacionPago" component={PantallaConfirmacionPago} />
    <Stack.Screen name="PantallaPagoExitoso" component={PantallaPagoExitoso} />
    <Stack.Screen name="PantallaDetalleSolicitud" component={PantallaDetalleSolicitud} />
  </Stack.Navigator>
);

/** 🔥 NAVEGACIÓN PRINCIPAL */
const Navigation = () => (
  <NavigationContainer>
    <StackNavigator />
  </NavigationContainer>
);

export default Navigation;
