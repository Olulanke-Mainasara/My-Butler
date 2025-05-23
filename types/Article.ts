import { Database } from "@/supabase";

export type Article = Database["public"]["Tables"]["news"]["Row"];
