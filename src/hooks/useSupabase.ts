import { supabase } from '@/lib/supabase';

export const useSupabase = () => {
  return {
    supabase,
    isConfigured: () => {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      return url && key && url.includes('supabase.co');
    },
  };
};
