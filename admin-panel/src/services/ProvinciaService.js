import SupabaseService from "./SupabaseService";

export class ProvinciaService {
  static TABLE_NAME = "provincias";

  // Obtener todas las provincias
  static async obtenerTodos() {
    return await SupabaseService.obtenerDatos(this.TABLE_NAME);
  }

  // Obtener una provincia por ID
  static async obtenerPorId(id) {
    const provincia = await SupabaseService.obtenerDatos(this.TABLE_NAME, "*", {
      id,
    });
    return provincia.length > 0 ? provincia[0] : null;
  }

  // Crear una nueva provincia
  static async crear(datos) {
    return await SupabaseService.crearRegistro(this.TABLE_NAME, datos);
  }

  // Actualizar una provincia por ID
  static async actualizar(id, datos) {
    return await SupabaseService.actualizarRegistro(
      this.TABLE_NAME,
      datos,
      "id",
      id
    );
  }

  // Eliminar una provincia por ID
  static async eliminar(id) {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }
}
