import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Datos simulados de servicios y ubicación en Cuba
const categoriasSimuladas = [
  { id: '1', nombre: 'Fontanería' },
  { id: '2', nombre: 'Electricidad' },
  { id: '3', nombre: 'Carpintería' },
  { id: '4', nombre: 'Construcción' },
  { id: '5', nombre: 'Reparación de Electrodomésticos' },
  { id: '6', nombre: 'Servicios de Limpieza' },
  { id: '7', nombre: 'Jardinería' },
  { id: '8', nombre: 'Mantenimiento de Vehículos' },
];

const provinciasCubanas = [
  { id: '1', nombre: 'La Habana' },
  { id: '2', nombre: 'Matanzas' },
  { id: '3', nombre: 'Villa Clara' },
  { id: '4', nombre: 'Santiago de Cuba' },
];

const municipiosPorProvincia = {
  'La Habana': ['Playa', 'Centro Habana', 'Habana Vieja'],
  Matanzas: ['Matanzas', 'Cárdenas', 'Varadero'],
  'Villa Clara': ['Santa Clara', 'Remedios', 'Caibarién'],
  'Santiago de Cuba': ['Santiago Centro', 'Contramaestre', 'San Luis'],
};

const PantallaNegocios = () => {
  const navigation = useNavigation();
  const [busqueda, setBusqueda] = useState('');
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const categoriasFiltradas = categoriasSimuladas.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    
    <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Text>☰ Menú</Text>
      </TouchableOpacity>
      
      <Text style={styles.titulo}>Explora Negocios</Text>

      {/* Barra de búsqueda */}
      <TextInput
        style={styles.input}
        placeholder="Buscar servicio..."
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {/* Botón de selección de provincia y municipio */}
      <TouchableOpacity style={styles.botonFiltro} onPress={() => setModalVisible(true)}>
        <Text style={styles.textoBoton}>
          {provinciaSeleccionada
            ? `${provinciaSeleccionada} - ${municipioSeleccionado || 'Selecciona municipio'}`
            : 'Seleccionar Provincia y Municipio'}
        </Text>
      </TouchableOpacity>

      {/* Modal de selección de provincia y municipio */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Selecciona una Provincia</Text>
            <FlatList
              data={provinciasCubanas}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.opcion,
                    provinciaSeleccionada === item.nombre && styles.opcionActiva,
                  ]}
                  onPress={() => setProvinciaSeleccionada(item.nombre)}
                >
                  <Text style={styles.textoOpcion}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />

            {provinciaSeleccionada ? (
              <>
                <Text style={styles.modalTitulo}>Selecciona un Municipio</Text>
                <FlatList
                  data={municipiosPorProvincia[provinciaSeleccionada]}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.opcion,
                        municipioSeleccionado === item && styles.opcionActiva,
                      ]}
                      onPress={() => {
                        setMunicipioSeleccionado(item);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.textoOpcion}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            ) : null}

            <TouchableOpacity style={styles.botonCerrar} onPress={() => setModalVisible(false)}>
              <Text style={styles.textoBoton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Lista de servicios */}
      <FlatList
        data={categoriasFiltradas}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.fila}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PantallaResultadosBusqueda', { servicio: item.nombre })}
          >
            <Text style={styles.textoCard}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#003366', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#cccccc', padding: 12, borderRadius: 8, marginBottom: 10 },
  botonFiltro: {
    padding: 12,
    backgroundColor: '#FF0314',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoBoton: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  fila: { justifyContent: 'space-between' },
  card: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
  },
  textoCard: { fontSize: 16, fontWeight: 'bold' },

  // Estilos del Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContenido: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  opcion: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  opcionActiva: { backgroundColor: '#FF0314' },
  textoOpcion: { fontSize: 16, color: '#000' },
  botonCerrar: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FF0314',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
});

export default PantallaNegocios;
