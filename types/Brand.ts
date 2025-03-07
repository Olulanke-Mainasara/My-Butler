import { Database } from "@/supabase";

export type Brand = Database["public"]["Tables"]["brands"]["Row"];
