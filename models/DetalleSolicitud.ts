export interface DetalleSolicitud {
  id: number;
  proveedor: string;
  servicio: string;
  descripcion: string;
  fecha: string;
  estado: string;
  imagenesUrl?: string;
  fotoProveedor: string;
}
