import { Portafolio } from "../models/Portafolio";
import { supabase_client } from "./supabaseClient";
import SupabaseService from "./SupabaseService";

export class PortafolioService {
  private static readonly TABLE_NAME = "portafolio_provider";

  // Obtener todos los Service
  static async obtenerTodos(): Promise<Portafolio[]> {
    return await SupabaseService.obtenerDatos<Portafolio>(this.TABLE_NAME);
  }

  // Obtener un SERVICE por ID
  static async obtenerPorId(id: number): Promise<Portafolio | null> {
    const service = await SupabaseService.obtenerDatos<Portafolio>(
      this.TABLE_NAME,
      "*",
      {
        id,
      }
    );
    return service.length > 0 ? service[0] : null;
  }

  // Crear un nuevo SERVICE
  static async crear(datos: Partial<Portafolio>): Promise<boolean> {
    return await SupabaseService.crearRegistro<Portafolio>(this.TABLE_NAME, datos);
  }
  static async agregarServicio(
    provider_id: number,
    nuevaEspecialidad: string,
    nuevaDescripcion: string,
    servicio_id: number,
    imagen: string
  ) {
    const { data, error } = await supabase_client
      .from(this.TABLE_NAME)
      .insert({
        especialidad: nuevaEspecialidad,
        provider_id: provider_id,
        descripcion: nuevaDescripcion,
        imagen: imagen,
        servicio_id: servicio_id,
      });
  }

  // Actualizar un SERVICE por ID
  static async actualizar(
    id: number,
    datos: Partial<Portafolio>
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Portafolio>(
      this.TABLE_NAME,
      datos,
      "id",
      id
    );
  }

  // Eliminar un SERVICE por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }
}
