import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

export async function createSupabaseServerClient() {
  const headerList = await headers(); // 👈 MUST await
  const authHeader = headerList.get("authorization");

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: authHeader ?? "",
        },
      },
    }
  );
}
