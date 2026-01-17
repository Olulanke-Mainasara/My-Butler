export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          contact: string | null
          created_at: string | null
          description: string
          email: string
          id: string
          location: string | null
          name: string
          profile_picture: string | null
          supabase_user_id: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          contact?: string | null
          created_at?: string | null
          description: string
          email: string
          id?: string
          location?: string | null
          name: string
          profile_picture?: string | null
          supabase_user_id?: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          contact?: string | null
          created_at?: string | null
          description?: string
          email?: string
          id?: string
          location?: string | null
          name?: string
          profile_picture?: string | null
          supabase_user_id?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      camera_pictures: {
        Row: {
          created_at: string
          full_path: string
          id: string
          image_url: string
          path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_path?: string
          id?: string
          image_url?: string
          path?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          full_path?: string
          id?: string
          image_url?: string
          path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "camera_pictures_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      cart: {
        Row: {
          added_at: string | null
          id: string
          item_id: string | null
          item_type: string | null
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          item_id?: string | null
          item_type?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          added_at?: string | null
          id?: string
          item_id?: string | null
          item_type?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          created_at: string
          id: string
          messages: Json[]
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages: Json[]
          title?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json[]
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          brand_id: string
          category: string | null
          category_id: number | null
          created_at: string | null
          description: string | null
          display_image: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          brand_id?: string
          category?: string | null
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          display_image?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          category?: string | null
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          display_image?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "collections_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lineups_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string | null
          display_name: string
          email: string
          first_name: string
          id: string
          last_name: string
          location: string | null
          phone_no: string | null
          profile_picture: string | null
          supabase_user_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          email: string
          first_name: string
          id?: string
          last_name: string
          location?: string | null
          phone_no?: string | null
          profile_picture?: string | null
          supabase_user_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          location?: string | null
          phone_no?: string | null
          profile_picture?: string | null
          supabase_user_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          admission_price: number | null
          brand_id: string
          capacity: number
          created_at: string | null
          description: string | null
          display_image: string | null
          duration_hours: number | null
          end_date: string | null
          exhibitor_count: number | null
          featured_speakers_description: string | null
          id: string
          is_virtual: boolean | null
          location: string | null
          parking_available: boolean | null
          registration_basis: string | null
          slug: string
          speakers: string | null
          start_date: string
          tickets_url: string | null
          title: string
          updated_at: string | null
          what_to_expect: string[]
        }
        Insert: {
          admission_price?: number | null
          brand_id?: string
          capacity?: number
          created_at?: string | null
          description?: string | null
          display_image?: string | null
          duration_hours?: number | null
          end_date?: string | null
          exhibitor_count?: number | null
          featured_speakers_description?: string | null
          id?: string
          is_virtual?: boolean | null
          location?: string | null
          parking_available?: boolean | null
          registration_basis?: string | null
          slug: string
          speakers?: string | null
          start_date: string
          tickets_url?: string | null
          title: string
          updated_at?: string | null
          what_to_expect?: string[]
        }
        Update: {
          admission_price?: number | null
          brand_id?: string
          capacity?: number
          created_at?: string | null
          description?: string | null
          display_image?: string | null
          duration_hours?: number | null
          end_date?: string | null
          exhibitor_count?: number | null
          featured_speakers_description?: string | null
          id?: string
          is_virtual?: boolean | null
          location?: string | null
          parking_available?: boolean | null
          registration_basis?: string | null
          slug?: string
          speakers?: string | null
          start_date?: string
          tickets_url?: string | null
          title?: string
          updated_at?: string | null
          what_to_expect?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "events_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author: string | null
          author_bio: string | null
          brand_id: string
          content: string
          created_at: string | null
          description: string | null
          display_image: string | null
          id: string
          reading_time_minutes: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          author_bio?: string | null
          brand_id?: string
          content: string
          created_at?: string | null
          description?: string | null
          display_image?: string | null
          id?: string
          reading_time_minutes?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          author_bio?: string | null
          brand_id?: string
          content?: string
          created_at?: string | null
          description?: string | null
          display_image?: string | null
          id?: string
          reading_time_minutes?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: string
          category_id: number
          collection_id: string | null
          created_at: string | null
          description: string
          features: string[]
          free_shipping: boolean | null
          id: string
          name: string
          price: number
          product_images: string[] | null
          rating: number | null
          return_days: number | null
          reviews_count: number | null
          slug: string
          specifications: Json
          stock_quantity: number
          updated_at: string | null
          warranty_years: number | null
        }
        Insert: {
          brand_id?: string
          category_id: number
          collection_id?: string | null
          created_at?: string | null
          description: string
          features: string[]
          free_shipping?: boolean | null
          id?: string
          name: string
          price: number
          product_images?: string[] | null
          rating?: number | null
          return_days?: number | null
          reviews_count?: number | null
          slug: string
          specifications: Json
          stock_quantity?: number
          updated_at?: string | null
          warranty_years?: number | null
        }
        Update: {
          brand_id?: string
          category_id?: number
          collection_id?: string | null
          created_at?: string | null
          description?: string
          features?: string[]
          free_shipping?: boolean | null
          id?: string
          name?: string
          price?: number
          product_images?: string[] | null
          rating?: number | null
          return_days?: number | null
          reviews_count?: number | null
          slug?: string
          specifications?: Json
          stock_quantity?: number
          updated_at?: string | null
          warranty_years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string | null
          id: number
          rating: number | null
          review_text: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          rating?: number | null
          review_text?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: number
          rating?: number | null
          review_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      toggle_bookmark:
        | {
            Args: { _target_id: string; _target_type: string }
            Returns: string
          }
        | { Args: { target_id: string; target_type: string }; Returns: string }
      toggle_cart: {
        Args: { _item_id: string; _item_type: string; _quantity: number }
        Returns: string
      }
      update_brand_details: {
        Args: {
          _contact: string
          _description: string
          _email: string
          _location: string
          _name: string
          _profile_picture: string
          _supabase_user_id: string
          _url: string
        }
        Returns: undefined
      }
      update_customer_details: {
        Args: {
          _display_name: string
          _email: string
          _location: string
          _profile_picture: string
          _supabase_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
