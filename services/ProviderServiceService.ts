import {ProviderService} from '../models/ProviderService';
import SupabaseService from './SupabaseService';

export class ProviderServiceService {
  private static readonly TABLE_NAME = 'providerservices';

  // Obtener todos los Cities
  static async obtenerTodos(): Promise<ProviderService[]> {
    return await SupabaseService.obtenerDatos<ProviderService>(this.TABLE_NAME);
  }

  // Obtener un PROVIDERSERVICE por ID
  static async obtenerPorId(id: number): Promise<ProviderService | null> {
    const providerservice = await SupabaseService.obtenerDatos<ProviderService>(
      this.TABLE_NAME,
      '*',
      {
        id,
      },
    );
    return providerservice.length > 0 ? providerservice[0] : null;
  }

  // Crear un nuevo PROVIDERSERVICE
  static async crear(datos: Partial<ProviderService>): Promise<boolean> {
    return await SupabaseService.crearRegistro<ProviderService>(
      this.TABLE_NAME,
      datos,
    );
  }

  // Actualizar un PROVIDERSERVICE por ID
  static async actualizar(
    id: number,
    datos: Partial<ProviderService>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<ProviderService>(
      this.TABLE_NAME,
      datos,
      'id',
      id,
    );
  }

  // Eliminar un PROVIDERSERVICE por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}
