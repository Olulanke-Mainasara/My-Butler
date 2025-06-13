import { Database } from "@/supabase";

export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
