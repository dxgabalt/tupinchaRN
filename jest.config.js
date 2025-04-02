module.exports = {
  preset: 'react-native',
  setupFiles: [
    './jest.setup.js'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|react-native-url-polyfill)/)'
  ],
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/@react-native-async-storage/async-storage.js',
  }
};