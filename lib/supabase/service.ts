import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/supabase";

// Service-role client: bypasses RLS entirely. Only for trusted server code
// that has no user session to authenticate as - currently just the Stripe
// webhook, which needs to update an order regardless of who's "logged in"
// (there is no logged-in user in a webhook request). Never import this
// outside a server context, and never use it where a user-session-scoped
// client (lib/supabase/server.ts) would do the job with RLS intact.
export function createServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set - required for server-only operations that must bypass RLS (e.g. the Stripe webhook)."
    );
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );
}
