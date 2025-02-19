export interface ProviderService {
  id?: number;
  provider_id: number;
  service_id: number;
  providers:{
    id?: number;
    phone: string;
    profile_id: number;
    description: string;
    speciality: string;
    profiles: {
      id?: number;
      name: string;
      rating: number;
      profile_pic_url: string;
      phone: string;
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
