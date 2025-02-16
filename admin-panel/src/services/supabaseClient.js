import { createClient } from '@supabase/supabase-js';

// Importación de modelos
// Configuración de Supabase
const SUPABASE_URL = 'https://idngwsekicptfluqumys.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbmd3c2VraWNwdGZsdXF1bXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTcyMDcsImV4cCI6MjA1NDE3MzIwN30.sBCVdh7CxLpbtJkhtKyGeQ-mWZXZrVxWWiINhtBxhso';

// Inicialización del cliente
export const supabase_client = createClient(SUPABASE_URL, SUPABASE_KEY);