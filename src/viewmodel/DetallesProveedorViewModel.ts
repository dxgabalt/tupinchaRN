import {useEffect, useState} from 'react';
import {Freelancer} from '../models/Freelancer';
import FreelancerService from 'src/services/FreelancerService';

export function useDetallesProveedorViewModel(providerId: number) {
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);

  useEffect(() => {
    const fetchFreelancer = async () => {
      const freelancerData =
        await FreelancerService.obtenerFreelancerPorId(providerId);
      setFreelancer(freelancerData);
    };

    fetchFreelancer();
  }, [providerId]);

  return {freelancer};
}
