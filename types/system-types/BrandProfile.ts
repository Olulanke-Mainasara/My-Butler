import { Database } from "@/types/database.types";

export type BrandProfile = Database["public"]["Tables"]["brands"]["Row"] & {
  role_id: number;
};
