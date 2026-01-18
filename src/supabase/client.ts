import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 在生产环境中必须提供环境变量
if (import.meta.env.PROD && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Supabase URL and anon key must be provided in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
