import { Database } from "@/supabase";

export type CustomerProfile =
  Database["public"]["Tables"]["customers"]["Row"] & {
    role_id: number;
  };
