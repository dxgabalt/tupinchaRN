export interface Solicitud {
  provider_id: number;
  service_id: number;
  request_description: string;
  service_date: string;
  images?: string;
  status: string;
  user_id: string;
}
