import {useEffect, useState} from 'react';
import {MetodoPago} from '../models/MetodoPago';
import TransactionTypeService from '../services/TransactionType';

export function useMetodosPagoViewModel() {
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);

  useEffect(() => {
    const fetchMetodosPago = async () => {
      const metodos = await TransactionTypeService.obtenerMetodosPago();
      setMetodosPago(metodos);
    };

    fetchMetodosPago();
  }, []);

  return {metodosPago};
}
