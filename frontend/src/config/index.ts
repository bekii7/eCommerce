import { createClient } from "@supabase/supabase-js";

export const baseServerUrl = import.meta.env.VITE_SERVER_URL;

export const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const toastUpdateConfig = {
  isLoading: false,
  autoClose: 2000,
  closeOnClick: true,
  draggable: true,
};
