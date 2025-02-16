import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /** 🔥 Contenedor Principal */
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },

  /** 🔥 Título */
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
    textAlign: 'center',
  },

  /** 🔥 Barra de Búsqueda */
  barraBusqueda: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
  },

  /** 🔥 Categorías de búsqueda */
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#FF0314',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  /** 🔥 Tarjetas de Negocios */
  card: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imagen: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  descripcion: {
    fontSize: 14,
    color: '#555',
  },
  ubicacion: {
    fontSize: 14,
    color: '#777',
  },
  calificacion: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },

  /** 🔥 Texto cuando no hay resultados */
  textoVacio: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
});


export default styles;
