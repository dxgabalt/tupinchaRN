import {useEffect, useState} from 'react';
import SolicitudService from 'src/services/SolicitudService';
import {Solicitud} from 'src/models/Solicitud';

export function useDetalleSolicitudViewModel(solicitudId: number) {
  const [detalleSolicitud, setDetalleSolicitud] = useState<Solicitud | null>(
    null,
  );

  useEffect(() => {
    const fetchDetalleSolicitud = async () => {
      const detalle = await SolicitudService.obtenerSolicitudPorId(solicitudId);
      setDetalleSolicitud(detalle);
    };

    fetchDetalleSolicitud();
  }, [solicitudId]);

  return {detalleSolicitud};
}
