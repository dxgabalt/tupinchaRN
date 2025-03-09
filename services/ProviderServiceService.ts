import {ProviderService} from '../models/ProviderService';
import { AuthService } from './AuthService';
import { supabase_client } from './supabaseClient';
import SupabaseService from './SupabaseService';

export class ProviderServiceService {
  private static readonly TABLE_NAME = 'provider_services';

  // Obtener todos los Cities
  static async obtenerTodos(): Promise<ProviderService[]> {
    return await SupabaseService.obtenerDatos<ProviderService>(this.TABLE_NAME,'id,provider_id,service_id,providers(id,phone,profile_id,ubicacion,profiles(name,rating,profile_pic_url,phone),description,speciality,availability),services(id,category,tags))');
  }

  // Obtener un PROVIDERSERVICE por ID
  static async obtenerPorId(id: number): Promise<ProviderService | null> {
    const providerservice = await SupabaseService.obtenerDatos<ProviderService>(
      this.TABLE_NAME,
      'id,provider_id,service_id,providers(id,phone,is_premium,portafolio_provider(id,especialidad,imagen),profile_id,ubicacion,profiles(name,rating,profile_pic_url,phone,provincias(id,nombre),municipios(id,name)),description,speciality,availability),services(id,category,tags))',
      {
        id,
      },
    );
    return providerservice.length > 0 ? providerservice[0] : null;
  } 
  static async obtenerPorServicio(
    service_id: number,
    municipio_id: number = 0,
    provincia_id: number = 0
): Promise<ProviderService[]> {
    // Obtener los servicios del proveedor
    const providerservice = await SupabaseService.obtenerDatos<ProviderService>(
        this.TABLE_NAME,
        'id,provider_id,service_id,providers(id,phone,portafolio_provider(id,especialidad,imagen),profile_id,ubicacion,profiles(name,rating,profile_pic_url,phone,municipio_id,provincia_id,municipios(id,name),provincias(id,nombre)),description,speciality,availability),services(id,category,tags)',
        { service_id }
    );

    // Filtrar por ambos si ambos valores están presentes
    if (municipio_id !== 0 && provincia_id !== 0) {
        return providerservice.filter(provider =>
            provider.providers?.profiles?.municipio_id === municipio_id &&
            provider.providers?.profiles?.provincia_id === provincia_id
        );
    }

    // Si solo hay provincia, filtrar por provincia
    if (provincia_id !== 0) {
        return providerservice.filter(provider =>
            provider.providers?.profiles?.provincia_id === provincia_id
        );
    }

    // Si solo hay municipio, filtrar por municipio
    if (municipio_id !== 0) {
        return providerservice.filter(provider =>
            provider.providers?.profiles?.municipio_id === municipio_id
        );
    }

    // Si no hay filtros, devolver todos los resultados
    return providerservice.length > 0 ? providerservice : [];
}





  // Crear un nuevo PROVIDERSERVICE
  static async crear(datos: Partial<ProviderService>): Promise<boolean> {
    return await SupabaseService.crearRegistro<ProviderService>(
      this.TABLE_NAME,
      datos,
    );
  } 
  static async agregarServicioProveedor(provider_id:number,service_id:number) {
    const { data: provider, error: providerError } = await supabase_client
    .from(this.TABLE_NAME)
    .insert({
      provider_id, 
      service_id
    })
  }

  // Actualizar un PROVIDERSERVICE por ID
  static async actualizar(
    id: number,
    datos: Partial<ProviderService>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<ProviderService>(
      this.TABLE_NAME,
      datos,
      'id',
      id,
    );
  }
static async actualizarProveedor(perfil:any){
   const { data, error } = await supabase_client
      .from('providers')
      .update({
        phone: perfil.phone,
        speciality: perfil.speciality,
        availability: perfil.availability,
        plan_id: perfil.plan_id=== undefined?null:perfil.plan_id,
      })
      .eq("id", perfil.id) .select();
}
  // Eliminar un PROVIDERSERVICE por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}
