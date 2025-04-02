jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => ({
  create: jest.fn().mockImplementation((styles) => styles),
  hairlineWidth: 1,
  absoluteFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
