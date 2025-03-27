import { PortafolioService } from "./PortafolioService";
import { supabase_admin } from "./supabaseAdmin";
import { supabase_client } from "./supabaseClient";
import SupabaseService from "./SupabaseService";

export class AuthService {
  static async autenticarUsuario(correo, contrasena) {
    const { data, error } = await supabase_client.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    });

    const {data:profileData} = await supabase_client.from('profiles').select('*').eq('user_id',data?.user.id).single()
    if (error) {
      console.error(`Error de autenticación: ${error.message}`, error);
      return { success: false, error };
    }
    return { success: true, is_admin: profileData.role_id === 1, data };
  }
  static async obtenerUsuarios(pagina=1, porPagina= 20) {
    try {
      // Obtener usuarios de auth (con paginación)
      const { data, error } = await supabase_admin.auth.admin.listUsers({
        page: pagina, 
        perPage: porPagina, // Establece el número de usuarios por página
      });
  
      if (error) {
        console.error("Error obteniendo usuarios de auth:", error);
        return { usuarios: [], total: 0 };
      }
  
      const usuariosAuth = data.users;
  
      // Obtener perfiles desde la tabla profiles
      const { data: perfiles, error: errorPerfil } = await supabase_client
        .from("profiles")
        .select("id, name, role_id, roles(id, name), municipio_id, municipios(id, name, provincia_id), phone, rating, is_verified, profile_pic_url, user_id, created_at");
  
      if (errorPerfil || !perfiles) {
        console.error("Error obteniendo perfiles:", errorPerfil);
        return { usuarios: [], total: 0 };
      }
  
      // Obtener proveedores (si es necesario)
      const { data: proveedores, error: errorProveedores } = await supabase_client
        .from("providers")
        .select("*, provider_services(id, provider_id, service_id)")
        .order("position", { ascending: false });
  
      if (errorProveedores) console.error("Error obteniendo proveedores:", errorProveedores);
  
      const { data: portafolios, error: errorPortafolio } = await supabase_client
        .from("portafolio_provider")
        .select("*, services(id, category)");
  
      if (errorPortafolio) console.error("Error obteniendo portafolios:", errorPortafolio);
  
      const { data: ubicaciones, error: errorUbicacion } = await supabase_client
        .from("provider_locations")
        .select("*, municipios(id, name), provincias(id, nombre)");
  
      if (errorUbicacion) console.error("Error obteniendo ubicaciones:", errorUbicacion);
      let totalUsuarios = 0;

      // Calcular el total de usuarios
      const { data: users, error: errorCount } = await supabase_admin.auth.admin.listUsers();

      if (errorCount) {
        console.error('Error al obtener usuarios:', errorCount);
      } else {
        totalUsuarios = users.total;
      }
     
      if (errorCount) {
        console.error("Error obteniendo el total de usuarios:", errorCount);
        return { usuarios: [], total: 0 };
      }
  
      // Mapear y combinar los datos
      const usuarios = usuariosAuth.map((usuario, index) => {
        const perfil = perfiles.find(p => p.user_id === usuario.id);
        const provider = proveedores.find(p => p.profile_id === perfil?.id);
        const portafolio = provider ? portafolios.filter(p => p.provider_id === provider.id) : [];
        const ubicacion = provider ? ubicaciones.filter(u => u.provider_id === provider.id) : [];
        return {
          id: usuario.id,
          id_profile: perfil?.id,
          created_at: perfil?.created_at,
          nombre: perfil?.name ?? usuario.email,
          tipo: perfil?.roles?.name ?? "Desconocido",
          categoria: perfil?.role_id === 3 ? "Pendiente" : "No aplica",
          correo: usuario.email,
          telefono: perfil?.phone ?? "No registrado",
          calificacion: perfil?.rating ?? 0,
          estado: perfil?.is_verified ? "Activo" : "Inactivo",
          especialidad: provider?.speciality,
          descripcion: provider?.description,
          position: provider?.position,
          provincia_id: perfil?.municipios?.provincia_id,
          municipio_id: perfil?.municipio_id,
          provider_id: provider?.id,
          is_premium: provider?.is_premium ?? false,
          service_id: provider?.provider_services?.[0]?.service_id,
          imagen: perfil?.profile_pic_url,
          rol: perfil?.roles,
          portafolio,
          ubicaciones: ubicacion,
          orden: index + 1
        };
      });
  
      // Devolver los usuarios y el total de usuarios
      return {
        usuarios,
        total: totalUsuarios,
      };
    } catch (error) {
      console.error("Error inesperado obteniendo usuarios:", error);
      return { usuarios: [], total: 0 };
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
    const { data, error } = await supabase_client
    .from("profiles")
    .update({ is_verified: nuevoEstado })
    .eq("id", id)
    .select("id, is_verified,user_id");
    const user_id = data[0].user_id;
    await supabase_admin.auth.admin.updateUserById(
      user_id,
      {
        email_confirm: nuevoEstado,
      }
    );
    if (error) {
      throw new Error(`Error al actualizar el estado de premium: ${error.message}`);
    }
  }
  static async actualizarPerfil(id,profile_id, profileData,providerData) {
    await SupabaseService.actualizarRegistro(
      "providers",
      providerData,
      "profile_id",
      profile_id
    );
    return await SupabaseService.actualizarRegistro(
      "profiles",
      profileData,
      "user_id",
      id
    );
  }  
  static async actualizarPrioridad(id, datosActualizados) {
    return await SupabaseService.actualizarRegistro(
      "providers",
      datosActualizados,
      "id",
      id
    );
  }
  static async eliminarPerfil(id) {
    try {
      // Obtener el id_profile de la tabla profiles
      const { data: profileData, error: profileError } = await supabase_client
        .from('profiles')
        .select('id')
        .eq('user_id', id)
        .single();
  
      if (profileError) throw new Error(profileError.message);
      if (!profileData) throw new Error("Perfil no encontrado");
  
      const profileId = profileData.id;
  
      // Obtener ids de providers asociados al perfil
      const { data: providerData, error: providerFetchError } = await supabase_client
        .from('providers')
        .select('id')
        .eq('profile_id', profileId);
  
      if (providerFetchError) throw new Error(providerFetchError.message);
  
      const providerIds = providerData.map(provider => provider.id);
  
      if (providerIds.length > 0) {
        // Eliminar de provider_services usando los ids de providers
        const { error: serviceError } = await supabase_client
          .from('provider_services')
          .delete()
          .in('provider_id', providerIds);
        if (serviceError) throw new Error(serviceError.message);  
             // Eliminar de comisiones usando los ids de providers
        const { error: comisionError } = await supabase_client
          .from('comisiones')
          .delete()
          .in('proveedor_id', providerIds);
        if (comisionError) throw new Error(comisionError.message);
  
        // Eliminar de portafolio_provider usando los ids de providers
        const { error: portafolioError } = await supabase_client
          .from('portafolio_provider')
          .delete()
          .in('provider_id', providerIds);
        if (portafolioError) throw new Error(portafolioError.message);      
          // Eliminar de provider_locations usando los ids de providers
        const { error: providerLocationError } = await supabase_client
          .from('provider_locations')
          .delete()
          .in('provider_id', providerIds);
        if (providerLocationError) throw new Error(providerLocationError.message);
  
        // Eliminar registros de providers
        const { error: providerError } = await supabase_client
          .from('providers')
          .delete()
          .in('id', providerIds);
        if (providerError) throw new Error(providerError.message);
      }
  
      // Eliminar el perfil usando el profileId
      const { error: profileDeleteError } = await supabase_client
        .from('profiles')
        .delete()
        .eq('id', profileId);
      if (profileDeleteError) throw new Error(profileDeleteError.message);
  
      // Eliminar usuario de autenticación en Supabase
      const { error: authError } = await supabase_admin.auth.admin.deleteUser(id);
      if (authError) throw new Error(authError.message);
  
      return { success: true, message: 'Se ha eliminado exitosamente' };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
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
          "",
          servicio_id
        );        
      }
    }
  }
}
