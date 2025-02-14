import {AppRegistry} from 'react-native';
import React from 'react';
import App from './App';
import appName from './app.json';
import {createRoot} from 'react-dom/client';

// Registra la app
AppRegistry.registerComponent(appName, () => App);

const rootTag = document.getElementById('root');
if (rootTag) {
  createRoot(rootTag).render(<App />);
}
