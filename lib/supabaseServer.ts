import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

export async function createSupabaseServerClient() {
  const headerList = await headers(); // 👈 MUST await
  const authHeader = headerList.get("authorization");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are missing (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY). Please check your Vercel project settings.");
  }

  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: {
          Authorization: authHeader ?? "",
        },
      },
    }
  );
}
