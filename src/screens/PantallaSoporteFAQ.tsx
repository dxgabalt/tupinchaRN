import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 📌 Datos simulados de preguntas frecuentes
const faqsSimuladas = [
  { id: '1', pregunta: '¿Cómo puedo registrar un negocio?', respuesta: 'Para registrar un negocio, ve a la sección de perfil y selecciona "Registrar mi negocio".' },
  { id: '2', pregunta: '¿Cuáles son los métodos de pago aceptados?', respuesta: 'Aceptamos pagos con tarjeta de crédito, PayPal y transferencias bancarias.' },
  { id: '3', pregunta: '¿Cómo puedo contactar a un proveedor?', respuesta: 'En la pantalla de detalles del proveedor, hay un botón para contactarlo directamente.' },
];

const PantallaSoporteFAQ = () => {
  const navigation = useNavigation();
  const [faqs, setFaqs] = useState(faqsSimuladas);
  const [faqActiva, setFaqActiva] = useState<string | null>(null);

  // 📌 Alternar visibilidad de respuestas
  const toggleFaq = (id: string) => {
    setFaqActiva(faqActiva === id ? null : id);
  };

  // 📌 Función para abrir WhatsApp de soporte
  const abrirWhatsApp = () => {
    const numero = '+50588887777';
    const mensaje = encodeURIComponent('Hola, necesito ayuda con la aplicación.');
    Linking.openURL(`https://wa.me/${numero}?text=${mensaje}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>❓ Soporte y FAQ</Text>

      {/* 📝 Lista de Preguntas Frecuentes */}
      <FlatList
        data={faqs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleFaq(item.id)}>
              <Text style={styles.pregunta}>➜ {item.pregunta}</Text>
            </TouchableOpacity>
            {faqActiva === item.id && <Text style={styles.respuesta}>💬 {item.respuesta}</Text>}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#003366', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginBottom: 10 },
  pregunta: { fontSize: 16, fontWeight: 'bold' },
  respuesta: { fontSize: 14, color: '#555', marginTop: 5 },
  botonWhatsApp: { backgroundColor: '#25D366', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  textoBoton: { fontSize: 16, color: '#ffffff', fontWeight: 'bold' },
  botonVolver: { backgroundColor: '#ccc', padding: 10, borderRadius: 8, alignItems: 'center' },
  textoBotonVolver: { fontSize: 14, color: '#000', fontWeight: 'bold' },
});

export default PantallaSoporteFAQ;
