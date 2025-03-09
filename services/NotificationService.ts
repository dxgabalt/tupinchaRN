import { Notification } from '../models/Notification';
import { AuthService } from './AuthService';
import SupabaseService from './SupabaseService';

export class NotificationsService {
  private static readonly TABLE_NAME = 'notifications';

  // Obtener todos los Notifications
  static async obtenerTodos(): Promise<Notification[]> {
    try {
      const perfil = await AuthService.obtenerPerfil();
      console.log(perfil.user_id);
      const notifications = await SupabaseService.obtenerDatos<Notification>(this.TABLE_NAME,'*',{user_id:perfil.user_id});
      return notifications;
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      throw new Error("No se pudieron obtener las notificaciones");
    }
  }

  // Obtener un NOTIFICATION por ID
  static async obtenerPorId(id: number): Promise<Notification | null> {
    try {
      const notification = await SupabaseService.obtenerDatos<Notification>(
        this.TABLE_NAME,
        '*',
        { id },
      );
      return notification.length > 0 ? notification[0] : null;
    } catch (error) {
      console.error(`Error al obtener notificación con ID ${id}:`, error);
      throw new Error(`No se pudo obtener la notificación con ID ${id}`);
    }
  }

  // Crear un nuevo NOTIFICATION
  static async crear(datos: Partial<Notification>): Promise<boolean> {
    try {
      const result = await SupabaseService.crearRegistro<Notification>(this.TABLE_NAME, datos);
      return result;
    } catch (error) {
      console.error("Error al crear notificación:", error);
      throw new Error("No se pudo crear la notificación");
    }
  }

  // Actualizar un NOTIFICATION por ID
  static async actualizar(id: number, datos: Partial<Notification>): Promise<boolean> {
    try {
      const result = await SupabaseService.actualizarRegistro<Notification>(
        this.TABLE_NAME,
        datos,
        'id',
        id,
      );
      return result;
    } catch (error) {
      console.error(`Error al actualizar la notificación con ID ${id}:`, error);
      throw new Error(`No se pudo actualizar la notificación con ID ${id}`);
    }
  }

  // Eliminar un NOTIFICATION por ID
  static async eliminar(id: number): Promise<boolean> {
    try {
      const result = await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
      return result;
    } catch (error) {
      console.error(`Error al eliminar la notificación con ID ${id}:`, error);
      throw new Error(`No se pudo eliminar la notificación con ID ${id}`);
    }
  }
}
