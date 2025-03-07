import { Database } from "@/supabase";

export type Blog = Database["public"]["Tables"]["news"]["Row"];
