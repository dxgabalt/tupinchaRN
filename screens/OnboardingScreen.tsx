import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import styles from '../styles/stylesOnboarding'; // ✅ Import corregido

const { width } = Dimensions.get('window');

// 📌 Lista de imágenes del onboarding (rutas corregidas)
const slides = [
  { id: '1', image: require('../assets/onboarning/onboarding1.jpeg') },
  { id: '2', image: require('../assets/onboarning/onboarding2.jpeg') },
  { id: '3', image: require('../assets/onboarning/onboarding3.jpeg') },
];

// Definir tipo de navegación
type RootStackParamList = {
  Login: undefined;
  RegistroScreen: undefined;
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'Login'>;

const OnboardingScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView | null>(null);

  // 📌 Manejo del scroll para actualizar el índice
  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* 🔥 Carrusel de Imágenes */}
      {Platform.OS === 'web' ? (
        <View style={styles.slide}>
          <Image source={slides[0].image} style={styles.image} />
        </View>
      ) : (
        <Animated.FlatList
          data={slides}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false, listener: handleScroll }
          )}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image source={item.image} style={styles.image} />
            </View>
          )}
        />
      )}

      {/* 🔘 Indicadores de Progreso */}
      {Platform.OS !== 'web' && (
      <View style={styles.indicators}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index ? styles.indicatorActive : styles.indicatorInactive,
            ]}
          />
        ))}
      </View>)}

      {/* 🔥 Botones */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>🔑 Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate('RegistroScreen')}
      >
        <Text style={styles.buttonTextSecondary}>📝 Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen;
