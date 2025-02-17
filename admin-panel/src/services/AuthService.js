import { supabase_admin } from './supabaseAdmin';
import { supabase_client } from './supabaseClient';

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
            .select('*');
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
                tipo: perfil?.role_id === 1 ? 'Proveedor' : 'Cliente', // Suponiendo que role_id = 1 es Proveedor
                categoria: perfil?.role_id === 1 ? 'Pendiente' : null, // Categoría si es proveedor
                correo: usuario.email,
                telefono: perfil?.phone || null,
                calificacion: perfil?.rating || null,
                estado: perfil?.is_verified ? 'Activo' : 'Pendiente',
                orden: index + 1,
            };
        });
    }
}
