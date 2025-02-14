import {useState} from 'react';
import supabaseService from '../services/SupabaseService';
import SolicitudService from 'src/services/SolicitudService';

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
      await SolicitudService.crearSolicitudDeServicio(
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
