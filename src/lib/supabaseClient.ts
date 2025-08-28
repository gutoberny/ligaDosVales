import { createClient } from "@supabase/supabase-js";

// As variáveis de ambiente são carregadas pelo Create React App
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Verifica se as variáveis foram definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
