import {useEffect, useState} from 'react';
import {FaqItem} from '../models/FaqItem';
import supabaseService from '../services/SupabaseService';

export function useSoporteViewModel() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      const faqsData = await supabaseService.obtenerFaqs();
      setFaqs(faqsData);
    };

    fetchFaqs();
  }, []);

  return {faqs};
}
