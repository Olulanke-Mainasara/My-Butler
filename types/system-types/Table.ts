import { Database } from "@/types/database.types";

export type Table = keyof Database["public"]["Tables"];
