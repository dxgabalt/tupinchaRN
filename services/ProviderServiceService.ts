import { ProviderService } from "../models/ProviderService";
import { AuthService } from "./AuthService";
import { supabase_client } from "./supabaseClient";
import SupabaseService from "./SupabaseService";

export class ProviderServiceService {
  private static readonly TABLE_NAME = "provider_services";

  // Obtener todos los Cities
  static async obtenerTodos(): Promise<ProviderService[]> {
    return await SupabaseService.obtenerDatos<ProviderService>(
      this.TABLE_NAME,
      "id,provider_id,service_id,providers(id,phone,profile_id,ubicacion,profiles(name,rating,profile_pic_url,phone),description,speciality,availability),services(id,category,tags))"
    );
  }

  // Obtener un PROVIDERSERVICE por ID
  static async obtenerPorId(id: number): Promise<ProviderService | null> {
    const providerservice = await SupabaseService.obtenerDatos<ProviderService>(
      this.TABLE_NAME,
      "id,provider_id,service_id,providers(id,phone,is_premium,portafolio_provider(id,especialidad,imagen),profile_id,ubicacion,profiles(name,rating,profile_pic_url,phone,provincias(id,nombre),municipios(id,name)),description,speciality,availability),services(id,category,tags))",
      {
        id,
      }
    );
    return providerservice.length > 0 ? providerservice[0] : null;
  }
  static async obtenerPorServicio(
    service_id: number,
    municipio_id: number = 0,
    provincia_id: number = 0
  ): Promise<ProviderService[]> {
    // 1. Obtener todos los datos de provider_services sin filtrar por ubicación
    const providersFromServices =
      await SupabaseService.obtenerDatos<ProviderService>(
        "provider_services",
        `id,provider_id,service_id,
        providers(
          id,phone,position,
          portafolio_provider(id,especialidad,imagen),
          profile_id,ubicacion,
          profiles(
            name,rating,is_verified,profile_pic_url,phone,municipio_id,provincia_id,
            municipios(id,name),
            provincias(id,nombre)
          ),
          description,speciality,availability
        ),
        services(id,category,tags)`,
        { service_id }
      );
  
    // 2. Obtener datos de provider_locations usando los filtros
    const providersFromLocations = await SupabaseService.obtenerDatos<any>(
      "provider_locations",
      "id,created_at,provider_id,municipio_id,provincia_id",
      {
        ...(provincia_id ? { provincia_id } : {}),
      }
    );
  
    // 3. Combinar datos de services y locations
    const combinedProviders = providersFromServices.map((provider) => {
      const { profiles, position } = provider.providers || {};
      // Buscar coincidencia en provider_locations
      const location = providersFromLocations.find(
        (loc) => loc.provider_id === provider.provider_id
      );
      return {
        ...provider,
        location: location || null,
        municipio_id: profiles?.municipio_id || location?.municipio_id || null,
        provincia_id: profiles?.provincia_id || location?.provincia_id || null,
        is_verified: profiles?.is_verified || false,
        position: position || 0, // Asignar 0 si la posición no está definida
      };
    });
  
    // 4. Filtrar resultados combinados
    const filteredProviders = combinedProviders.filter((provider) => {
      if (!provider.is_verified) return false;
      if (municipio_id !== 0 && provincia_id !== 0) {
        if (provider.location !== null) {
          return (
            (provider.municipio_id === municipio_id &&
              provider.provincia_id === provincia_id) ||
            (provider.location.municipio_id === municipio_id &&
              provider.location.provincia_id === provincia_id)
          );
        } else {
          return (
            provider.municipio_id === municipio_id &&
            provider.provincia_id === provincia_id
          );
        }
      }
  
      if (provincia_id !== 0) {
        if (provider.location !== null) {
          return (
            provider.provincia_id === provincia_id ||
            provider.location.provincia_id === provincia_id
          );
        } else {
          return provider.provincia_id === provincia_id;
        }
      }
  
      if (municipio_id !== 0) {
        if (provider.location !== null) {
          return (
            provider.municipio_id === municipio_id ||
            provider.location.municipio_id === municipio_id
          );
        } else {
          return provider.municipio_id === municipio_id;
        }
      }
  
      return true;
    });
  
    // 5. Ordenar por posición
    filteredProviders.sort((a, b) => (a.position || 0) - (b.position || 0));
  
    // ✅ Retornar resultados finales ordenados
    return filteredProviders;
  }
  

  // Crear un nuevo PROVIDERSERVICE
  static async crear(datos: Partial<ProviderService>): Promise<boolean> {
    return await SupabaseService.crearRegistro<ProviderService>(
      this.TABLE_NAME,
      datos
    );
  }
  static async agregarServicioProveedor(
    provider_id: number,
    service_id: number
  ) {
    const { data: provider, error: providerError } = await supabase_client
      .from(this.TABLE_NAME)
      .insert({
        provider_id,
        service_id,
      });
  }

  // Actualizar un PROVIDERSERVICE por ID
  static async actualizar(
    id: number,
    datos: Partial<ProviderService>
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<ProviderService>(
      this.TABLE_NAME,
      datos,
      "id",
      id
    );
  }
  static async actualizarProveedor(perfil: any) {
    const { data, error } = await supabase_client
      .from("providers")
      .update({
        phone: perfil.phone,
        speciality: perfil.speciality,
        availability: perfil.availability,
        description: perfil.description,
        plan_id: perfil.plan_id === undefined ? null : perfil.plan_id,
      })
      .eq("id", perfil.id)
      .select();
      const { data:profileData, error:ErrorProfile } = await supabase_client
      .from("profiles")
      .update({
        profile_pic_url: perfil.profile_pic_url,
        phone: perfil.phone,
        municipio_id: perfil.municipio_id,
        provincia_id:  perfil.provincia_id
      })
      .eq("id", perfil.profile_id)
      .select();
  }
  // Eliminar un PROVIDERSERVICE por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }
}
