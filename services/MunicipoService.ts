import {Municipio} from '../models/Municipio';
import SupabaseService from './SupabaseService';

export class CitiesService {
  private static readonly TABLE_NAME = 'municipios';

  // Obtener todos los Cities
  static async obtenerTodos(): Promise<Municipio[]> {
    return await SupabaseService.obtenerDatos<Municipio>(this.TABLE_NAME);
  }

  // Obtener un MUNICIPIO por ID
  static async obtenerPorId(id: number): Promise<Municipio | null> {
    const municipio = await SupabaseService.obtenerDatos<Municipio>(
      this.TABLE_NAME,
      '*',
      {
        id,
      },
    );
    return municipio.length > 0 ? municipio[0] : null;
  }

  // Crear un nuevo MUNICIPIO
  static async crear(datos: Partial<Municipio>): Promise<boolean> {
    return await SupabaseService.crearRegistro<Municipio>(
      this.TABLE_NAME,
      datos,
    );
  }

  // Actualizar un MUNICIPIO por ID
  static async actualizar(
    id: number,
    datos: Partial<Municipio>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Municipio>(
      this.TABLE_NAME,
      datos,
      'id',
      id,
    );
  }

  // Eliminar un MUNICIPIO por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}
