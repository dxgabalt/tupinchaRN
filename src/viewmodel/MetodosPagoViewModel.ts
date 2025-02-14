import {useEffect, useState} from 'react';
import {MetodoPago} from '../models/MetodoPago';
import supabaseService from '../services/SupabaseService';

export function useMetodosPagoViewModel() {
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);

  useEffect(() => {
    const fetchMetodosPago = async () => {
      const metodos = await supabaseService.obtenerMetodosPago();
      setMetodosPago(metodos);
    };

    fetchMetodosPago();
  }, []);

  return {metodosPago};
}
