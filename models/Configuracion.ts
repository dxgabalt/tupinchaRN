export interface Configuracion{
    id?: number;
    porcentaje_comision: number;
    metodos_aceptados: JSON;
    frecuencia_pago: string;
    is_suscripcion: boolean;
    prorroga: number;
    is_notificacion: boolean;
}