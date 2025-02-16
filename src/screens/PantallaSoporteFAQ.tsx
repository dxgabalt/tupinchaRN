import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from 'src/styles/stylesSoporteFAQ';

// 📌 Datos simulados de preguntas frecuentes
const faqsSimuladas = [
  {
    id: '1',
    pregunta: '¿Cómo puedo registrar un negocio?',
    respuesta: 'Para registrar un negocio, ve a la sección de perfil y selecciona "Registrar mi negocio".',
  },
  {
    id: '2',
    pregunta: '¿Cuáles son los métodos de pago aceptados?',
    respuesta: 'Aceptamos pagos con Transfermovil, EnZona, PayPal, Zelle, Cash App y efectivo.',
  },
  {
    id: '3',
    pregunta: '¿Cómo puedo contactar a un proveedor?',
    respuesta: 'En la pantalla de detalles del proveedor, hay un botón para contactarlo directamente.',
  },
  {
    id: '4',
    pregunta: '¿Cómo modificar mi perfil?',
    respuesta: 'Desde la sección de "Mi Perfil", puedes actualizar tus datos personales y de negocio.',
  },
  {
    id: '5',
    pregunta: '¿Cómo cancelo una solicitud de servicio?',
    respuesta: 'En la pantalla de "Historial de Pedidos", selecciona la solicitud y presiona "Cancelar".',
  },
];

const PantallaSoporteFAQ = () => {
  const navigation = useNavigation();
  const [faqActiva, setFaqActiva] = useState<string | null>(null);
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

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>❓ Soporte y FAQ</Text>

      {/* 📝 Lista de Preguntas Frecuentes */}
      <FlatList
        data={faqsSimuladas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity style={styles.preguntaContainer} onPress={() => toggleFaq(item.id)}>
              <Text style={styles.pregunta}>➜ {item.pregunta}</Text>
            </TouchableOpacity>
            {faqActiva === item.id && (
              <Animated.View style={[styles.respuestaContainer, { maxHeight: animacionAltura }]}>
                <Text style={styles.respuesta}>💬 {item.respuesta}</Text>
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