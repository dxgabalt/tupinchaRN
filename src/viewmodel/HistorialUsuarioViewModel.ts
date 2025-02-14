import {useEffect, useState} from 'react';
import {HistorialItem} from '../models/HistorialItem';
import supabaseService from '../services/SupabaseService';

export function useHistorialUsuarioViewModel(userId: string) {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      const historialData =
        await supabaseService.obtenerHistorialUsuario(userId);
      setHistorial(historialData);
    };

    fetchHistorial();
  }, [userId]);

  return {historial};
}
