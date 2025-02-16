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
}
