/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContraOferta } from "../models/ContraOferta";
import { ContraOfertaNota } from "../models/ContraOfertaNota";
import { AuthService } from "./AuthService";
import { supabase_client } from "./supabaseClient";
import SupabaseService from "./SupabaseService";

export class ContraOfertaService {
  private static readonly TABLE_NAME = "contraofertas";
  static async obtenerTodosLosContraOferta(): Promise<ContraOferta[]> {
    return await SupabaseService.obtenerDatos<ContraOferta>(this.TABLE_NAME);
  }
  static async obtenerContraOfertaes(): Promise<any[]> {
    const { data, error } = await supabase_client
      .from("contraofertas")
      .select("id,costo_mano_obra, costo_materiales,descripcion,provider_id,request_id");

    if (error) {
      throw new Error(`Error al obtener CONTRAOFERTAs: ${error.message}`);
    }

    return data || [];
  }

  static async obtenerContraOfertaPorId(id: number): Promise<ContraOferta | null> {
    const contraoferta = await SupabaseService.obtenerDatos<ContraOferta>(
      this.TABLE_NAME,
      "*",
      {
        id,
      }
    );
    return contraoferta[0] || null;
  }
  static async agregarContraOferta(
    request_id: number,
    costo_mano_obra: string,
    costo_materiales: string,
    descripcion: string,
  ) {
    //obtener perfil
    const perfil = await AuthService.obtenerPerfil();
    const user_id = perfil?.user_id
    const { data, error } = await supabase_client
      .from(this.TABLE_NAME)
      .insert({
        user_id,
        descripcion: descripcion,
        costo_mano_obra:costo_mano_obra,
        costo_materiales: costo_materiales,
        request_id: request_id,
      });
  }  
  
  static async agregarNotaContraOferta(
    contraoferta_id: number,
    nota: string,
    is_provider: boolean = false
  ) {
    if (is_provider) {
       // Si no es proveedor, inserta la nota del cliente
       const { data, error } = await supabase_client
       .from('contraoferta_notas')
       .insert({
         contraoferta_id: contraoferta_id,
         nota_provider: nota,
       });
       if (error) {
        console.error('Error insertando nota del proveedor:', error);
      }
      return data;
    } else {
      return await SupabaseService.actualizarRegistro<ContraOfertaNota>('contraoferta_notas', {nota_client: nota,updated_at:new Date().toISOString()}, 'id', contraoferta_id)
    }
  }
  
  static async actualizarContraOferta(
    id: number,
    datosActualizados: Partial<ContraOferta>
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Partial<ContraOferta>>(
      this.TABLE_NAME,
      datosActualizados,
      "id",
      id
    );
  }
  static async eliminarContraOferta(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }
}

export default ContraOfertaService;
