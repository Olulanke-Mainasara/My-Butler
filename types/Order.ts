import { Database } from "@/supabase";

export type Order = Database["public"]["Tables"]["orders"]["Row"];
