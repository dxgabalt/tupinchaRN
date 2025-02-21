import { createClient, SupabaseClient } from "@supabase/supabase-js";
export class AuthService {
  private static SUPABASE_URL = "https://idngwsekicptfluqumys.supabase.co";
  private static SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbmd3c2VraWNwdGZsdXF1bXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTcyMDcsImV4cCI6MjA1NDE3MzIwN30.sBCVdh7CxLpbtJkhtKyGeQ-mWZXZrVxWWiINhtBxhso";
  private static SUPABASE_ADMIN_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbmd3c2VraWNwdGZsdXF1bXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODU5NzIwNywiZXhwIjoyMDU0MTczMjA3fQ.Q75g9bfHTCvtWT-z01IJZUHFhUHg3gclC0MRK0WE46g";

  private static supabase: SupabaseClient = createClient(
    AuthService.SUPABASE_URL,
    AuthService.SUPABASE_KEY
  );
  private static supabaseAdmin: SupabaseClient = createClient(
    AuthService.SUPABASE_URL,
    AuthService.SUPABASE_ADMIN_KEY
  );

  static async crearUsuarioAuth(
    correo: string,
    contrasena: string
  ): Promise<string> {
    const { data, error } = await AuthService.supabase.auth.signUp({
      email: correo,
      password: contrasena,
    });

    if (error) {
      console.error(`Error al registrar usuario: ${error.message}`);
      throw new Error(error.message);
    }

    // Autoconfirmar el usuario
    if (data.user) {
      const { error: updateError } =
        await AuthService.supabaseAdmin.auth.admin.updateUserById(
          data.user.id,
          {
            email_confirm: true,
          }
        );

      if (updateError) {
        console.error(`Error al confirmar usuario: ${updateError.message}`);
        throw new Error(updateError.message);
      }
    }
    const { error: errorLogin } =
      await AuthService.supabase.auth.signInWithPassword({
        email: correo,
        password: contrasena,
      });
    if (errorLogin) {
      console.error(`Error al confirmar usuario: ${errorLogin.message}`);
      throw new Error(errorLogin.message);
    }
    return data.user?.id || "";
  }
  static async actualizarPerfil(
    userId: string,
    nombre: string,
    telefono: string,
    esProveedor = false
  ): Promise<void> {
    const { data: user, error: authError } = await AuthService.supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Usuario no autenticado");
    }
  
    const { error } = await AuthService.supabase
      .from("profiles")
      .update({
        name: nombre,
        phone: telefono,
        role_id: esProveedor ? 2 : 1,
      })
      .eq("user_id", userId);
  
    if (error) {
      console.error(`Error al actualizar el perfil: ${error.message}`);
      throw new Error(error.message);
    }
  }
  static async recuperarContrasena  (email: string)  {
    const { error } = await AuthService.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://admin.tupincha.com/reset-password',
    });
  
    if (error) {
      console.error('Error al enviar el correo de recuperación:', error.message);
    } else {
      console.log('Correo de recuperación enviado con éxito.');
    }
  }
  static async guardarPerfil(
    userId: string,
    nombre: string,
    telefono: string,
    esProveedor = false
  ): Promise<void> {
    const user = AuthService.supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuario no autenticado");
    }
    const { error } = await AuthService.supabase.from("profiles").insert([
      {
        user_id: userId,
        name: nombre,
        phone: telefono,
        role_id: esProveedor ? 2 : 1,
        rating: 0,
        profile_pic_url: "",
        is_verified: false,
      },
    ]);

    if (error) {
      console.error(`Error al guardar el perfil: ${error.message}`);
      throw new Error(error.message);
    }
  }

  static async autenticarUsuario(correo: string, contrasena: string) {
    const { data, error } = await AuthService.supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    });
    console.log("Autenticación exitosa:", data);

    if (error) {
      console.error(`Error de autenticación: ${error.message}`, error);
      return { success: false, error };
    }
    return { success: true, data };
  }
  static async obtenerUsuarioActual() {
    const { data, error } = await AuthService.supabase.auth.getUser();

    if (error || !data.user) {
      console.error("No hay sesión activa.");
      return null;
    }

    return data.user;
  }
  static async obtenerPerfil() {
    const { data, error } = await AuthService.supabase.auth.getUser();

    if (error || !data.user) {
      console.error("No hay sesión activa.");
      return null;
    }
    const { data: profiles } = await AuthService.supabase
      .from("profiles")
      .select("*")
      .eq("user_id", data.user.id).single();
      return {
        ...profiles, // Datos obtenidos de la tabla "profiles"
        email: data.user.email, // Agregar el email del usuario autenticado
      };
  }

  static async actualizarNombre(
    idUsuario: string,
    nuevoNombre: string
  ): Promise<void> {
    const { error } = await AuthService.supabase
      .from("profiles")
      .update({ name: nuevoNombre })
      .eq("user_id", idUsuario);

    if (error) {
      throw new Error(`Error al actualizar el nombre: ${error.message}`);
    }
  }
  static async subirFotoPerfil(idUsuario: string, foto: File): Promise<string> {
    const path = `${idUsuario}.jpg`;
    const { error } = await AuthService.supabase.storage
      .from("imagenes-perfil")
      .upload(path, foto, { upsert: true });

    if (error) {
      throw new Error(`Error al subir la foto de perfil: ${error.message}`);
    }

    return `${AuthService.SUPABASE_URL}/storage/v1/object/public/imagenes-perfil/${path}`;
  }
}
