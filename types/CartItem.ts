import { Database } from "@/supabase";

export type CartItem = Database["public"]["Tables"]["cart"]["Row"];
