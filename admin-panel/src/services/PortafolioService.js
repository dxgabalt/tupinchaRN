import { supabase_client } from "./supabaseClient";
import SupabaseService from "./SupabaseService";

export class PortafolioService {
  static TABLE_NAME = "portafolio_provider";

  // Obtener todos los Service
  static async obtenerTodos() {
    return await SupabaseService.obtenerDatos(this.TABLE_NAME);
  }

  // Obtener un SERVICE por ID
  static async obtenerPorId(id) {
    const service = await SupabaseService.obtenerDatos(this.TABLE_NAME, "*", { id });
    return service.length > 0 ? service[0] : null;
  }

  // Crear un nuevo SERVICE
  static async crear(datos) {
    return await SupabaseService.crearRegistro(this.TABLE_NAME, datos);
  }

  static async agregarServicio(provider_id, nuevaEspecialidad, nuevaDescripcion, imagen,servicio_id) {
    await supabase_client.from(this.TABLE_NAME).insert({
      especialidad: nuevaEspecialidad,
      provider_id: provider_id,
      descripcion: nuevaDescripcion,
      imagen: imagen,
      servicio_id: servicio_id
    });
  }

  // Actualizar un SERVICE por ID
  static async actualizar(id, datos) {
    return await SupabaseService.actualizarRegistro(this.TABLE_NAME, datos, "id", id);
  }

  // Eliminar un SERVICE por ID
  static async eliminar(id) {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }
}
