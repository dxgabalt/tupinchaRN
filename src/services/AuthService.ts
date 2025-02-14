import {createClient, SupabaseClient} from '@supabase/supabase-js';
export class AuthService {
  private static SUPABASE_URL = 'https://idngwsekicptfluqumys.supabase.co';
  private static SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbmd3c2VraWNwdGZsdXF1bXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTcyMDcsImV4cCI6MjA1NDE3MzIwN30.sBCVdh7CxLpbtJkhtKyGeQ-mWZXZrVxWWiINhtBxhso';

  private static supabase: SupabaseClient = createClient(
    AuthService.SUPABASE_URL,
    AuthService.SUPABASE_KEY,
  );
  static async crearUsuarioAuth(
    correo: string,
    contrasena: string,
  ): Promise<string> {
    const {data, error} = await AuthService.supabase.auth.signUp({
      email: correo,
      password: contrasena,
    });

    if (error) {
      console.error(`Error al registrar usuario: ${error.message}`);
      throw new Error(error.message);
    }

    return data.user?.id || '';
  }

  static async guardarPerfil(
    userId: string,
    nombre: string,
    telefono: string,
  ): Promise<void> {
    const {error} = await AuthService.supabase
      .from('profiles')
      .insert([{user_id: userId, name: nombre, phone: telefono}]);

    if (error) {
      console.error(`Error al guardar el perfil: ${error.message}`);
      throw new Error(error.message);
    }
  }

  static async autenticarUsuario(
    correo: string,
    contrasena: string,
  ): Promise<boolean> {
    const {error} = await AuthService.supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    });

    if (error) {
      console.error(`Error de autenticación: ${error.message}`);
      return false;
    }
    return true;
  }

  static async obtenerUsuarioActual() {
    const {data, error} = await AuthService.supabase.auth.getUser();

    if (error || !data.user) {
      console.error('No hay sesión activa.');
      return null;
    }

    return data.user;
  }

  static async actualizarNombre(
    idUsuario: string,
    nuevoNombre: string,
  ): Promise<void> {
    const {error} = await AuthService.supabase
      .from('profiles')
      .update({name: nuevoNombre})
      .eq('user_id', idUsuario);

    if (error) {
      throw new Error(`Error al actualizar el nombre: ${error.message}`);
    }
  }
  static async subirFotoPerfil(idUsuario: string, foto: File): Promise<string> {
    const path = `${idUsuario}.jpg`;
    const {error} = await AuthService.supabase.storage
      .from('imagenes-perfil')
      .upload(path, foto, {upsert: true});

    if (error) {
      throw new Error(`Error al subir la foto de perfil: ${error.message}`);
    }

    return `${AuthService.SUPABASE_URL}/storage/v1/object/public/imagenes-perfil/${path}`;
  }
}
