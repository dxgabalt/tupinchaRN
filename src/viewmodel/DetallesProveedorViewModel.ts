import {useEffect, useState} from 'react';
import {Freelancer} from '../models/Freelancer';
import supabaseService from '../services/SupabaseService';

export function useDetallesProveedorViewModel(providerId: number) {
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);

  useEffect(() => {
    const fetchFreelancer = async () => {
      const freelancerData =
        await supabaseService.obtenerDetallesProveedor(providerId);
      setFreelancer(freelancerData);
    };

    fetchFreelancer();
  }, [providerId]);

  return {freelancer};
}
