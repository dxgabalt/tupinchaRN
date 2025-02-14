import {Transaction} from 'src/models/Transaction';
import SupabaseService from './SupabaseService';

export class TransactionService {
  private static readonly TABLE_NAME = 'transactions';

  // Obtener todos los Transaction
  static async obtenerTodos(): Promise<Transaction[]> {
    return await SupabaseService.obtenerDatos<Transaction>(this.TABLE_NAME);
  }

  // Obtener un TRANSACTION por ID
  static async obtenerPorId(id: number): Promise<Transaction | null> {
    const transaction = await SupabaseService.obtenerDatos<Transaction>(
      this.TABLE_NAME,
      '*',
      {
        id,
      },
    );
    return transaction.length > 0 ? transaction[0] : null;
  }

  // Crear un nuevo TRANSACTION
  static async crear(datos: Partial<Transaction>): Promise<boolean> {
    return await SupabaseService.crearRegistro<Transaction>(
      this.TABLE_NAME,
      datos,
    );
  }

  // Actualizar un TRANSACTION por ID
  static async actualizar(
    id: number,
    datos: Partial<Transaction>,
  ): Promise<boolean> {
    return await SupabaseService.actualizarRegistro<Transaction>(
      this.TABLE_NAME,
      datos,
      'id',
      id,
    );
  }

  // Eliminar un TRANSACTION por ID
  static async eliminar(id: number): Promise<boolean> {
    return await SupabaseService.eliminarRegistro(this.TABLE_NAME, 'id', id);
  }
}
