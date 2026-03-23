// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = "Supabase environment variables are missing. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file or Vercel project settings.";
  console.error(errorMsg);
  // During build time on Vercel, we might want to avoid crashing the whole process
  // if some pages don't actually use Supabase, but if they do, this will error anyway.
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
     // Optional: throw if you want to fail the build early
     // throw new Error(errorMsg);
  }
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co", 
  supabaseAnonKey || "placeholder-key"
);

// Admin client for server-side privileged operations (e.g. password resets via custom OTP)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl!, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
