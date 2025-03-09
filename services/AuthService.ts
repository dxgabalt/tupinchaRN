import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ImageService } from "./ImageService";
import { PortafolioService } from "./Portafolio";
import { supabase_client } from "./supabaseClient";
import { ProviderServiceService } from "./ProviderServiceService";
import { UserRequest } from "../models/UserRequest";
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
    const maxRetries = 3; // Número máximo de reintentos
    const initialDelay = 1000; // Retardo inicial en milisegundos (1 segundo)

    let retries = 0;

    while (retries < maxRetries) {
      try {
        // Registrar al usuario
        const { data, error } = await AuthService.supabase.auth.signUp({
          email: correo,
          password: contrasena,
        });

        if (error) {
          console.error(`Error al registrar usuario: ${error.message}`);

          // Manejar el límite de envíos de correo
          if (error.code === "over_email_send_rate_limit") {
            throw new Error("Se ha excedido el límite de envíos de correo.");
          }

          throw new Error(error.message);
        }

        if (!data.user) {
          throw new Error("El usuario no se creó correctamente.");
        }

        // Autoconfirmar el usuario
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

        // Iniciar sesión automáticamente después del registro
        const { error: errorLogin } =
          await AuthService.supabase.auth.signInWithPassword({
            email: correo,
            password: contrasena,
          });

        if (errorLogin) {
          console.error(`Error al iniciar sesión: ${errorLogin.message}`);
          throw new Error(errorLogin.message);
        }

        // Retornar el ID del usuario creado
        return data.user.id;
      } catch (err) {
        retries++;

        // Si se superan los reintentos, lanzar el error
        if (retries >= maxRetries) {
          console.error(
            `Error en crearUsuarioAuth después de ${maxRetries} intentos: ${
              (err as Error).message
            }`
          );
          throw err;
        }

        // Calcular el retardo exponencial
        const delay = initialDelay * Math.pow(2, retries - 1);
        console.warn(
          `Reintentando en ${delay} ms... (Intento ${retries}/${maxRetries})`
        );

        // Esperar antes de reintentar
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Si se sale del bucle sin éxito, lanzar un error genérico
    throw new Error("No se pudo crear el usuario después de varios intentos.");
  }

  static async actualizarPerfil(
    userId: string,
    nombre: string,
    telefono: string,
    esProveedor = false,
    profile_pic_url: string = " "
  ): Promise<void> {
    const { data: user, error: authError } =
      await AuthService.supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Usuario no autenticado");
    }

    const { error } = await AuthService.supabase
      .from("profiles")
      .update({
        name: nombre,
        phone: telefono,
        role_id: esProveedor ? 3 : 2,
        profile_pic_url: profile_pic_url,
      })
      .eq("user_id", userId);

    if (error) {
      console.error(`Error al actualizar el perfil: ${error.message}`);
      throw new Error(error.message);
    }
  }
  static async recuperarContrasena(email: string) {
    const { error } = await AuthService.supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: "https://admin.tupincha.com/reset-password",
      }
    );

    if (error) {
      console.error(
        "Error al enviar el correo de recuperación:",
        error.message
      );
    } else {
      console.log("Correo de recuperación enviado con éxito.");
    }
  }

  static async logout() {
    try {
      const { error } = await AuthService.supabase.auth.signOut();
      if (error) {
        console.error("Error al cerrar sesión:", error.message);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error inesperado al cerrar sesión:", error);
      return false;
    }
  }

  static async guardarPerfil(userRequest: UserRequest): Promise<void> {
    // Obtener usuario autenticado
    const { data: userData, error: authError } =
      await AuthService.supabase.auth.getUser();
    if (authError || !userData?.user) {
      throw new Error("Usuario no autenticado");
    }

    // Insertar perfil en "profiles"
    const { data: profile, error: profileError } = await AuthService.supabase
      .from("profiles")
      .insert({
        user_id: userRequest.usuario_id,
        name: userRequest.nombre,
        phone: userRequest.telefono,
        role_id: userRequest.esProveedor ? 3 : 2,
        rating: 0,
        municipio_id: userRequest.municipio_id,
        profile_pic_url: userRequest.url_foto,
        is_verified: false,
      })
      .select();

    if (profileError) {
      console.error(`Error al guardar el perfil: ${profileError.message}`);
      throw new Error(profileError.message);
    }

    if (profile && userRequest.esProveedor) {
      const profile_id = profile[0]?.id;

      // Insertar en "providers"
      console.log(userRequest.esComision=== false);
      
      const { data: provider, error: providerError } =
        await AuthService.supabase
          .from("providers")
          .insert({
            profile_id: profile_id, // Relacionar con el perfil
            phone: userRequest.telefono,
            speciality: userRequest.speciality || "",
            availability: userRequest.description || "",
            description: userRequest.description || "",
            plan_id: userRequest.esComision=== false?userRequest.plan_id:null,
          })
          .select();

      if (providerError) {
        console.error(
          `Error al guardar el proveedor: ${providerError.message}`
        );
        throw new Error(providerError.message);
      }

      if (provider) {
        const provider_id = provider[0]?.id;
        await PortafolioService.agregarServicio(
          provider_id,
          userRequest.speciality || " ",
          userRequest.descripcion || " ",
          ""
        );
        await ProviderServiceService.agregarServicioProveedor(
          provider_id,
          userRequest.servicio_id || 0
        );
      }
    }
  }

  static async autenticarUsuario(correo: string, contrasena: string) {
    const { data, error } = await AuthService.supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    });
    console.log("Autenticación exitosa:", data);
    const { data: profiles } = await AuthService.supabase
      .from("profiles")
      .select("*")
      .eq("user_id", data.user?.id)
      .single();

    if (error) {
      console.error(`Error de autenticación: ${error.message}`, error);
      return { success: false, error, role: 0 };
    }
    return { success: true, data, role: profiles?.role_id };
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
      console.error("No hay sesión activa.", error);
      return null;
    }

    // Obtener el perfil del usuario
    const { data: profile, error: profileError } = await AuthService.supabase
      .from("profiles")
      .select("*")
      .eq("user_id", data.user.id)
      .single();

    if (profileError || !profile) {
      console.error("Error al obtener el perfil:", profileError);
      return null;
    }
    let providers = null;
    let portafolioProvider = null;
    // Si el rol es 3, obtener datos adicionales
    if (profile.role_id === 3) {
      const { data: providerData, error: providerError } =
        await AuthService.supabase
          .from("providers")
          .select("*,planes(id,nombre)")
          .eq("profile_id", profile.id);
      if (providerError) {
        console.error("Error al obtener el proveedor:", providerError);
      } else {
        providers = providerData[0];
      }
      const { data: portafolioData, error: portafolioError } =
        await AuthService.supabase
          .from("portafolio_provider")
          .select("*")
          .eq("provider_id", providers ? providers.id : -1); // Evitar error si providers es null

      if (portafolioError) {
        console.error("Error al obtener el portafolio:", portafolioError);
      } else {
        portafolioProvider = portafolioData;
      }
    }

    return {
      ...profile, // Datos obtenidos de "profiles"
      provider: providers,
      portafolio: portafolioProvider,
      email: data.user.email, // Email del usuario autenticado
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
  static async subirFotoPerfil(idUsuario: string, foto: any): Promise<string> {
    const path = `${idUsuario}.jpg`;
    const url_perfil =
      (await ImageService.subirImagen("imagenes-perfil", foto)) ?? "";
    return url_perfil;
  }
}
