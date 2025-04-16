import SupabaseService from "./SupabaseService";

export class PaymentService {
  static TABLE_NAME = "payments";

  // Obtener todos los Payment
  static async obtenerTodos() {
    return await SupabaseService.obtenerDatos(this.TABLE_NAME,"*,profiles(id,name)",{}, { campo: 'fecha', ascendente: true });
  }

  // Obtener un SERVICE por ID
  static async obtenerPorId(id) {
    const Payment = await SupabaseService.obtenerDatos(this.TABLE_NAME, "*", {
      id,
    });
    return Payment.length > 0 ? Payment[0] : null;
  }

  // Crear un nuevo SERVICE
  static async crear(datos) {
    return await SupabaseService.crearRegistro(this.TABLE_NAME, datos);
  }

 
  // Actualizar un SERVICE por ID
  static async actualizar(id, datos) {
    return await SupabaseService.actualizarRegistro(this.TABLE_NAME, datos, "id", id);
  }

  // Eliminar un SERVICE por ID
  static async eliminar(id) {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, "id", id);
  }
}
