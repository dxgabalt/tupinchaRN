import { supabase_client } from "./supabaseClient";
import SupabaseService from "./SupabaseService";

export class Soporteservice {
  static TABLE_NAME = "soportes";

  // Obtener todos los soportes
  static async obtenerTodos(param) {
    // Obtener todos los perfiles directamente desde Supabase
    const { data: perfiles, error } = await SupabaseService.obtenerDatos(
        'profiles', // Nombre de la tabla de perfiles
        '*'
    );

    if (error) {
        console.error("Error al obtener los perfiles:", error);
        return [];
    }

    // Extraer los user_ids de los perfiles
    const userIds = perfiles.map(profile => profile.user_id);

    // Obtener todos los soportes
    const { data: soportes, error: errorSoportes } = await SupabaseService.obtenerDatos(
        'soportes', // Nombre de la tabla de soportes
        "*",         // Obtiene todos los campos
        param        // Parametro adicional para la consulta, como filtros si es necesario
    );

    if (errorSoportes) {
        console.error("Error al obtener los soportes:", errorSoportes);
        return [];
    }

    // Filtrar los soportes basados en los user_ids obtenidos
    const soportesFiltrados = soportes.filter(soporte => userIds.includes(soporte.user_id));

    return soportesFiltrados;
}

  static async obtenerPerfiles() {
    return await SupabaseService.obtenerDatos(
        'profiles', // Nombre de la tabla de perfiles
        "*"
    );
}
  // Obtener un soporte por ID
  static async obtenerPorId(id) {
    const soporte = await SupabaseService.obtenerDatos(this.TABLE_NAME, "*", {
      id,
    });
    return soporte.length > 0 ? soporte[0] : null;
  }

  // Crear un nuevo soporte
  static async crear(datos) {
    return await SupabaseService.crearRegistro(this.TABLE_NAME, datos);
  }
  static async cambiarEstado(id, nuevoEstado) {
    let updateData = { estado: nuevoEstado };
    const { error } = await supabase_client
      .from(this.TABLE_NAME)
      .update(updateData)
      .eq("id", id);

    if (error) {
      throw new Error(`Error al actualizar el estado: ${error.message}`);
    }
  }
  static async actualizarSoporte(id, nuevaSoporte) {
    const { error } = await supabase_client
      .from(this.TABLE_NAME)
      .update({ soporte: nuevaSoporte })
      .eq("id", id);

    if (error) {
      throw new Error(`Error al actualizar la comisión: ${error.message}`);
    }
  }
  static async actualizarSoporteGlobal(nuevaSoporte) {
    const { error } = await supabase_client
      .from("soportes")
      .update({ soporte: nuevaSoporte }) // Sin WHERE para actualizar todos
      .neq("id", 0); // Truco: evita el error forzando una condición válida

    if (error)
      throw new Error(
        `Error al actualizar todas las soportes: ${error.message}`
      );
  }

  // Actualizar un soporte por ID
  static async actualizar(id, datos) {
    return await SupabaseService.actualizarRegistro(
      this.TABLE_NAME,
      datos,
      "id",
      id
    );
  }

  // Eliminar un soporte por ID
  static async eliminar(id) {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }
}
