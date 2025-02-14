import {Service} from 'src/models/Service';
import SupabaseService from './SupabaseService';

export class ServiceService {
  private static readonly TABLE_NAME = 'services';

  // Obtener todos los Service
  static async obtenerTodos(): Promise<Service[]> {
    return await SupabaseService.obtenerDatos<Service>(this.TABLE_NAME);
  }

  // Obtener un SERVICE por ID
  static async obtenerPorId(id: number): Promise<Service | null> {
    const service = await SupabaseService.obtenerDatos<Service>(
      this.TABLE_NAME,
      '*',
      {
        id,
      },
    );
    return service.length > 0 ? service[0] : null;
  }

  // Crear un nuevo SERVICE
  static async crear(datos: Partial<Service>): Promise<boolean> {
    return await SupabaseService.crearRegistro<Service>(this.TABLE_NAME, datos);
  }

  // Actualizar un SERVICE por ID
  static async actualizar(
    id: number,
    datos: Partial<Service>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Service>(
      this.TABLE_NAME,
      datos,
      'id',
      id,
    );
  }

  // Eliminar un SERVICE por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}
