import SupabaseService from "./SupabaseService";

export class PlanService {
  static TABLE_NAME = "planes";

  // Obtener todas las plans
  static async obtenerTodos() {
    return await SupabaseService.obtenerDatos(this.TABLE_NAME);
  }

  // Obtener una plan por ID
  static async obtenerPorId(id) {
    const plan = await SupabaseService.obtenerDatos(this.TABLE_NAME, "*", {
      id,
    });
    return plan.length > 0 ? plan[0] : null;
  }

  // Crear una nueva plan
  static async crear(datos) {
    return await SupabaseService.crearRegistro(this.TABLE_NAME, datos);
  }

  // Actualizar una plan por ID
  static async actualizar(id, datos) {
    return await SupabaseService.actualizarRegistro(
      this.TABLE_NAME,
      datos,
      "id",
      id
    );
  }

  // Eliminar una plan por ID
  static async eliminar(id) {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }
}
