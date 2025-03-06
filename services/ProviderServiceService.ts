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
      'id,provider_id,service_id,providers(id,phone,is_premium,portafolio_provider(id,especialidad,imagen),profile_id,ubicacion,profiles(name,rating,profile_pic_url,phone),description,speciality,availability),services(id,category,tags))',
      {
        id,
      },
    );
    return providerservice.length > 0 ? providerservice[0] : null;
  } 
  static async obtenerPorServicio(service_id: number, municipio_id: number = 0,provincia_id:number=0): Promise<ProviderService[]> {
    // Obtener perfil
    const perfil = await AuthService.obtenerPerfil();
    const municipio = municipio_id === 0 ? perfil?.municipio_id : municipio_id;
    const provincia = provincia_id === 0 ? perfil?.provincia_id : provincia_id;
    // Obtener los servicios del proveedor
    const providerservice = await SupabaseService.obtenerDatos<ProviderService>(
        this.TABLE_NAME,
        'id,provider_id,service_id,providers(id,phone,portafolio_provider(id,especialidad,imagen),profile_id,ubicacion,profiles(name,rating,profile_pic_url,phone,municipio_id,provincia_id),description,speciality,availability),services(id,category,tags)',
        {
            service_id,
        }
    );
console.log(providerservice);

    // Filtrar los resultados por municipio_id si es necesario
    if (municipio !== 0) {
        return providerservice.filter(provider => 
          provider.providers?.profiles?.municipio_id === municipio || provider.providers?.profiles?.provincia_id === provincia 
        );
    }
    // Filtrar los resultados por municipio_id si es necesario
    if (provincia !== 0) {
      return providerservice.filter(provider => 
        provider.providers?.profiles?.municipio_id === municipio || provider.providers?.profiles?.provincia_id === provincia 
      );
  }
    // Si no se necesita filtro, devolver todos los resultados
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
      })
      .eq("id", perfil.id)
}
  // Eliminar un PROVIDERSERVICE por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}
