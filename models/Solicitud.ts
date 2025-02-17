export interface Solicitud {
  providerId: number;
  serviceId: number;
  request_description: string;
  service_date: string;
  images?: string;
  status: string;
  user_id: string;
}
