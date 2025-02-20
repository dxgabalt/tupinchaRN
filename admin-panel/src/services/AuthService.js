import { supabase_admin } from './supabaseAdmin';
import { supabase_client } from './supabaseClient';
import SupabaseService from './SupabaseService';

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

        console.log('Autenticación exitosa:', data);
        return { success: true, data };
    }
    static async obtenerUsuarios() {
        // Obtener usuarios de auth
        const { data: usuariosAuth, error: errorAuth } =
            await supabase_admin.auth.admin.listUsers();
        if (errorAuth) {
            console.error('Error obteniendo usuarios:', errorAuth);
            return [];
        }

        // Obtener perfiles desde la tabla perfil
        const { data: perfiles, error: errorPerfil } = await supabase_client
            .from('profiles')
            .select('id,name,role_id,roles(id,name),phone,rating,is_verified,user_id');
        if (errorPerfil) {
            console.error('Error obteniendo perfiles:', errorPerfil);
            return [];
        }

        // Mapear y combinar los datos
        return usuariosAuth.users.map((usuario, index) => {
            const perfil = perfiles.find(p => p.user_id === usuario.id);
            return {
                id: usuario.id,
                nombre: perfil?.name || usuario.email, // Usa el nombre o el email como fallback
                tipo: perfil?.roles.name, // Suponiendo que role_id = 1 es Proveedor
                categoria: perfil?.role_id === 1 ? 'Pendiente' : null, // Categoría si es proveedor
                correo: usuario.email,
                telefono: perfil?.phone || null,
                calificacion: perfil?.rating || null,
                estado: perfil?.is_verified ? 'Activo' : 'Pendiente',
                orden: index + 1,
            };
        });
    }
    static async actualizarPerfilPanel(
        idUsuario,
        nuevoNombre,
        status
      ) {
        const {error} = await supabase_client
          .from('profiles')
          .update({name: nuevoNombre, is_verified: status})
          .eq('user_id', idUsuario);
    
        if (error) {
          throw new Error(`Error al actualizar el nombre: ${error.message}`);
        }
      }
      static async actualizarPerfil(id,datosActualizados){
        return await SupabaseService.actualizarRegistro('profiles', datosActualizados, 'user_id', id);

      }
      static async eliminarPerfil(id){
        try {
                 // Eliminar perfil de la tabla de usuarios
                 const { error: profileError } = await supabase_client
                 .from('profiles')
                 .delete()
                 .eq("user_id", id);
         
               if (profileError) throw new Error(profileError.message);
         
            // Eliminar usuario de autenticación en Supabase
            const { error: authError } = await supabase_admin.auth.admin.deleteUser(id);
            if (authError) throw new Error(authError.message);
      
       
            return { success: true, message: "Se ha eliminado exitosamente" };
          } catch (error) {
            console.error("Error al eliminar usuario:", error);
            return { success: false, message: (error).message };
          }
        }
      }

