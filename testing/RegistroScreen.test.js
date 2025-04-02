// Actualización del test
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect'; // Eliminamos esta línea si está en jest.setup.js
import RegistroScreen from '../screens/RegistroScreen';

// Mock de servicios y librerías externas
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({
    canceled: false,
    assets: [{ uri: 'mock-uri' }]
  })),
}));
// Mock de navegación (si es necesario):
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));
describe('RegistroScreen', () => {
  it('se renderiza correctamente', () => {
    const { getByText } = render(<RegistroScreen />);
    expect(getByText('📝 Registro de Cuenta')).toBeTruthy();
    expect(getByText('Nombre Completo')).toBeTruthy();
  });

  it('muestra campos de proveedor al activar el toggle', () => {
    const { getByText, getByTestId } = render(<RegistroScreen />);
    const toggleProveedor = getByTestId('toggle-proveedor');
    
    fireEvent.press(toggleProveedor);
    expect(getByText('Especialidad (Ej: Fontanería, Electricidad)')).toBeTruthy();
  });

  it('valida campos obligatorios', async () => {
    const { getByText, findByText } = render(<RegistroScreen />);
    const botonRegistrar = getByText('✅ Registrarse');
    
    fireEvent.press(botonRegistrar);
    
    const mensajeError = await findByText('Todos los campos son obligatorios.');
    expect(mensajeError).toBeTruthy();
  });

  it('abre y selecciona una provincia', async () => {
    const { getByText, findByText } = render(<RegistroScreen />);
    const botonUbicacion = getByText('Seleccionar Ubicación');
    
    fireEvent.press(botonUbicacion);
    
    const tituloProvincia = await findByText('Selecciona una Provincia');
    expect(tituloProvincia).toBeTruthy();
    
    fireEvent.press(getByText('Santo Domingo'));
    
    const tituloMunicipio = await findByText('Selecciona un Municipio');
    expect(tituloMunicipio).toBeTruthy();
  });

  it('permite subir una imagen de perfil', async () => {
    const { getByText, findByText } = render(<RegistroScreen />);
    
    fireEvent.press(getByText('📷 Subir Imagen'));
    
    const imagenUri = await findByText('mock-uri');
    expect(imagenUri).toBeTruthy();
  });
});