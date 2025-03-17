import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ImageService } from "./ImageService";
import { PortafolioService } from "./Portafolio";
import { supabase_client } from "./supabaseClient";
import { ProviderServiceService } from "./ProviderServiceService";
import { UserRequest } from "../models/UserRequest";
import { ConfiguracionService } from "./ConfiguracionService";
import { supabase_admin } from "../admin-panel/src/services/supabaseAdmin";
export class AuthService {
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
        const { data, error } = await supabase_client.auth.signUp({
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
          await supabase_admin.auth.admin.updateUserById(
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
          await supabase_client.auth.signInWithPassword({
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
    provincia_id:number,
    municipio_id:number,
    profile_pic_url: string = " "
  ): Promise<void> {
    const { data: user, error: authError } =
      await supabase_client.auth.getUser();
    if (authError || !user) {
      throw new Error("Usuario no autenticado");
    }

    const { error } = await supabase_client
      .from("profiles")
      .update({
        name: nombre,
        phone: telefono,
        role_id: esProveedor ? 3 : 2,
        profile_pic_url: profile_pic_url,
        provincia_id: provincia_id,
        municipio_id: municipio_id,
      })
      .eq("user_id", userId);

    if (error) {
      console.error(`Error al actualizar el perfil: ${error.message}`);
      throw new Error(error.message);
    }
  }
  static async recuperarContrasena(email: string) {
    const { error } = await supabase_client.auth.resetPasswordForEmail(
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
      const { error } = await supabase_client.auth.signOut();
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
      await supabase_client.auth.getUser();
    if (authError || !userData?.user) {
      throw new Error("Usuario no autenticado");
    }

    // Insertar perfil en "profiles"
    const { data: profile, error: profileError } = await supabase_client
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
      const { data: provider, error: providerError } =
        await supabase_client
          .from("providers")
          .insert({
            profile_id: profile_id, // Relacionar con el perfil
            phone: userRequest.telefono,
            speciality: userRequest.speciality || "",
            availability: userRequest.description || "",
            description: userRequest.description || "",
            plan_id:
              userRequest.esComision === false ? userRequest.plan_id : null,
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
        if (userRequest.esComision === true) {
          const configuracion = await ConfiguracionService.obtenerPorId(1);
          const fechaActual = new Date().toISOString().split("T")[0];
          const { data, error } = await supabase_client
            .from("comisiones")
            .insert([
              {
                proveedor_id: provider_id, // ID del proveedor
                servicio_id: userRequest.servicio_id || 0, // ID del servicio
                estado: "pendiente", // Estado de la comisión
                comision: configuracion?.porcentaje_comision, // Monto de la comisión
                fecha_pago: fechaActual, // Fecha de pago
              },
            ]);
        }
        await PortafolioService.agregarServicio(
          provider_id,
          userRequest.speciality || " ",
          userRequest.descripcion || " ",
          userRequest.servicio_id || 0,
          ""
        );
      }
    }
  }

  static async autenticarUsuario(correo: string, contrasena: string) {
    const { data, error } = await supabase_client.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    });
    const { data: profiles } = await supabase_client
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
    const { data, error } = await supabase_client.auth.getUser();

    if (error || !data.user) {
      console.error("No hay sesión activa.");
      return null;
    }

    return data.user;
  }
  static async  esAutenticado():Promise<boolean>{
    let isauthenticated = false;
    const { data, error } = await supabase_client.auth.getUser();
    if (error || !data.user) {
      isauthenticated = false;
    }else{
      isauthenticated = true;
    }
    return isauthenticated;
  }
  static async obtenerPerfil() {
    const { data, error } = await supabase_client.auth.getUser();

    if (error || !data.user) {
      console.error("No hay sesión activa.", error);
      return null;
    }

    // Obtener el perfil del usuario
    const { data: profile, error: profileError } = await supabase_client
      .from("profiles")
      .select("*,provincias(id,nombre),municipios(id,name)")
      .eq("user_id", data.user.id)
      .single();

    if (profileError || !profile) {
      console.error("Error al obtener el perfil:", profileError);
      return null;
    }
    let providers = null;
    let portafolioProvider = null;
    let ubicacionProviders = null; 
    // Si el rol es 3, obtener datos adicionales
    if (profile.role_id === 3) {
      const { data: providerData, error: providerError } =
        await supabase_client
          .from("providers")
          .select("*,planes(id,nombre)")
          .eq("profile_id", profile.id);
      if (providerError) {
        console.error("Error al obtener el proveedor:", providerError);
      } else {
        providers = providerData[0];
      }
      const { data: portafolioData, error: portafolioError } =
        await supabase_client
          .from("portafolio_provider")
          .select("*")
          .eq("provider_id", providers ? providers.id : -1); // Evitar error si providers es null

      if (portafolioError) {
        console.error("Error al obtener el portafolio:", portafolioError);
      } else {
        portafolioProvider = portafolioData;
      } 
      const { data: ubicacionData, error: ubicacionError } =
        await supabase_client
          .from("provider_locations")
          .select("*,provincias(id,nombre),municipios(id,name)")
          .eq("provider_id", providers ? providers.id : -1); // Evitar error si providers es null

      if (ubicacionError) {
        console.error("Error al obtener el portafolio:", ubicacionError);
      } else {
        ubicacionProviders = ubicacionData;
      }
    }

    return {
      ...profile, // Datos obtenidos de "profiles"
      provider: providers,
      portafolio: portafolioProvider,
      provider_locations: ubicacionProviders,
      email: data.user.email, // Email del usuario autenticado
    };
  }

  static async actualizarNombre(
    idUsuario: string,
    nuevoNombre: string
  ): Promise<void> {
    const { error } = await supabase_client
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
