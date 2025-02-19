import { supabase_client } from "./supabaseClient";

export const EstadisticasService = {
  // Método para contar registros en una tabla
  async contarRegistros(tabla) {
    const { count, error } = await supabase_client
      .from(tabla)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`Error obteniendo el total de ${tabla}:`, error.message);
      return 0;
    }
    return count || 0;
  },

  // Método para obtener todas las estadísticas
   async  obtenerEstadisticas() {
    try {
      const [totalUsuarios, totalProveedores, totalServicios, totalPagos] = await Promise.all([
        this.contarRegistros('profiles'),
        this.contarRegistros('providers'),
        this.contarRegistros('services'),
        this.contarRegistros('transactions'),
      ]);

      // Calcular porcentaje completado (ajústalo según tu lógica)
      const porcentajeCompletado = totalServicios > 0
        ? Math.round((totalPagos / (totalServicios * totalProveedores)) * 100)
        : 0;

      return { totalUsuarios, totalProveedores, totalServicios, totalPagos, porcentajeCompletado };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return null;
    }
  }
};



