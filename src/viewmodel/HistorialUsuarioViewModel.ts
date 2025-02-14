import {useEffect, useState} from 'react';
import {HistorialItem} from '../models/HistorialItem';
import SolicitudService from 'src/services/SolicitudService';

export function useHistorialUsuarioViewModel(userId: string) {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      const historialData =
        await SolicitudService.obtenerHistorialUsuario(userId);
      setHistorial(historialData);
    };

    fetchHistorial();
  }, [userId]);

  return {historial};
}
