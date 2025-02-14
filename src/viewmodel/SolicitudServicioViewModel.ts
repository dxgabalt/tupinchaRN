import {useState} from 'react';
import supabaseService from '../services/SupabaseService';

export function useSolicitudServicioViewModel() {
  const [mensajeEstado, setMensajeEstado] = useState<string>('');

  const enviarSolicitud = async (
    providerId: number,
    serviceId: number,
    descripcion: string,
    fechaServicio: string,
    imagenesUrl?: string,
  ) => {
    try {
      await supabaseService.crearSolicitudDeServicio(
        providerId,
        serviceId,
        descripcion,
        fechaServicio,
        imagenesUrl,
      );
      setMensajeEstado('Solicitud enviada con éxito.');
    } catch (error) {
      if (error instanceof Error) {
        setMensajeEstado(`Error al enviar la solicitud: ${error.message}`);
      }
    }
  };

  return {mensajeEstado, enviarSolicitud};
}
