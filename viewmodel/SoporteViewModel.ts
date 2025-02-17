import {useEffect, useState} from 'react';
import {FaqItem} from '../models/FaqItem';
import Faqervice from '../services/FaqService';

export function useSoporteViewModel() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      const faqsData = await Faqervice.obtenerFaqs();
      setFaqs(faqsData);
    };

    fetchFaqs();
  }, []);

  return {faqs};
}
