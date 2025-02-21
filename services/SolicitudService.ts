/* eslint-disable @typescript-eslint/no-unused-vars */
import SupabaseService from './SupabaseService';
import {Solicitud} from '../models/Solicitud';
import {HistorialItem} from '../models/HistorialItem';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import { supabase_client } from './supabaseClient';
import { ProviderService } from '../models/ProviderService';

export class SolicitudService {
  private static readonly TABLE_NAME = 'requests';
  // Configuración de Supabase
  private static SUPABASE_URL = 'https://idngwsekicptfluqumys.supabase.co';
  private static SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbmd3c2VraWNwdGZsdXF1bXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTcyMDcsImV4cCI6MjA1NDE3MzIwN30.sBCVdh7CxLpbtJkhtKyGeQ-mWZXZrVxWWiINhtBxhso';

  private static supabase: SupabaseClient = createClient(
    SolicitudService.SUPABASE_URL,
    SolicitudService.SUPABASE_KEY,
  );

  static async obtenerTodosLosSolicituds(): Promise<Solicitud[]> {
    return await SupabaseService.obtenerDatos<Solicitud>(this.TABLE_NAME);
  }
  static async obtenerHistorialSolicitud(userId: string): Promise<HistorialItem[]> {
    const { data, error } = await supabase_client
      .from(SolicitudService.TABLE_NAME)
      .select(
        `id, provider_id, providers(id, phone, profile_id, profiles(name, rating, profile_pic_url, phone), description, speciality, availability), service_id, services(id, category, tags), request_description, service_date, images, status, user_id`
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
        const fotoProveedor = item.providers?.[0]?.profiles?.[0]?.profile_pic_url || "";
  
        return { id: item.id, proveedor, servicio, fecha, estado, fotoProveedor };
      }) || []
    );
  }
  

  static async obtenerSolicitudPorId(id: number): Promise<Solicitud | null> {
    const solicituds = await SupabaseService.obtenerDatos<Solicitud>(
      this.TABLE_NAME,
      '*',
      {id},
    );
    return solicituds[0] || null;
  }

  static async obtenerSolicitudsPorCategoria(
    categoria: string,
  ): Promise<Solicitud[]> {
    return await SupabaseService.obtenerDatos<Solicitud>(this.TABLE_NAME, '*', {
      category: categoria,
    });
  }

  static async crearSolicitudDeServicio(
    providerId: number,
    serviceId: number,
    descripcion: string,
    fechaServicio: string,
    userId: string,
    imagenesUrl?: string,
  ): Promise<boolean> {
   
   const {error} = await SolicitudService.supabase
      .from(SolicitudService.TABLE_NAME)
      .insert({
        provider_id: providerId,
        service_id: serviceId,
        request_description: descripcion,
        service_date: fechaServicio,
        images: imagenesUrl || '',
        user_id: userId,
        status: 'Pendiente',
      });

    if (error) {
      console.error('Error al guardar la solicitud:', error.message);
      return false;
    }
    return true;
  }

  static async actualizarSolicitud(
    id: number,
    datosActualizados: Partial<Solicitud>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Partial<Solicitud>>(
      this.TABLE_NAME,
      datosActualizados,
      'id',
      id,
    );
  }

  static async eliminarSolicitud(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}

export default SolicitudService;
