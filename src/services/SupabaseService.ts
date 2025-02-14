import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Importación de modelos
import {
  Usuario,
  Solicitud,
  Proveedor,
  Freelancer,
  HistorialItem,
  MetodoPago,
  FaqItem,
} from '../models'; // Asegúrate de que la carpeta se llama `models` y tiene los archivos correctos

// Configuración de Supabase
const SUPABASE_URL = 'https://idngwsekicptfluqumys.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbmd3c2VraWNwdGZsdXF1bXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTcyMDcsImV4cCI6MjA1NDE3MzIwN30.sBCVdh7CxLpbtJkhtKyGeQ-mWZXZrVxWWiINhtBxhso';

// Inicialización del cliente
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

const SupabaseService = {
  async crearUsuarioAuth(correo: string, contrasena: string): Promise<string> {
    const { data, error } = await supabase.auth.signUp({
      email: correo,
      password: contrasena,
    });

    if (error) {
      console.error(`Error al registrar usuario: ${error.message}`);
      throw new Error(error.message);
    }

    return data.user?.id || '';
  },

  async guardarPerfil(userId: string, nombre: string, telefono: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .insert([{ user_id: userId, name: nombre, phone: telefono }]);
  
    if (error) {
      console.error(`Error al guardar el perfil: ${error.message}`);
      throw new Error(error.message);
    }
  },

  async autenticarUsuario(correo: string, contrasena: string): Promise<boolean> {
    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    });

    if (error) {
      console.error(`Error de autenticación: ${error.message}`);
      return false;
    }
    return true;
  },

  async obtenerUsuarioActual() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      console.error('No hay sesión activa.');
      return null;
    }

    return data.user;
  },

  async actualizarNombre(idUsuario: string, nuevoNombre: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ name: nuevoNombre })
      .eq('user_id', idUsuario);

    if (error) {
      throw new Error(`Error al actualizar el nombre: ${error.message}`);
    }
  },

  async subirFotoPerfil(idUsuario: string, foto: File): Promise<string> {
    const path = `${idUsuario}.jpg`;
    const { error } = await supabase.storage
      .from('imagenes-perfil')
      .upload(path, foto, { upsert: true });

    if (error) {
      throw new Error(`Error al subir la foto de perfil: ${error.message}`);
    }

    return `${SUPABASE_URL}/storage/v1/object/public/imagenes-perfil/${path}`;
  },

  async obtenerFreelancersPorCategoria(categoria: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('providers')
      .select('id, name, speciality')
      .eq('category', categoria);

    if (error) {
      throw new Error(`Error al obtener freelancers: ${error.message}`);
    }

    return data || [];
  },

  async crearSolicitudDeServicio(
    providerId: number,
    serviceId: number,
    descripcion: string,
    fechaServicio: string,
    imagenesUrl?: string,
  ): Promise<boolean> {
    const { error } = await supabase.from('requests').insert({
      provider_id: providerId,
      service_id: serviceId,
      request_description: descripcion,
      service_date: fechaServicio,
      images: imagenesUrl || '',
      status: 'Pendiente',
    });

    if (error) {
      console.error('Error al guardar la solicitud:', error.message);
      return false;
    }
    return true;
  },

  async obtenerHistorialUsuario(userId: string): Promise<HistorialItem[]> {
    const { data, error } = await supabase
      .from('requests')
      .select(
        `id, service_date, status, 
        services (category), 
        providers (name, profile_pic_url)`
      )
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error al obtener el historial: ${error.message}`);
    }

    return (
      data?.map((item) => ({
        id: item.id,
        proveedor: item.providers?.name || 'Desconocido',
        servicio: item.services?.category || '',
        fecha: item.service_date,
        estado: item.status,
        fotoProveedor: item.providers?.profile_pic_url || '',
      })) || []
    );
  },

  async obtenerMetodosPago(): Promise<MetodoPago[]> {
    const { data, error } = await supabase
      .from('transaction_types')
      .select('id, name');

    if (error) {
      throw new Error(`Error al obtener métodos de pago: ${error.message}`);
    }

    return data || [];
  },

  async obtenerFaqs(): Promise<FaqItem[]> {
    const { data, error } = await supabase
      .from('faqs')
      .select('question, answer');

    if (error) {
      throw new Error(`Error al obtener FAQs: ${error.message}`);
    }

    return data || [];
  },

  async guardarProveedor(userId: string, especialidad: string, descripcion: string) {
    const { error } = await supabase.from('providers').insert({
      user_id: userId,
      speciality: especialidad,
      description: descripcion,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  async obtenerDetallesProveedor(providerId: number) {
    const { data, error } = await supabase
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
  },
};

export default SupabaseService;
