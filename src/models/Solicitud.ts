export interface Solicitud {
  providerId: number;
  serviceId: number;
  descripcion: string;
  fechaServicio: string;
  imagenesUrl?: string;
  status: string;
}
