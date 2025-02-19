import { supabase_client } from "./supabaseClient";

const SupabaseService = {
    async obtenerDatos(
        tabla,
        columnas = '*',
        filtro = {},
    ) {
        const query = supabase_client.from(tabla).select(columnas);

        // Aplicar filtros dinámicamente
        for (const [campo, valor] of Object.entries(filtro)) {
            query.eq(campo, valor);
        }

        const { data, error } = await query;

        if (error) {
            console.error(`Error al obtener datos de ${tabla}: ${error.message}`);
            return []; // Devolvemos un array vacío en caso de error
        }

        return data;
    },
    async crearRegistro(tabla, datos) {
        const { error } = await supabase_client.from(tabla).insert(datos);

        if (error) {
            console.error(`Error al crear registro en ${tabla}:`, error.message);
            return false;
        }
        return true;
    },
    async actualizarRegistro(tabla, datos, columnaCondicion, valorCondicion) {
        console.log('datos',datos);
        
        const { error } = await supabase_client
            .from(tabla)
            .update(datos)
            .eq(columnaCondicion, valorCondicion);

        if (error) {
            console.error(`Error al actualizar registro en ${tabla}:`, error.message);
            return false;
        }
        return true;
    },
    async eliminarRegistro(tabla, columnaCondicion, valorCondicion) {

        const { error } = await supabase_client
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
