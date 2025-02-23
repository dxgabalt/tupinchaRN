import { Alert } from "react-native/Libraries/Alert/Alert";
import { supabase_client } from "./supabaseClient";

export class ImageService {

  
    // 🔹 Subir imagen a Supabase
  static  async subirImagen(bucket:string,uri:any) {
      try {
        const nombreArchivo = `${bucket}/${Date.now()}.jpg`;
  
        // Convertir la imagen a blob
        const respuesta = await fetch(uri);
        const blob = await respuesta.blob();
  
        // Subir a Supabase Storage
        const { data, error } = await supabase_client.storage.from('solicitudes').upload(nombreArchivo, blob, {
          contentType: 'image/jpeg',
        });
  
        if (error) {
          throw error;
        }
  
        // 🔹 Obtener URL pública
        const urlPublica = await this.obtenerUrlPublica(nombreArchivo);
          Alert.alert('Éxito', 'Imagen subida correctamente.');
          return urlPublica;
      } catch (error) {
        Alert.alert('Error', 'No se pudo subir la imagen.');
      }
    }
  
    // 🔹 Obtener URL pública
   static async obtenerUrlPublica(ruta:string) {
      return supabase_client.storage.from('solicitudes').getPublicUrl(ruta).data.publicUrl;
    }
  }
  
