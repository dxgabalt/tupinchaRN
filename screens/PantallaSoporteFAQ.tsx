import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/stylesSoporteFAQ';
import { Faq } from '../models/Faq';
import Faqervice from '../services/FaqService';

const PantallaSoporteFAQ = () => {
  const navigation = useNavigation();
  const [faqActiva, setFaqActiva] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [animacionAltura] = useState(new Animated.Value(0));

  // 📌 Alternar visibilidad de respuestas con animación
  const toggleFaq = (id: string) => {
    if (faqActiva === id) {
      setFaqActiva(null);
      Animated.timing(animacionAltura, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      setFaqActiva(id);
      Animated.timing(animacionAltura, {
        toValue: 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  // 📌 Función para abrir WhatsApp de soporte
  const abrirWhatsApp = () => {
    const numero = '+12813305912';
    const mensaje = encodeURIComponent('Hola, necesito ayuda con la aplicación.');
    Linking.openURL(`https://wa.me/${numero}?text=${mensaje}`);
  };
   useEffect(() => {
      const obtenerFaqs = async () => {
        try {
          const faqs = await Faqervice.obtenerFaqs();
          setFaqs(faqs);
        } catch (error) {
          console.error("Error obteniendo servicios:", error);
        }
      };
      obtenerFaqs();
    }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>❓ Soporte y FAQ</Text>

      {/* 📝 Lista de Preguntas Frecuentes */}
      <FlatList
        data={faqs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity style={styles.preguntaContainer} onPress={() => toggleFaq(item.id)}>
              <Text style={styles.pregunta}>➜ {item.question}</Text>
            </TouchableOpacity>
            {faqActiva === item.id && (
              <Animated.View style={[styles.respuestaContainer, { maxHeight: animacionAltura }]}>
                <Text style={styles.respuesta}>💬 {item.answer}</Text>
              </Animated.View>
            )}
          </View>
        )}
      />

      {/* 📞 Sección de contacto */}
      <TouchableOpacity style={styles.botonWhatsApp} onPress={abrirWhatsApp}>
        <Text style={styles.textoBoton}>💬 Contactar Soporte (WhatsApp)</Text>
      </TouchableOpacity>

      {/* 🔙 Botón para volver */}
      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotonVolver}>⬅️ Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PantallaSoporteFAQ;