import {City} from '../models/City';
import SupabaseService from './SupabaseService';

export class CitiesService {
  private static readonly TABLE_NAME = 'cities';

  // Obtener todos los Cities
  static async obtenerTodos(): Promise<City[]> {
    return await SupabaseService.obtenerDatos<City>(this.TABLE_NAME);
  }

  // Obtener un CITY por ID
  static async obtenerPorId(id: number): Promise<City | null> {
    const city = await SupabaseService.obtenerDatos<City>(
      this.TABLE_NAME,
      '*',
      {
        id,
      },
    );
    return city.length > 0 ? city[0] : null;
  }

  // Crear un nuevo CITY
  static async crear(datos: Partial<City>): Promise<boolean> {
    return await SupabaseService.crearRegistro<City>(this.TABLE_NAME, datos);
  }

  // Actualizar un CITY por ID
  static async actualizar(id: number, datos: Partial<City>): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<City>(
      this.TABLE_NAME,
      datos,
      'id',
      id,
    );
  }

  // Eliminar un CITY por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}
