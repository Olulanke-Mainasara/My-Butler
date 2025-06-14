export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
          target_type_id: string
          target_type_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          target_type_id: string
          target_type_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          target_type_id?: string
          target_type_name?: string
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
          contact_no: string | null
          created_at: string | null
          description: string
          display_name: string
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
          contact_no?: string | null
          created_at?: string | null
          description: string
          display_name: string
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
          contact_no?: string | null
          created_at?: string | null
          description?: string
          display_name?: string
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
          product_id: string | null
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          added_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
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
          category: string
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
          category?: string
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
          category?: string
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
          brand_id: string
          created_at: string | null
          description: string | null
          display_image: string | null
          end_date: string | null
          id: string
          is_virtual: boolean | null
          location: string | null
          slug: string
          start_date: string
          tickets_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          brand_id?: string
          created_at?: string | null
          description?: string | null
          display_image?: string | null
          end_date?: string | null
          id?: string
          is_virtual?: boolean | null
          location?: string | null
          slug: string
          start_date: string
          tickets_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          description?: string | null
          display_image?: string | null
          end_date?: string | null
          id?: string
          is_virtual?: boolean | null
          location?: string | null
          slug?: string
          start_date?: string
          tickets_url?: string | null
          title?: string
          updated_at?: string | null
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
          brand_id: string
          content: string
          created_at: string | null
          description: string | null
          display_image: string | null
          id: string
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          brand_id?: string
          content: string
          created_at?: string | null
          description?: string | null
          display_image?: string | null
          id?: string
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          brand_id?: string
          content?: string
          created_at?: string | null
          description?: string | null
          display_image?: string | null
          id?: string
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
          created_at: string | null
          description: string
          features: string[]
          id: string
          name: string
          price: number
          product_images: string[] | null
          rating: number | null
          reviews_count: number | null
          slug: string
          specifications: Json
          stock_quantity: number
          updated_at: string | null
        }
        Insert: {
          brand_id?: string
          category_id: number
          created_at?: string | null
          description: string
          features: string[]
          id?: string
          name: string
          price: number
          product_images?: string[] | null
          rating?: number | null
          reviews_count?: number | null
          slug: string
          specifications: Json
          stock_quantity?: number
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          category_id?: number
          created_at?: string | null
          description?: string
          features?: string[]
          id?: string
          name?: string
          price?: number
          product_images?: string[] | null
          rating?: number | null
          reviews_count?: number | null
          slug?: string
          specifications?: Json
          stock_quantity?: number
          updated_at?: string | null
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
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_bookmarked_items: {
        Args: { target: string }
        Returns: {
          id: string
          title: string
          name: string
          slug: string
          description: string
          display_image: string
          product_images: string[]
          price: number
          rating: number
          reviews_count: number
          stock_quantity: number
          created_at: string
          bookmarked_at: string
        }[]
      }
      toggle_bookmark: {
        Args: { target_type: string; target_id: string }
        Returns: string
      }
      update_user_details: {
        Args:
          | {
              _supabase_user_id: string
              _display_name: string
              _email: string
              _bio: string
              _url: string
              _location: string
              _category: string
            }
          | {
              _supabase_user_id: string
              _display_name: string
              _email: string
              _location: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
