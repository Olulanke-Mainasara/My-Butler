import { Database } from "@/supabase";

export type Table = keyof Database["public"]["Tables"];
