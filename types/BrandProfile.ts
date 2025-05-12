import { Database } from "@/supabase";

export type BrandProfile = Database["public"]["Tables"]["brands"]["Row"] & {
  role_id: number;
};
