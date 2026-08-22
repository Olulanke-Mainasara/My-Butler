import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

export function createServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set - required for server-only operations that must bypass RLS.",
    );
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
  );
}
