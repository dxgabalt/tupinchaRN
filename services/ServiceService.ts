import { ProviderService } from "../models/ProviderService";
import { Service } from "../models/Service";
import { supabase_client } from "./supabaseClient";
import SupabaseService from "./SupabaseService";

export class ServiceService {
  private static readonly TABLE_NAME = "services";

  // Obtener todos los Service
  static async obtenerTodos(): Promise<Service[]> {
    return await SupabaseService.obtenerDatos<Service>(this.TABLE_NAME,"*",{},{campo: 'prioridad', ascendente: true });
  }

  // Obtener un SERVICE por ID
  static async obtenerPorId(id: number): Promise<Service | null> {
    const service = await SupabaseService.obtenerDatos<Service>(
      this.TABLE_NAME,
      "*",
      {
        id,
      }
    );
    return service.length > 0 ? service[0] : null;
  }

  // Crear un nuevo SERVICE
  static async crear(datos: Partial<Service>): Promise<boolean> {
    return await SupabaseService.crearRegistro<Service>(this.TABLE_NAME, datos);
  }
  static async agregarServicio(
    provider_id: number,
    nuevaEspecialidad: string,
    nuevaDescripcion: string,
    imagen: string
  ) {
    const { data, error } = await supabase_client
      .from("services")
      .insert({
        category: nuevaEspecialidad,
        imagen: imagen,
      })
      .select();
    const service = data ?? null;
    const service_id =
      Array.isArray(service) && service.length > 0 ? service[0].id : 0;
    return await SupabaseService.crearRegistro<ProviderService>(
      "provider_services",
      {
        provider_id: provider_id,
        service_id: service_id,
        description: nuevaDescripcion,
      }
    );
  }

  // Actualizar un SERVICE por ID
  static async actualizar(
    id: number,
    datos: Partial<Service>
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Service>(
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
