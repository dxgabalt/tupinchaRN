/* eslint-disable @typescript-eslint/no-unused-vars */
import { Cotizacion } from "../models/Cotizacion";
import { supabase_client } from "./supabaseClient";
import SupabaseService from "./SupabaseService";

export class CotizacionService {
  private static readonly TABLE_NAME = "cotizaciones";
  static async obtenerTodosLosCotizacion(): Promise<Cotizacion[]> {
    return await SupabaseService.obtenerDatos<Cotizacion>(this.TABLE_NAME);
  }
  static async obtenerCotizaciones(): Promise<any[]> {
    const { data, error } = await supabase_client
      .from("cotizaciones")
      .select("id,costo_mano_obra, costo_materiales,descripcion,provider_id,request_id");

    if (error) {
      throw new Error(`Error al obtener COTIZACIONs: ${error.message}`);
    }

    return data || [];
  }

  static async obtenerCotizacionPorId(id: number): Promise<Cotizacion | null> {
    const cotizacion = await SupabaseService.obtenerDatos<Cotizacion>(
      this.TABLE_NAME,
      "*",
      {
        id,
      }
    );
    return cotizacion[0] || null;
  }
  static async agregarCotizacion(
    provider_id: number,
    request_id: number,
    costo_mano_obra: string,
    costo_materiales: string,
    descripcion: string,
  ) {
    const { data, error } = await supabase_client
      .from(this.TABLE_NAME)
      .insert({
        provider_id: provider_id,
        descripcion: descripcion,
        costo_mano_obra:costo_mano_obra,
        costo_materiales: costo_materiales,
        request_id: request_id,
      });
  }
  static async actualizarCotizacion(
    id: number,
    datosActualizados: Partial<Cotizacion>
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Partial<Cotizacion>>(
      this.TABLE_NAME,
      datosActualizados,
      "id",
      id
    );
  }
  static async eliminarCotizacion(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }
}

export default CotizacionService;
