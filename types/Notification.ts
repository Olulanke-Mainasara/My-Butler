import { Database } from "@/supabase";

export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
