import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://todcuzbuiikggzcuofck.supabase.co';

const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_RPtIDbOyQnF0vvMLxJZWSQ_Cb7oAdqb';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
