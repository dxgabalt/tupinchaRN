import { Cotizacion } from "./Cotizacion";
import { Service } from "./Service";

export interface Solicitud {
  id?: number;
  provider_id: number;
  service_id: number;
  services: {
    id?: number;
    category: string;
    tags: any; // Se recomienda usar `any` en lugar de `JSON`, o definir un tipo adecuado si sabes su estructura.
    icono?: string;
  } | Service[]
  providers:{
    id?: number;
    phone: string;
    profile_id: number;
    description: string;
    speciality: string;
    ubicacion: string;
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
  request_description: string;
  service_date: string;
  images?: string;
  status: string;
  user_id: string;
  price:number;
  usuarioPerfil?: Perfil | null;
}
