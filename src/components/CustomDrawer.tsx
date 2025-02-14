import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

const CustomDrawer = () => {
  const navigation = useNavigation();

  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>🔧 Servicios</Text>

      {/* 🏠 Inicio */}
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PantallaPrincipal')}>
        <Text style={styles.menuText}>🏠 Inicio</Text>
      </TouchableOpacity>

      {/* 🕒 Historial */}
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('HistorialUsuario')}>
        <Text style={styles.menuText}>🕒 Historial</Text>
      </TouchableOpacity>

      {/* 👤 Mi Perfil */}
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MiPerfil')}>
        <Text style={styles.menuText}>👤 Mi Perfil</Text>
      </TouchableOpacity>

      {/* ❓ Soporte */}
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Soporte')}>
        <Text style={styles.menuText}>❓ Soporte</Text>
      </TouchableOpacity>

      {/* 🚪 Cerrar Sesión */}
      <TouchableOpacity style={styles.logout} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.menuText}>🚪 Cerrar Sesión</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0314',
    textAlign: 'center',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logout: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#FF0314',
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default CustomDrawer;
