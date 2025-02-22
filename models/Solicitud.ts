export interface Solicitud {
  provider_id: number;
  service_id: number;
  services:{
    id?: number;
    category: string;
    tags: JSON;
    icono?: string;
  }
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
  }
  request_description: string;
  service_date: string;
  images?: string;
  status: string;
  user_id: string;
}
