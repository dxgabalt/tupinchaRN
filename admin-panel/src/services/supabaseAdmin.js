import { createClient } from '@supabase/supabase-js';

// Importación de modelos
// Configuración de Supabase
const SUPABASE_URL = 'https://idngwsekicptfluqumys.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbmd3c2VraWNwdGZsdXF1bXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODU5NzIwNywiZXhwIjoyMDU0MTczMjA3fQ.Q75g9bfHTCvtWT-z01IJZUHFhUHg3gclC0MRK0WE46g';

// Inicialización del cliente
export const supabase_admin = createClient(SUPABASE_URL, SUPABASE_KEY);