import { supabase_client } from "./supabaseClient";
import SupabaseService from "./SupabaseService";

export class Comisioneservice {
  static TABLE_NAME = "comisiones";

  // Obtener todos los comisiones
  static async obtenerTodos(param) {
    return await SupabaseService.obtenerDatos(
      this.TABLE_NAME,
      "*,services(id,category),providers(id,phone,description,speciality,availability,profiles(id,name,phone))",
      param
    );
  }

  // Obtener un comision por ID
  static async obtenerPorId(id) {
    const comision = await SupabaseService.obtenerDatos(this.TABLE_NAME, "*", {
      id,
    });
    return comision.length > 0 ? comision[0] : null;
  }

  // Crear un nuevo comision
  static async crear(datos) {
    return await SupabaseService.crearRegistro(this.TABLE_NAME, datos);
  }
  static async cambiarEstado(id, nuevoEstado) {
    let updateData = { estado: nuevoEstado };

    if (nuevoEstado === "Prórroga") {
      const { data, error: fetchError } = await supabase_client
        .from(this.TABLE_NAME)
        .select("fecha_pago") // Asegúrate de seleccionar el campo correcto
        .eq("id", id)
        .single();

      if (fetchError) {
        throw new Error(
          `Error al obtener la fecha actual: ${fetchError.message}`
        );
      }

      if (!data || !data.fecha_pago) {
        throw new Error(`La fecha de pago es inválida o no está definida.`);
      }

      // Convertir la fecha a un objeto Date
      const fechaActual = new Date(data.fecha_pago);
      if (isNaN(fechaActual.getTime())) {
        throw new Error(`La fecha obtenida no es válida: ${data.fecha_pago}`);
      }

      // Sumar 7 días
      fechaActual.setDate(fechaActual.getDate() + 7);

      // Agregar la nueva fecha al objeto de actualización
      updateData.fecha_pago = fechaActual.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    }

    const { error } = await supabase_client
      .from(this.TABLE_NAME)
      .update(updateData)
      .eq("id", id);

    if (error) {
      throw new Error(`Error al actualizar el estado: ${error.message}`);
    }
  }
  static async actualizarComision(id, nuevaComision) {
    const { error } = await supabase_client
      .from(this.TABLE_NAME)
      .update({ comision: nuevaComision })
      .eq("id", id);

    if (error) {
      throw new Error(`Error al actualizar la comisión: ${error.message}`);
    }
  }
  static async actualizarComisionGlobal(nuevaComision) {
    const { error } = await supabase_client
      .from("comisiones")
      .update({ comision: nuevaComision }) // Sin WHERE para actualizar todos
      .neq("id", 0); // Truco: evita el error forzando una condición válida

    if (error)
      throw new Error(
        `Error al actualizar todas las comisiones: ${error.message}`
      );
  }

  // Actualizar un comision por ID
  static async actualizar(id, datos) {
    return await SupabaseService.actualizarRegistro(
      this.TABLE_NAME,
      datos,
      "id",
      id
    );
  }

  // Eliminar un comision por ID
  static async eliminar(id) {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }
}
