/**
 * Supabase client singleton
 *
 * Import this when you only need the raw client (e.g. for direct queries
 * or when authHelpers/dbHelpers would create a circular dependency).
 *
 * Usage:
 *   import { supabase } from '@/lib/client'
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Fall back to placeholder so the app renders in dev without env vars.
// All actual DB calls will fail gracefully when placeholders are used.
export const supabase = createClient(
  supabaseUrl     || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

/** True when real credentials are present in the environment */
export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey);
