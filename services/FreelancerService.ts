/* eslint-disable @typescript-eslint/no-unused-vars */
import SupabaseService from './SupabaseService';
import {Freelancer} from '../models/Freelancer';
import {createClient, SupabaseClient} from '@supabase/supabase-js';

export class FreelancerService {
  private static readonly TABLE_NAME = 'freelancers';
  private static SUPABASE_URL = 'https://idngwsekicptfluqumys.supabase.co';
  private static SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbmd3c2VraWNwdGZsdXF1bXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTcyMDcsImV4cCI6MjA1NDE3MzIwN30.sBCVdh7CxLpbtJkhtKyGeQ-mWZXZrVxWWiINhtBxhso';

  private static supabase: SupabaseClient = createClient(
    FreelancerService.SUPABASE_URL,
    FreelancerService.SUPABASE_KEY,
  );
  static async obtenerTodosLosFreelancers(): Promise<Freelancer[]> {
    return await SupabaseService.obtenerDatos<Freelancer>(this.TABLE_NAME);
  }

  static async obtenerFreelancerPorId(id: number): Promise<Freelancer | null> {
    const freelancers = await SupabaseService.obtenerDatos<Freelancer>(
      this.TABLE_NAME,
      '*',
      {id},
    );
    return freelancers[0] || null;
  }

  static async obtenerFreelancersPorCategoria(
    categoria: string,
  ): Promise<Freelancer[]> {
    return await SupabaseService.obtenerDatos<Freelancer>(
      this.TABLE_NAME,
      '*',
      {category: categoria},
    );
  }

  static async guardarProveedor(
    userId: string,
    especialidad: string,
    descripcion: string,
  ) {
    const {error} = await FreelancerService.supabase.from('providers').insert({
      user_id: userId,
      speciality: especialidad,
      description: descripcion,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  static async actualizarFreelancer(
    id: number,
    datosActualizados: Partial<Freelancer>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Partial<Freelancer>>(
      this.TABLE_NAME,
      datosActualizados,
      'id',
      id,
    );
  }

  static async eliminarFreelancer(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }

  static async obtenerDetallesProveedor(providerId: number) {
    const {data, error} = await FreelancerService.supabase
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

export default FreelancerService;
