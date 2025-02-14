import {useEffect, useState} from 'react';
import {DetalleSolicitud} from '../models/DetalleSolicitud';
import supabaseService from '../services/SupabaseService';

export function useDetalleSolicitudViewModel(solicitudId: number) {
  const [detalleSolicitud, setDetalleSolicitud] =
    useState<DetalleSolicitud | null>(null);

  useEffect(() => {
    const fetchDetalleSolicitud = async () => {
      const detalle =
        await supabaseService.obtenerDetalleSolicitud(solicitudId);
      setDetalleSolicitud(detalle);
    };

    fetchDetalleSolicitud();
  }, [solicitudId]);

  return {detalleSolicitud};
}
