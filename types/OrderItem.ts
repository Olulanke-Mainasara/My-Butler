import { Database } from "@/supabase";

export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
