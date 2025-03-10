import SupabaseService from "./SupabaseService";

export class ConfiguracionService {
  static TABLE_NAME = "configuraciones";

  // Obtener todas las configuracions
  static async obtenerTodos() {
    return await SupabaseService.obtenerDatos(this.TABLE_NAME);
  }

  // Obtener una configuracion por ID
  static async obtenerPorId(id) {
    const configuracion = await SupabaseService.obtenerDatos(this.TABLE_NAME, "*", {
      id,
    });
    return configuracion.length > 0 ? configuracion[0] : null;
  }

  // Crear una nueva configuracion
  static async crear(datos) {
    return await SupabaseService.crearRegistro(this.TABLE_NAME, datos);
  }

  // Actualizar una configuracion por ID
  static async actualizar(id, datos) {
    return await SupabaseService.actualizarRegistro(
      this.TABLE_NAME,
      datos,
      "id",
      id
    );
  }

  // Eliminar una configuracion por ID
  static async eliminar(id) {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }
}
