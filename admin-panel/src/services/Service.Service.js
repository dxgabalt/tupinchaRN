import { supabase_client } from "./supabaseClient";
import SupabaseService from "./SupabaseService";

export class ServiceService {
  static TABLE_NAME = "services";

  // Obtener todos los Service
  static async obtenerTodos() {
    return await SupabaseService.obtenerDatos(this.TABLE_NAME);
  }

  // Obtener un SERVICE por ID
  static async obtenerPorId(id) {
    const service = await SupabaseService.obtenerDatos(this.TABLE_NAME, "*", {
      id,
    });
    return service.length > 0 ? service[0] : null;
  }

  // Crear un nuevo SERVICE
  static async crear(datos) {
    return await SupabaseService.crearRegistro(this.TABLE_NAME, datos);
  }

  static async agregarServicio(provider_id, nuevaEspecialidad, nuevaDescripcion, imagen) {
    const { data } = await supabase_client
      .from("services")
      .insert({
        category: nuevaEspecialidad,
        imagen: imagen,
      })
      .select();

    const service = data ?? null;
    const service_id = Array.isArray(service) && service.length > 0 ? service[0].id : 0;

    return await SupabaseService.crearRegistro("provider_services", {
      provider_id: provider_id,
      service_id: service_id,
      description: nuevaDescripcion,
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
