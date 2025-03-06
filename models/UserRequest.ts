export interface UserRequest{
usuario_id: string;
nombre: string;
telefono: string;
municipio_id: number;
servicio_id?: number;
esProveedor: boolean;
esComision?:boolean;
especialidad?: string;
descripcion?: string;
url_foto?: string;
speciality?: string;
description?: string;    
plan_id?:number
}