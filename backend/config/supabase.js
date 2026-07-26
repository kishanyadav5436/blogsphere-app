const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://todcuzbuiikggzcuofck.supabase.co';

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_RPtIDbOyQnF0vvMLxJZWSQ_Cb7oAdqb';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
