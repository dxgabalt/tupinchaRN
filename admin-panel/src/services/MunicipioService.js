import SupabaseService from "./SupabaseService";

export class MunicipioService {
  static TABLE_NAME = "municipios";

  // Obtener todos los municipios
  static async obtenerTodos(param) {
    return await SupabaseService.obtenerDatos(this.TABLE_NAME, "*", param);
  }

  // Obtener un municipio por ID
  static async obtenerPorId(id) {
    const municipio = await SupabaseService.obtenerDatos(this.TABLE_NAME, "*", { id });
    return municipio.length > 0 ? municipio[0] : null;
  }

  // Crear un nuevo municipio
  static async crear(datos) {
    return await SupabaseService.crearRegistro(this.TABLE_NAME, datos);
  }

  // Actualizar un municipio por ID
  static async actualizar(id, datos) {
    return await SupabaseService.actualizarRegistro(this.TABLE_NAME, datos, "id", id);
  }

  // Eliminar un municipio por ID
  static async eliminar(id) {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }
}
