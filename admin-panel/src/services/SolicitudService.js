import { supabase_client } from "./supabaseClient";
import SupabaseService from "./SupabaseService";

class SolicitudService {
  static TABLE_NAME = "requests";

  
  static async obtenerSolicitudesPorUsuario(user_id) {
    return await SupabaseService.obtenerDatos(
      this.TABLE_NAME,
      "id, provider_id, providers(id, phone, profile_id, profiles(name, rating, profile_pic_url, phone), description, speciality, availability), service_id, services(id, category, tags), request_description, service_date, images, status, user_id",
      { user_id }
    );
  }

  static async obtenerSolicitudesComoProveedor(user_id) {
    // Obtener el profile_id desde la tabla profiles usando el user_id
    const { data: perfiles, error: errorPerfil } = await supabase_client
      .from("profiles")
      .select("id")
      .eq("user_id", user_id)
      .single();
  
    if (errorPerfil || !perfiles) {
      console.error("Error obteniendo perfil:", errorPerfil);
      return [];
    }
  
    // Obtener el provider_id usando el profile_id
    const { data: provider, error: errorProvider } = await supabase_client
      .from("providers")
      .select("id")
      .eq("profile_id", perfiles.id)
      .single();
  
    if (errorProvider || !provider) {
      console.error("Error obteniendo proveedor:", errorProvider);
      return [];
    }
  
    return await this.obtenerSolicitudes({ provider_id: provider.id });
  }
  
  static async obtenerTodosLosSolicitudes() {
    return await this.obtenerSolicitudes();
  }
  
  static async obtenerSolicitudes(filtro = {}) {
    // Obtener solicitudes con proveedores y servicios
    const { data: solicitudes, error: errorSolicitud } = await supabase_client
      .from(this.TABLE_NAME)
      .select(
        "id, provider_id,cotizaciones(id,costo_mano_obra,costo_materiales,descripcion), providers(id, phone, profile_id, profiles(id, name, rating, profile_pic_url, phone)), service_id, services(id, category, tags), request_description, service_date, images, status, user_id"
      )
      .match(filtro);
  
    if (errorSolicitud) {
      console.error("Error obteniendo solicitudes:", errorSolicitud);
      return [];
    }
  
    // Obtener perfiles desde la tabla "profiles"
    const { data: perfiles, error: errorPerfiles } = await supabase_client
      .from("profiles")
      .select("id, name, rating, profile_pic_url, phone, user_id");
  
    if (errorPerfiles) {
      console.error("Error obteniendo perfiles:", errorPerfiles);
      return [];
    }
  
    // Crear un mapa de perfiles basado en user_id
    const mapaPerfiles = new Map(perfiles.map((perfil) => [perfil.user_id, perfil]));
  
    // Asociar cada solicitud con su perfil correspondiente
    return solicitudes.map((solicitud) => ({
      ...solicitud,
      usuarioPerfil: mapaPerfiles.get(solicitud.user_id) || null,
    }));
  }
  

  static async obtenerSolicitudPorId(id) {
    const solicituds = await SupabaseService.obtenerDatos(
      this.TABLE_NAME,
      "*",
      { id }
    );
    return solicituds[0] || null;
  }

  static async obtenerSolicitudsPorCategoria(categoria) {
    return await SupabaseService.obtenerDatos(this.TABLE_NAME, "*", {
      category: categoria,
    });
  }

  static async crearSolicitudDeServicio(
    providerId,
    serviceId,
    descripcion,
    fechaServicio,
    imagenesUrl = ""
  ) {
    const { error } = await supabase_client
      .from(SolicitudService.TABLE_NAME)
      .insert({
        provider_id: providerId,
        service_id: serviceId,
        request_description: descripcion,
        service_date: fechaServicio,
        images: imagenesUrl,
        status: "Pendiente",
      });

    if (error) {
      console.error("Error al guardar la solicitud:", error.message);
      return false;
    }
    return true;
  }

  static async actualizarSolicitud(id, datosActualizados) {
    return await SupabaseService.actualizarRegistro(
      this.TABLE_NAME,
      datosActualizados,
      "id",
      id
    );
  }

  static async eliminarSolicitud(id) {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }

  static async actualizarEstadoSolicitud(id, status) {
    const { error } = await supabase_client
      .from(this.TABLE_NAME)
      .update({ status })
      .eq("id", id);

    if (error) {
      throw new Error(`Error al actualizar el estado: ${error.message}`);
    }
  }

  static async obtenerHistorialUsuario(userId) {
    const { data, error } = await supabase_client
      .from(SolicitudService.TABLE_NAME)
      .select(
        `id, service_date, status, 
        services (category), 
        providers (name, profile_pic_url)`
      )
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Error al obtener el historial: ${error.message}`);
    }

    return (
      data?.map((item) => ({
        id: item.id,
        proveedor: item.providers?.name || "Desconocido",
        servicio: item.services?.category || "",
        fecha: item.service_date,
        estado: item.status,
        fotoProveedor: item.providers?.profile_pic_url || "",
      })) || []
    );
  }
}

export default SolicitudService;
