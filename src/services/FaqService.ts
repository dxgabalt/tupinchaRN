/* eslint-disable @typescript-eslint/no-unused-vars */
import {FaqItem} from 'src/models/FaqItem';
import SupabaseService from './SupabaseService';
import {createClient, SupabaseClient} from '@supabase/supabase-js';

export class Faqervice {
  private static readonly TABLE_NAME = 'faq';
  private static SUPABASE_URL = 'https://idngwsekicptfluqumys.supabase.co';
  private static SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbmd3c2VraWNwdGZsdXF1bXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTcyMDcsImV4cCI6MjA1NDE3MzIwN30.sBCVdh7CxLpbtJkhtKyGeQ-mWZXZrVxWWiINhtBxhso';

  private static supabase: SupabaseClient = createClient(
    Faqervice.SUPABASE_URL,
    Faqervice.SUPABASE_KEY,
  );
  static async obtenerTodosLosFaq(): Promise<FaqItem[]> {
    return await SupabaseService.obtenerDatos<FaqItem>(this.TABLE_NAME);
  }
  static async obtenerFaqs(): Promise<any[]> {
    const {data, error} = await Faqervice.supabase
      .from('faqs')
      .select('question, answer');

    if (error) {
      throw new Error(`Error al obtener FAQs: ${error.message}`);
    }

    return data || [];
  }

  static async obtenerFaqPorId(id: number): Promise<FaqItem | null> {
    const faq = await SupabaseService.obtenerDatos<FaqItem>(
      this.TABLE_NAME,
      '*',
      {
        id,
      },
    );
    return faq[0] || null;
  }

  static async obtenerFaqPorCategoria(categoria: string): Promise<FaqItem[]> {
    return await SupabaseService.obtenerDatos<FaqItem>(this.TABLE_NAME, '*', {
      category: categoria,
    });
  }

  static async guardarProveedor(
    userId: string,
    especialidad: string,
    descripcion: string,
  ) {
    const {error} = await Faqervice.supabase.from('providers').insert({
      user_id: userId,
      speciality: especialidad,
      description: descripcion,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async actualizarFaq(
    id: number,
    datosActualizados: Partial<FaqItem>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Partial<FaqItem>>(
      this.TABLE_NAME,
      datosActualizados,
      'id',
      id,
    );
  }

  static async eliminarFaq(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }

  static async obtenerDetallesProveedor(providerId: number) {
    const {data, error} = await Faqervice.supabase
      .from('providers')
      .select(`id, speciality, description, name, profile_pic_url`)
      .eq('id', providerId)
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      especialidad: data.speciality,
      descripcion: data.description,
      nombre: data.name || 'Desconocido',
      fotoPerfilUrl: data.profile_pic_url || '',
    };
  }
}

export default Faqervice;
