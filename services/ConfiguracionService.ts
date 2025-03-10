import { Configuracion } from '../models/Configuracion';
import SupabaseService from './SupabaseService';

export class ConfiguracionService {
  private static readonly TABLE_NAME = 'configuraciones';

  // Obtener todos los Cities
  static async obtenerTodos(param:{}): Promise<Configuracion[]> {
    return await SupabaseService.obtenerDatos<Configuracion>(this.TABLE_NAME,"*",param);
  }

  // Obtener un CONFIGURACION por ID
  static async obtenerPorId(id: number): Promise<Configuracion | null> {
    const configuracion = await SupabaseService.obtenerDatos<Configuracion>(
      this.TABLE_NAME,
      '*',
      {
        id,
      },
    );
    return configuracion.length > 0 ? configuracion[0] : null;
  }

  // Crear un nuevo CONFIGURACION
  static async crear(datos: Partial<Configuracion>): Promise<boolean> {
    return await SupabaseService.crearRegistro<Configuracion>(
      this.TABLE_NAME,
      datos,
    );
  }

  // Actualizar un CONFIGURACION por ID
  static async actualizar(
    id: number,
    datos: Partial<Configuracion>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Configuracion>(
      this.TABLE_NAME,
      datos,
      'id',
      id,
    );
  }

  // Eliminar un CONFIGURACION por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}
