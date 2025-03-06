import { ContraOfertaNota } from "./ContraOfertaNota";
import { CotizacionNota } from "./CotizacionNota";

export interface ContraOferta {
  id?: number;
  costo_mano_obra: number;
  costo_materiales: number;
  descripcion: string;
  user_id: string;
  request_id: number;
  contraoferta_notas: ContraOfertaNota[];
}
