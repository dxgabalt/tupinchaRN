import { supabase_admin } from "./supabaseAdmin";
import { supabase_client } from "./supabaseClient";

export const ImageService = {
    async  uploadBase64Image(base64String, bucket) {
        try {
            const fileName = `${bucket}/${Date.now()}.jpg`;

            // Convertir Base64 a Blob
            const byteCharacters = atob(base64String.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' }); // Ajusta el tipo si es necesario
    
            // Subir imagen a Supabase Storage
            const { error } = await supabase_admin.storage.from(bucket).upload(fileName, blob, {
                contentType: 'image/jpeg',
                upsert: true, // Permite sobrescribir si el archivo ya existe
            });
    
            if (error) throw error;
    
            // Obtener URL pública
            const { data: publicUrlData } = supabase_client.storage.from(bucket).getPublicUrl(fileName);
            
            return publicUrlData.publicUrl; // Retornar la URL pública
    
        } catch (error) {
            console.error('Error al subir imagen:', error.message);
            return null;
        }
    }
}
