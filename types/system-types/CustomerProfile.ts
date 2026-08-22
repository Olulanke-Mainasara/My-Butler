import { Database } from "@/types/database.types";

export type CustomerProfile =
  Database["public"]["Tables"]["customers"]["Row"] & {
    role_id: number;
  };
