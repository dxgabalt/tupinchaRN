import SupabaseService from './SupabaseService';

export class PlanService {
  private static readonly TABLE_NAME = 'planes';

  // Obtener todos los Cities
  static async obtenerTodos(): Promise<Plan[]> {
    return await SupabaseService.obtenerDatos<Plan>(this.TABLE_NAME,"*");
  }

  // Obtener un PLAN por ID
  static async obtenerPorId(id: number): Promise<Plan | null> {
    const plan = await SupabaseService.obtenerDatos<Plan>(
      this.TABLE_NAME,
      '*',
      {
        id,
      },
    );
    return plan.length > 0 ? plan[0] : null;
  }

  // Crear un nuevo PLAN
  static async crear(datos: Partial<Plan>): Promise<boolean> {
    return await SupabaseService.crearRegistro<Plan>(
      this.TABLE_NAME,
      datos,
    );
  }

  // Actualizar un PLAN por ID
  static async actualizar(
    id: number,
    datos: Partial<Plan>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Plan>(
      this.TABLE_NAME,
      datos,
      'id',
      id,
    );
  }

  // Eliminar un PLAN por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}
