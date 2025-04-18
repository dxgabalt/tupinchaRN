/* eslint-disable @typescript-eslint/no-unused-vars */
import SupabaseService from "./SupabaseService";
import { Solicitud } from "../models/Solicitud";
import { HistorialItem } from "../models/HistorialItem";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabase_client } from "./supabaseClient";
import { ProviderService } from "../models/ProviderService";
import { Alert } from "react-native";
import { Cotizacion } from "../models/Cotizacion";
import { RequestNota } from "../models/RequestNota";
import { SolicitudData } from "../models/SolicitudData";

export class SolicitudService {
  private static readonly TABLE_NAME = "requests";
  // Configuración de Supabase
  private static SUPABASE_URL = "https://idngwsekicptfluqumys.supabase.co";
  private static SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbmd3c2VraWNwdGZsdXF1bXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTcyMDcsImV4cCI6MjA1NDE3MzIwN30.sBCVdh7CxLpbtJkhtKyGeQ-mWZXZrVxWWiINhtBxhso";

  private static supabase: SupabaseClient = createClient(
    SolicitudService.SUPABASE_URL,
    SolicitudService.SUPABASE_KEY
  );

  static async obtenerTodosLosSolicituds(): Promise<Solicitud[]> {
    return await SupabaseService.obtenerDatos<Solicitud>(this.TABLE_NAME);
  }
  static async obtenerHistorialSolicitud(
    userId: string
  ): Promise<HistorialItem[]> {
    const { data, error } = await supabase_client
      .from(SolicitudService.TABLE_NAME)
      .select(
        `id, provider_id, request_description,providers(id, phone, profile_id, profiles(name, rating, profile_pic_url, phone), description, speciality, availability), service_id, services(id, category, tags), request_description, service_date, images, status, user_id`
      )
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Error al obtener el historial: ${error.message}`);
    }
    return (
      data?.map((item) => {
        const proveedor = item.providers?.profiles?.name || "Desconocido";
        const servicio = item.services?.category || "";
        const fecha = item.service_date;
        const estado = item.status;
        const fotoProveedor =
          item.providers?.[0]?.profiles?.[0]?.profile_pic_url || "";
        const request_description = item.request_description;
        return {
          id: item.id,
          proveedor,
          servicio,
          fecha,
          estado,
          fotoProveedor,
          request_description,
        };
      }) || []
    );
  }

  static async obtenerSolicitudPorId(id: number): Promise<Solicitud | null> {
    const solicituds = await SupabaseService.obtenerDatos<Solicitud>(
      this.TABLE_NAME,
      "id, provider_id,request_notas(id,nota_client,nota_provider),contraofertas(id,costo_mano_obra,costo_materiales,descripcion,contraoferta_notas(id,nota_client,nota_provider)), cotizaciones(id,costo_mano_obra,costo_materiales,descripcion,cotizacion_notas(id,nota_client,nota_provider,created_at,updated_at)),providers(id, phone, profile_id,is_premium, profiles(name, rating, profile_pic_url, phone,provincias(id,nombre),municipios(id,name)), description, speciality, availability), service_id, services(id, category, tags), request_description, service_date, images, status, user_id",
      { id }
    );
    return solicituds[0] || null;
  }
static async guardarCalificacion(id: number,calificacion:number,comentario:string){
  const {data, error } = await supabase_client
  .from(this.TABLE_NAME)
  .update({ calificacion,comentario })
  .eq("id", id)
  .select();
  
if (error) {
  throw new Error(`Error al actualizar el estado: ${error.message}`);
}
}
  static async obtenerCotizaciones(id: number): Promise<Cotizacion[]> {
    return await SupabaseService.obtenerDatos<Cotizacion>("cotizaciones", "*", {
      request_id: id,
    });
  }

  static async obtenerSolicitudsPorCategoria(
    categoria: string
  ): Promise<Solicitud[]> {
    return await SupabaseService.obtenerDatos<Solicitud>(this.TABLE_NAME, "*", {
      category: categoria,
    });
  }

  static async crearSolicitudDeServicio(solicitud: SolicitudData): Promise<number> {
    console.log('crear solicitud');
    
    const { data, error } = await SolicitudService.supabase
    .from(SolicitudService.TABLE_NAME)
    .insert({
      provider_id: solicitud.provider_id,
      service_id: solicitud.service_id,
      request_description: solicitud.descripcion,
      service_date: solicitud.fecha,
      images: solicitud.url_imagen || "",
      user_id: solicitud.userId,
      price: solicitud.precio,
      status: "Pendiente",
      direccion: solicitud.direccion,
      metodo_pago: solicitud.metodoPago,
    })
    .select(`
      provider_id,
      providers (
        id,
        profile_id,
        profiles (
          id,
          name,
          user_id
        )
      )
    `);
    const user_id_provider = data?.[0]?.providers?.profiles?.user_id
    //insertara notificacion
     const {error:notificationError} = await supabase_client
      .from('notifications')
      .insert({
        user_id: user_id_provider,
        message: 'Se ha creado una solicitud de servicio',
        is_read: false,
        type_id: 1,
      }).select();
      if (notificationError ) {
        Alert.alert('Error', 'No se pudo crear la notificación');
      }
    if (error) {
      Alert.alert("Error", error.message);
      return 0;
    }
    return data !== null ? data[0].id : 0;
  }

  static async obtenerSolicitudesComoProveedor(
    user_id: string
  ): Promise<Solicitud[]> {
    try {
      // Obtener el profile_id desde la tabla profiles usando el user_id
      const { data: perfil, error: errorPerfil } = await supabase_client
        .from("profiles")
        .select("id")
        .eq("user_id", user_id)
        .single();

      if (errorPerfil || !perfil) {
        console.error("Error obteniendo perfil:", errorPerfil);
        return [];
      }

      // Obtener el provider_id usando el profile_id
      const { data: provider, error: errorProvider } = await supabase_client
        .from("providers")
        .select("id")
        .eq("profile_id", perfil.id)
        .single();

      if (errorProvider || !provider) {
        console.error("Error obteniendo proveedor:", errorProvider);
        return [];
      }

      return await this.obtenerSolicitudes({ provider_id: provider.id });
    } catch (error) {
      console.error("Error en obtenerSolicitudesComoProveedor:", error);
      return [];
    }
  }
  static async obtenerSolicitudes(
    filtro: Record<string, any> = {}
  ): Promise<Solicitud[]> {
    try {
      // Obtener solicitudes con proveedores y servicios
      const { data: solicitudes, error: errorSolicitud } = await supabase_client
        .from(this.TABLE_NAME)
        .select(
          `id, provider_id,direccion,request_notas(id,nota_client,nota_provider,created_at,updated_at),contraofertas(id,costo_mano_obra,costo_materiales,descripcion,contraoferta_notas(id,nota_client,nota_provider,created_at,updated_at)), cotizaciones(id,costo_mano_obra,costo_materiales,descripcion,cotizacion_notas(id,nota_client,nota_provider,created_at,updated_at)),providers(id, phone, profile_id, profiles(id, name, rating, profile_pic_url, phone)), 
           service_id, services(id, category, tags), request_description, service_date, images,price, status, user_id`
        )
        .match(filtro);

      if (errorSolicitud || !solicitudes) {
        console.error("Error obteniendo solicitudes:", errorSolicitud);
        return [];
      }

      // Obtener perfiles desde la tabla "profiles"
      const { data: perfiles, error: errorPerfiles } = await supabase_client
        .from("profiles")
        .select("id, name, rating, profile_pic_url, phone, user_id");

      if (errorPerfiles || !perfiles) {
        console.error("Error obteniendo perfiles:", errorPerfiles);
        return [];
      }

      // Crear un mapa de perfiles basado en user_id
      const mapaPerfiles = new Map<number, Perfil>(
        perfiles.map((perfil) => [perfil.user_id, perfil])
      );
      // Asociar cada solicitud con su perfil correspondiente
      return solicitudes.map((solicitud) => ({
        ...solicitud,
        usuarioPerfil: mapaPerfiles.get(solicitud.user_id) || null,
      }));
    } catch (error) {
      console.error("Error en obtenerSolicitudes:", error);
      return [];
    }
  }
  static async agregarNotaCotizacion(
    request_id: number,
    nota: string,
    is_provider: boolean = false
  ) {
    if (is_provider) {
      // Si no es proveedor, inserta la nota del cliente
      const { data, error } = await supabase_client
        .from("request_notas")
        .insert({
          request_id: request_id,
          nota_provider: nota,
        });

      if (error) {
        console.error("Error insertando nota del cliente:", error);
      }
      return data;
    } else {
      return await SupabaseService.actualizarRegistro<RequestNota>(
        "request_notas",
        { nota_client: nota,updated_at:new Date().toISOString() },
        "id",
        request_id
      );
    }
  }

  static async actualizarEstadoSolicitud(
    id: number,
    status: string,
    es_proveedor:boolean=false
  ): Promise<void> {
    const {data, error } = await supabase_client
      .from(this.TABLE_NAME)
      .update({ status })
      .eq("id", id)
      .select(`
        request_description,
        user_id,
        provider_id,
        providers (
          id,
          profile_id,
          profiles (
            id,
            name,
            user_id
          )
        )
      `);
      const user_id_provider = es_proveedor? data?.[0]?.user_id:data?.[0]?.providers?.profiles?.user_id
      const estados: Record<'aceptada'|'aceptada por proveedor' | 'Rechazada' | 'Completado', number> = {
        "aceptada por proveedor":5,
        aceptada: 5,
        Rechazada: 3,
        Completado: 4
      };
      const type_id = estados[status as keyof typeof estados];
      //insertara notificacion
       const {error:notificationError} = await supabase_client
        .from('notifications')
        .insert({
          user_id: user_id_provider,
          message: 'Se ha cambiado solicidud a estado '+status+' referente a: '+data?.[0]?.request_description,
          is_read: false,
          type_id: type_id,
        }).select();
    if (error) {
      throw new Error(`Error al actualizar el estado: ${error.message}`);
    }
  }
  static async actualizarPrecio(
    id: number,
    precio: number,
  ): Promise<void> {
    const {data, error } = await supabase_client
      .from(this.TABLE_NAME)
      .update({ price:precio })
      .eq("id", id)
      .select();
      
  }
  static async actualizarSolicitud(
    id: number,
    datosActualizados: Partial<Solicitud>
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Partial<Solicitud>>(
      this.TABLE_NAME,
      datosActualizados,
      "id",
      id
    );
  }

  static async eliminarSolicitud(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }
}

export default SolicitudService;
