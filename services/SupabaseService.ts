import {createClient, SupabaseClient} from '@supabase/supabase-js';

// Importación de modelos
// Configuración de Supabase
const SUPABASE_URL = 'https://idngwsekicptfluqumys.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbmd3c2VraWNwdGZsdXF1bXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTcyMDcsImV4cCI6MjA1NDE3MzIwN30.sBCVdh7CxLpbtJkhtKyGeQ-mWZXZrVxWWiINhtBxhso';
  const  SUPABASE_ADMIN_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbmd3c2VraWNwdGZsdXF1bXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODU5NzIwNywiZXhwIjoyMDU0MTczMjA3fQ.Q75g9bfHTCvtWT-z01IJZUHFhUHg3gclC0MRK0WE46g';

// Inicialización del cliente
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
//Inicializacion de admin
const supabaseAdmin: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ADMIN_KEY,
);
const SupabaseService = {
  async obtenerDatos<T>(
    tabla: string,
    columnas = '*', // Valor por defecto
    filtro: Record<string, any> = {},
  ): Promise<T[]> {
    const query = supabase.from(tabla).select(columnas);

    // Aplicar filtros dinámicamente
    for (const [campo, valor] of Object.entries(filtro)) {
      query.eq(campo, valor);
    }

    const {data, error} = await query;

    if (error) {
      console.error(`Error al obtener datos de ${tabla}: ${error.message}`);
      return []; // Devolvemos un array vacío en caso de error
    }

    return data as T[];
  },
  async crearRegistro<T>(tabla: string, datos: Partial<T>): Promise<boolean> {
    const {error} = await supabase.from(tabla).insert(datos);

    if (error) {
      console.error(`Error al crear registro en ${tabla}:`, error.message);
      return false;
    }
    return true;
  },

  async actualizarRegistro<T>(
    tabla: string,
    datos: Partial<T>,
    columnaCondicion: string,
    valorCondicion: any,
  ): Promise<boolean> {
    const {error} = await supabase
      .from(tabla)
      .update(datos)
      .eq(columnaCondicion, valorCondicion);

    if (error) {
      console.error(`Error al actualizar registro en ${tabla}:`, error.message);
      return false;
    }
    return true;
  },
  async eliminarRegistro(
    tabla: string,
    columnaCondicion: string,
    valorCondicion: any,
  ): Promise<boolean> {
    const {error} = await supabase
      .from(tabla)
      .delete()
      .eq(columnaCondicion, valorCondicion);

    if (error) {
      console.error(`Error al eliminar registro de ${tabla}:`, error.message);
      return false;
    }
    return true;
  },
};

export default SupabaseService;
