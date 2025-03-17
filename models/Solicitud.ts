import { ContraOferta } from "./ContraOferta";
import { Cotizacion } from "./Cotizacion";
import { RequestNota } from "./RequestNota";
import { Service } from "./Service";

export interface Solicitud {
  id?: number;
  provider_id: number;
  service_id: number;
  direccion: string;
  services: {
    id?: number;
    category: string;
    tags: any; // Se recomienda usar `any` en lugar de `JSON`, o definir un tipo adecuado si sabes su estructura.
    icono?: string;
  } | Service[]
  request_notas: RequestNota[];
  providers:{
    id?: number;
    phone: string;
    profile_id: number;
    description: string;
    speciality: string;
    ubicacion: string;
    is_premium: boolean;

    profiles: {
      id?: number;
      name: string;
      rating: number;
      profile_pic_url: string;
      phone: string;
    };
    availability: string;
  }| Perfil[]
  cotizaciones: Cotizacion[];
  contraofertas: ContraOferta[];
  request_description: string;
  service_date: string;
  images?: string;
  status: string;
  user_id: string;
  price:number;
  usuarioPerfil?: Perfil | null;
}
