export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: number;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      cart: {
        Row: {
          added_at: string | null;
          id: number;
          item_id: number | null;
          quantity: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          added_at?: string | null;
          id?: number;
          item_id?: number | null;
          quantity?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          added_at?: string | null;
          id?: number;
          item_id?: number | null;
          quantity?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: number;
          name: string;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          name: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          name?: string;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      chats: {
        Row: {
          chat_id: string;
          chat_title: string;
          created_at: string;
          messages: Json[];
          user_id: string;
        };
        Insert: {
          chat_id?: string;
          chat_title?: string;
          created_at?: string;
          messages: Json[];
          user_id?: string;
        };
        Update: {
          chat_id?: string;
          chat_title?: string;
          created_at?: string;
          messages?: Json[];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chats_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      events: {
        Row: {
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: number;
          image_url: string | null;
          is_virtual: boolean | null;
          location: string | null;
          slug: string;
          start_date: string;
          tickets_url: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: number;
          image_url?: string | null;
          is_virtual?: boolean | null;
          location?: string | null;
          slug: string;
          start_date: string;
          tickets_url?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: number;
          image_url?: string | null;
          is_virtual?: boolean | null;
          location?: string | null;
          slug?: string;
          start_date?: string;
          tickets_url?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      items: {
        Row: {
          additional_images: string[] | null;
          brand_id: number;
          category_id: number;
          created_at: string | null;
          description: string;
          display_image: string;
          features: string[] | null;
          id: number;
          name: string;
          price: number;
          rating: number | null;
          reviews_count: number | null;
          slug: string;
          specifications: Json | null;
          stock_quantity: number;
          updated_at: string | null;
        };
        Insert: {
          additional_images?: string[] | null;
          brand_id: number;
          category_id: number;
          created_at?: string | null;
          description: string;
          display_image: string;
          features?: string[] | null;
          id?: number;
          name: string;
          price: number;
          rating?: number | null;
          reviews_count?: number | null;
          slug: string;
          specifications?: Json | null;
          stock_quantity?: number;
          updated_at?: string | null;
        };
        Update: {
          additional_images?: string[] | null;
          brand_id?: number;
          category_id?: number;
          created_at?: string | null;
          description?: string;
          display_image?: string;
          features?: string[] | null;
          id?: number;
          name?: string;
          price?: number;
          rating?: number | null;
          reviews_count?: number | null;
          slug?: string;
          specifications?: Json | null;
          stock_quantity?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "items_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      lineups: {
        Row: {
          brand_id: number;
          created_at: string | null;
          description: string | null;
          display_image: string | null;
          id: number;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          brand_id: number;
          created_at?: string | null;
          description?: string | null;
          display_image?: string | null;
          id?: number;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          brand_id?: number;
          created_at?: string | null;
          description?: string | null;
          display_image?: string | null;
          id?: number;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lineups_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          }
        ];
      };
      news: {
        Row: {
          author: string | null;
          content: string;
          created_at: string | null;
          description: string | null;
          id: number;
          image_url: string | null;
          published_at: string | null;
          slug: string;
          tags: string[] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          author?: string | null;
          content: string;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          published_at?: string | null;
          slug: string;
          tags?: string[] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          author?: string | null;
          content?: string;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          published_at?: string | null;
          slug?: string;
          tags?: string[] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          created_at: string | null;
          id: number;
          is_read: boolean | null;
          message: string;
          title: string;
          type: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          is_read?: boolean | null;
          message: string;
          title: string;
          type: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          is_read?: boolean | null;
          message?: string;
          title?: string;
          type?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      outfits: {
        Row: {
          created_at: string | null;
          description: string | null;
          display_image: string | null;
          id: number;
          image_url: string | null;
          lineup_id: number;
          name: string;
          price: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          display_image?: string | null;
          id?: number;
          image_url?: string | null;
          lineup_id: number;
          name: string;
          price?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          display_image?: string | null;
          id?: number;
          image_url?: string | null;
          lineup_id?: number;
          name?: string;
          price?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "outfits_lineup_id_fkey";
            columns: ["lineup_id"];
            isOneToOne: false;
            referencedRelation: "lineups";
            referencedColumns: ["id"];
          }
        ];
      };
      reviews: {
        Row: {
          created_at: string | null;
          id: number;
          item_id: number;
          rating: number | null;
          review_text: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          item_id: number;
          rating?: number | null;
          review_text?: string | null;
          user_id?: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          item_id?: number;
          rating?: number | null;
          review_text?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      roles: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: number;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: number;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          bio: string | null;
          category: string | null;
          created_at: string | null;
          date_of_birth: string | null;
          display_name: string;
          email: string;
          first_name: string;
          gender: string | null;
          id: string;
          last_name: string;
          location: string | null;
          phone_number: string | null;
          preferred_language: string | null;
          profile_picture: string | null;
          role_id: number | null;
          supabase_user_id: string;
          updated_at: string | null;
          url: string | null;
        };
        Insert: {
          bio?: string | null;
          category?: string | null;
          created_at?: string | null;
          date_of_birth?: string | null;
          display_name: string;
          email: string;
          first_name: string;
          gender?: string | null;
          id: string;
          last_name: string;
          location?: string | null;
          phone_number?: string | null;
          preferred_language?: string | null;
          profile_picture?: string | null;
          role_id?: number | null;
          supabase_user_id: string;
          updated_at?: string | null;
          url?: string | null;
        };
        Update: {
          bio?: string | null;
          category?: string | null;
          created_at?: string | null;
          date_of_birth?: string | null;
          display_name?: string;
          email?: string;
          first_name?: string;
          gender?: string | null;
          id?: string;
          last_name?: string;
          location?: string | null;
          phone_number?: string | null;
          preferred_language?: string | null;
          profile_picture?: string | null;
          role_id?: number | null;
          supabase_user_id?: string;
          updated_at?: string | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_role";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      update_user_details: {
        Args: {
          _supabase_user_id: string;
          _display_name: string;
          _email: string;
          _bio: string;
          _url: string;
          _location: string;
          _category: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
