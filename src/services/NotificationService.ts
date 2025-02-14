import {Notification} from 'src/models/Notification';
import SupabaseService from './SupabaseService';

export class NotificationsService {
  private static readonly TABLE_NAME = 'notifications';

  // Obtener todos los Notifications
  static async obtenerTodos(): Promise<Notification[]> {
    return await SupabaseService.obtenerDatos<Notification>(this.TABLE_NAME);
  }

  // Obtener un NOTIFICATION por ID
  static async obtenerPorId(id: number): Promise<Notification | null> {
    const notification = await SupabaseService.obtenerDatos<Notification>(
      this.TABLE_NAME,
      '*',
      {
        id,
      },
    );
    return notification.length > 0 ? notification[0] : null;
  }

  // Crear un nuevo NOTIFICATION
  static async crear(datos: Partial<Notification>): Promise<boolean> {
    return await SupabaseService.crearRegistro<Notification>(
      this.TABLE_NAME,
      datos,
    );
  }

  // Actualizar un NOTIFICATION por ID
  static async actualizar(
    id: number,
    datos: Partial<Notification>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Notification>(
      this.TABLE_NAME,
      datos,
      'id',
      id,
    );
  }

  // Eliminar un NOTIFICATION por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}
