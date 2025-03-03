import { supabase_client } from './supabaseClient';
import SupabaseService from './SupabaseService';
import { AuthService } from './AuthService';

export class ProviderServiceService {
  static TABLE_NAME = 'provider_services';

  // Obtener todos los provider services
  static async obtenerTodos() {
    return await SupabaseService.obtenerDatos(this.TABLE_NAME, 'id,provider_id,service_id,providers(id,phone,profile_id,ubicacion,profiles(name,rating,profile_pic_url,phone),description,speciality,availability),services(id,category,tags)');
  }

  // Obtener un PROVIDERSERVICE por ID
  static async obtenerPorId(id) {
    const providerservice = await SupabaseService.obtenerDatos(this.TABLE_NAME, 'id,provider_id,service_id,providers(id,phone,is_premium,portafolio_provider(id,especialidad,imagen),profile_id,ubicacion,profiles(name,rating,profile_pic_url,phone),description,speciality,availability),services(id,category,tags)', { id });
    return providerservice.length > 0 ? providerservice[0] : null;
  }

  // Obtener PROVIDERSERVICE por ID de servicio y municipio
  static async obtenerPorServicio(service_id, municipio_id = 0) {
    const perfil = await AuthService.obtenerPerfil();
    const municipio = municipio_id === 0 ? perfil?.municipio_id : municipio_id;
    console.log(municipio);

    const providerservice = await SupabaseService.obtenerDatos(
      this.TABLE_NAME,
      'id,provider_id,service_id,providers(id,phone,portafolio_provider(id,especialidad,imagen),profile_id,ubicacion,profiles(name,rating,profile_pic_url,phone,municipio_id),description,speciality,availability),services(id,category,tags)',
      { service_id }
    );

    if (municipio !== 0) {
      return providerservice.filter(provider => provider.providers?.profiles?.municipio_id === municipio);
    }

    return providerservice.length > 0 ? providerservice : [];
  }

  // Crear un nuevo PROVIDERSERVICE
  static async crear(datos) {
    return await SupabaseService.crearRegistro(this.TABLE_NAME, datos);
  }

  // Agregar servicio a un proveedor
  static async agregarServicioProveedor(provider_id, service_id) {
    const { data, error } = await supabase_client
      .from(this.TABLE_NAME)
      .insert({ provider_id, service_id });
    if (error) {
      console.error('Error al agregar servicio:', error);
    }
    return data;
  }

  // Actualizar un PROVIDERSERVICE por ID
  static async actualizar(id, datos) {
    return await SupabaseService.actualizarRegistro(this.TABLE_NAME, datos, 'id', id);
  }

  // Actualizar los datos de un proveedor
  static async actualizarProveedor(perfil) {
    const { data, error } = await supabase_client
      .from('providers')
      .update({
        phone: perfil.phone,
        speciality: perfil.speciality,
        availability: perfil.availability,
      })
      .eq('id', perfil.id);
    if (error) {
      console.error('Error al actualizar proveedor:', error);
    }
    return data;
  }

  // Eliminar un PROVIDERSERVICE por ID
  static async eliminar(id) {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}
