import { Portafolio } from "./Portafolio";

export interface ProviderService {
  id?: number;
  provider_id: number;
  service_id: number;
  description?: string;
  providers:{
    id?: number;
    phone: string;
    profile_id: number;
    description: string;
    speciality: string;
    ubicacion: string;
    is_premium: boolean;
    portafolio_provider: Portafolio[]
    profiles: {
      id?: number;
      name: string;
      rating: number;
      profile_pic_url: string;
      phone: string;
      municipio_id:number;
      provincia_id:number;
    };
    availability: string;
  }
  services:{
    id?: number;
    category: string;
    tags: JSON;
    icono?: string;
  }
}
