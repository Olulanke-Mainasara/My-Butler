import { Database } from "@/supabase";

export type Collection = Database["public"]["Tables"]["collections"]["Row"];
