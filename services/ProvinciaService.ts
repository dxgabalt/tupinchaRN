import { Provincia } from '../models/Provincia';
import SupabaseService from './SupabaseService';

export class ProvinciaService {
  private static readonly TABLE_NAME = 'provincias';

  // Obtener todos los Cities
  static async obtenerTodos(): Promise<Provincia[]> {
    return await SupabaseService.obtenerDatos<Provincia>(this.TABLE_NAME);
  }

  // Obtener un PROVINCIA por ID
  static async obtenerPorId(id: number): Promise<Provincia | null> {
    const provincia = await SupabaseService.obtenerDatos<Provincia>(
      this.TABLE_NAME,
      '*',
      {
        id,
      },
    );
    return provincia.length > 0 ? provincia[0] : null;
  }

  // Crear un nuevo PROVINCIA
  static async crear(datos: Partial<Provincia>): Promise<boolean> {
    return await SupabaseService.crearRegistro<Provincia>(
      this.TABLE_NAME,
      datos,
    );
  }

  // Actualizar un PROVINCIA por ID
  static async actualizar(
    id: number,
    datos: Partial<Provincia>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Provincia>(
      this.TABLE_NAME,
      datos,
      'id',
      id,
    );
  }

  // Eliminar un PROVINCIA por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}
