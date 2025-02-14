/* eslint-disable @typescript-eslint/no-unused-vars */
import SupabaseService from './SupabaseService';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {MetodoPago} from 'src/models/MetodoPago';

export class TransactionTypeService {
  private static readonly TABLE_NAME = 'transactiontypes';
  private static SUPABASE_URL = 'https://idngwsekicptfluqumys.supabase.co';
  private static SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbmd3c2VraWNwdGZsdXF1bXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTcyMDcsImV4cCI6MjA1NDE3MzIwN30.sBCVdh7CxLpbtJkhtKyGeQ-mWZXZrVxWWiINhtBxhso';

  private static supabase: SupabaseClient = createClient(
    TransactionTypeService.SUPABASE_URL,
    TransactionTypeService.SUPABASE_KEY,
  );
  static async obtenerTodosLosTransactionTypes(): Promise<MetodoPago[]> {
    return await SupabaseService.obtenerDatos<MetodoPago>(this.TABLE_NAME);
  }

  static async obtenerTransactionTypePorId(
    id: number,
  ): Promise<MetodoPago | null> {
    const transactiontypes = await SupabaseService.obtenerDatos<MetodoPago>(
      this.TABLE_NAME,
      '*',
      {id},
    );
    return transactiontypes[0] || null;
  }

  static async obtenerMetodosPago(): Promise<any[]> {
    const {data, error} = await TransactionTypeService.supabase
      .from('transaction_types')
      .select('id, name');

    if (error) {
      throw new Error(`Error al obtener métodos de pago: ${error.message}`);
    }

    return data || [];
  }
  static async guardarProveedor(
    userId: string,
    especialidad: string,
    descripcion: string,
  ) {
    const {error} = await TransactionTypeService.supabase
      .from('providers')
      .insert({
        user_id: userId,
        speciality: especialidad,
        description: descripcion,
      });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async actualizarTransactionType(
    id: number,
    datosActualizados: Partial<MetodoPago>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Partial<MetodoPago>>(
      this.TABLE_NAME,
      datosActualizados,
      'id',
      id,
    );
  }

  static async eliminarTransactionType(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}

export default TransactionTypeService;
