import { CotizacionNota } from "./CotizacionNota";

export interface Cotizacion {
  id?: number;
  costo_mano_obra: number;
  costo_materiales: number;
  descripcion: string;
  provider_id: number;
  request_id: number;
  cotizacion_notas: CotizacionNota[];
}
