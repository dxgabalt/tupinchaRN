import {ProviderLocation} from '../models/ProviderLocation';
import SupabaseService from './SupabaseService';

export class CitiesService {
  private static readonly TABLE_NAME = 'providerlocations';

  // Obtener todos los Cities
  static async obtenerTodos(): Promise<ProviderLocation[]> {
    return await SupabaseService.obtenerDatos<ProviderLocation>(
      this.TABLE_NAME,
    );
  }

  // Obtener un PROVIDERLOCATION por ID
  static async obtenerPorId(id: number): Promise<ProviderLocation | null> {
    const providerlocation =
      await SupabaseService.obtenerDatos<ProviderLocation>(
        this.TABLE_NAME,
        '*',
        {
          id,
        },
      );
    return providerlocation.length > 0 ? providerlocation[0] : null;
  }

  // Crear un nuevo PROVIDERLOCATION
  static async crear(datos: Partial<ProviderLocation>): Promise<boolean> {
    return await SupabaseService.crearRegistro<ProviderLocation>(
      this.TABLE_NAME,
      datos,
    );
  }

  // Actualizar un PROVIDERLOCATION por ID
  static async actualizar(
    id: number,
    datos: Partial<ProviderLocation>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<ProviderLocation>(
      this.TABLE_NAME,
      datos,
      'id',
      id,
    );
  }

  // Eliminar un PROVIDERLOCATION por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}
