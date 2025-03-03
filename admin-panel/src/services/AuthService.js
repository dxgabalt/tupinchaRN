import { PortafolioService } from "./PortafolioService";
import { ProviderServiceService } from "./ProviderServiceService";
import { supabase_admin } from "./supabaseAdmin";
import { supabase_client } from "./supabaseClient";
import SupabaseService from "./SupabaseService";

export class AuthService {
  static async autenticarUsuario(correo, contrasena) {
    const { data, error } = await supabase_client.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    });

    if (error) {
      console.error(`Error de autenticación: ${error.message}`, error);
      return { success: false, error };
    }

    console.log("Autenticación exitosa:", data);
    return { success: true, data };
  }
  static async obtenerUsuarios() {
    try {
      // Obtener usuarios de auth
      const { data: usuariosAuth, error: errorAuth } = await supabase_admin.auth.admin.listUsers();
      if (errorAuth || !usuariosAuth?.users) {
        console.error("Error obteniendo usuarios:", errorAuth);
        return [];
      }
  
      // Obtener perfiles desde la tabla profiles
      const { data: perfiles, error: errorPerfil } = await supabase_client
        .from("profiles")
        .select("id, name, role_id, roles(id, name),municipio_id,municipios(id,name,provincia_id), phone, rating, is_verified,profile_pic_url, user_id");
  
      if (errorPerfil || !perfiles) {
        console.error("Error obteniendo perfiles:", errorPerfil);
        return [];
      }
  
      // Obtener proveedores solo si hay usuarios con role_id === 3
      const proveedoresIds = perfiles.filter(p => p.role_id === 3).map(p => p.id);
  
      let proveedores = [];
      if (proveedoresIds.length > 0) {
        const { data: providersData, error: errorProviders } = await supabase_client
          .from("providers")
          .select("*,provider_services(id,provider_id,service_id)")
          .in("profile_id", proveedoresIds);
  
        if (errorProviders) {
          console.error("Error obteniendo proveedores:", errorProviders);
        } else {
          proveedores = providersData || [];
        }
      }
  
      // Obtener portafolios de proveedores
      let portafolios = [];
      if (proveedores.length > 0) {
        const providerIds = proveedores.map(p => p.id);
        const { data: portafolioData, error: errorPortafolio } = await supabase_client
          .from("portafolio_provider")
          .select("*")
          .in("provider_id", providerIds);
  
        if (errorPortafolio) {
          console.error("Error obteniendo portafolios:", errorPortafolio);
        } else {
          portafolios = portafolioData || [];
        }
      }
  
      // Mapear y combinar los datos
      return usuariosAuth.users.map((usuario, index) => {
        const perfil = perfiles.find((p) => p.user_id === usuario.id);
        const provider = proveedores.find((p) => p.profile_id === perfil?.id);
        const portafolio = provider ? portafolios.filter(p => p.provider_id === provider.id) : [];
         return {
          id: usuario.id,
          id_profile: perfil?.id,
          nombre: perfil?.name ?? usuario.email, // Usa el nombre o el email como fallback
          tipo: perfil?.roles?.name ?? "Desconocido", // Si no hay rol, asigna "Desconocido"
          categoria: perfil?.role_id === 3 ? "Pendiente" : "No aplica", // Categoría si es proveedor
          correo: usuario.email,
          telefono: perfil?.phone ?? "No registrado",
          calificacion: perfil?.rating ?? 0, // Si no hay calificación, asigna 0
          estado: perfil?.is_verified ? "Activo" : "Inactivo",
          especialidad: provider?.speciality,
          descripcion: provider?.description,
          provincia_id: perfil?.municipios.provincia_id,
          municipio_id: perfil?.municipio_id,
          provider_id: provider?.id,
          is_premium: provider?.is_premium?? false, 
          service_id: provider?.provider_services[0]?.service_id,
          imagen: perfil?.profile_pic_url,
          portafolio, 
          orden: index + 1,
        };
      });
    } catch (error) {
      console.error("Error inesperado obteniendo usuarios:", error);
      return [];
    }
  }
  static async actualizarPerfilPanel(idUsuario, nuevoNombre, status) {
    const { error } = await supabase_client
      .from("profiles")
      .update({ name: nuevoNombre, is_verified: status })
      .eq("user_id", idUsuario);

    if (error) {
      throw new Error(`Error al actualizar el nombre: ${error.message}`);
    }
  }
  static async actualizarPremium(id, nuevoEstado){
    const { error } = await supabase_client
      .from("providers")
      .update({ is_premium: nuevoEstado })
      .eq("id", id);

    if (error) {
      throw new Error(`Error al actualizar el estado de premium: ${error.message}`);
    }
  }  
  static async cambiarEstadoUsuario(id, nuevoEstado){
    const { error } = await supabase_client
      .from("profiles")
      .update({ is_verified: nuevoEstado })
      .eq("id", id);

    if (error) {
      throw new Error(`Error al actualizar el estado de premium: ${error.message}`);
    }
  }
  static async actualizarPerfil(id, datosActualizados) {
    return await SupabaseService.actualizarRegistro(
      "profiles",
      datosActualizados,
      "user_id",
      id
    );
  }
  static async eliminarPerfil(id) {
    try {
      // Eliminar perfil de la tabla de usuarios
      const { error: profileError } = await supabase_client
        .from("profiles")
        .delete()
        .eq("user_id", id);

      if (profileError) throw new Error(profileError.message);

      // Eliminar usuario de autenticación en Supabase
      const { error: authError } = await supabase_admin.auth.admin.deleteUser(
        id
      );
      if (authError) throw new Error(authError.message);

      return { success: true, message: "Se ha eliminado exitosamente" };
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return { success: false, message: error.message };
    }
  }
  static async crearUsuarioAuth(
    correo,
    contrasena
  ){
    const { data, error } = await supabase_client.auth.signUp({
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
    }
    const { error: errorLogin } =
      await supabase_client.auth.signInWithPassword({
        email: correo,
        password: contrasena,
      });
    if (errorLogin) {
      console.error(`Error al confirmar usuario: ${errorLogin.message}`);
      throw new Error(errorLogin.message);
    }
    return data.user?.id || "";
  }
  static async guardarProveedor(
    userId,
    nombre,
    telefono,
    esProveedor = false,
    speciality = " ",
    description = " ",
    servicio_id =0,
    municipio_id=0,
    profile_pic_url = " "
  ) {
    // Insertar perfil en "profiles"
    const { data: profile, error: profileError } = await supabase_client
      .from("profiles")
      .insert({
        user_id: userId,
        name: nombre,
        phone: telefono,
        role_id: esProveedor ? 3 : 2,
        rating: 0,
        profile_pic_url: profile_pic_url,
        is_verified: false,
        municipio_id:municipio_id
      })
      .select();

    if (profileError) {
      console.error(`Error al guardar el perfil: ${profileError.message}`);
      throw new Error(profileError.message);
    }

    if (profile && esProveedor) {
      const profile_id = profile[0]?.id;

      // Insertar en "providers"
      const { data: provider, error: providerError } =
        await supabase_client
          .from("providers")
          .insert({
            profile_id: profile_id, // Relacionar con el perfil
            phone: telefono,
            speciality: speciality || "",
            availability: description || "",
            description: description || "",
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
          speciality,
          description,
          ""
        );
                await ProviderServiceService.agregarServicioProveedor(provider_id,servicio_id)
        
      }
    }
  }
}
