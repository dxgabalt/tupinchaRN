import { Alert, Platform } from "react-native";
import { supabase_client } from "./supabaseClient";
import * as FileSystem from "expo-file-system";

export class ImageService {
  // 🔹 Subir imagen a Supabase
  static async subirImagen(bucket: string, uri: string) {
    try {
      if (!uri) {
        throw new Error("No se encontró la imagen.");
      }
      const nombreArchivo = `${bucket}/${Date.now()}.jpg`;

      if (Platform.OS === "web") {
        // Convertir la imagen a blob
        const respuesta = await fetch(uri);
        const blob = await respuesta.blob();
        // Subir a Supabase Storage
        const { error } = await supabase_client.storage
          .from(bucket)
          .upload(nombreArchivo, blob, {
            contentType: "image/jpeg",
          });

        if (error) {
          throw error;
        }
        // 🔹 Obtener URL pública
        const urlPublica = await this.obtenerUrlPublica(nombreArchivo, bucket);
        Alert.alert("Éxito", "Imagen subida correctamente.");
        return urlPublica;
      } else {
        // 🔹 Convertir archivo local a base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // 🔹 Convertir base64 a blob
        const arrayBuffer = this.convertirBase64AArrayBuffer(base64);
        // 🔹 Subir a Supabase Storage
        const { data, error } = await supabase_client.storage
          .from(bucket)
          .upload(nombreArchivo, arrayBuffer, {
            contentType: "image/jpeg",
          });
        if (error) {
          throw new Error(error.message);
        }
        // 🔹 Obtener URL pública
        const urlPublica = await this.obtenerUrlPublica(nombreArchivo, bucket);
        Alert.alert("Éxito", "Imagen subida correctamente.");
        return urlPublica;
      }
    } catch (error: any) {
      console.error("Error al subir imagen:", error);
      Alert.alert("Error al subir imagen", error.message);
      return null;
    }
  }
  // 🔹 Función para convertir Base64 a Blob
  static convertirBase64AArrayBuffer = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer; // Devuelve ArrayBuffer
  };
  // 🔹 Obtener URL pública
  static async obtenerUrlPublica(ruta: string, bucket: string) {
    return supabase_client.storage.from(bucket).getPublicUrl(ruta).data
      .publicUrl;
  }
}
