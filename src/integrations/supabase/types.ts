export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      pets: {
        Row: {
          birth_date: string | null
          breed: string | null
          created_at: string | null
          gender: string | null
          id: string
          name: string
          photo_url: string | null
          profile_id: string
          weight_unit: string | null
          weight_value: number | null
        }
        Insert: {
          birth_date?: string | null
          breed?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          name: string
          photo_url?: string | null
          profile_id: string
          weight_unit?: string | null
          weight_value?: number | null
        }
        Update: {
          birth_date?: string | null
          breed?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          profile_id?: string
          weight_unit?: string | null
          weight_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profileusers"
            referencedColumns: ["id"]
          },
        ]
      }
      profileusers: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          profile_name: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          profile_name: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          profile_name?: string
          username?: string | null
        }
        Relationships: []
      }
      walk_locations: {
        Row: {
          accuracy: number | null
          altitude: number | null
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          timestamp: string
          walk_id: string
        }
        Insert: {
          accuracy?: number | null
          altitude?: number | null
          created_at?: string | null
          id?: string
          latitude: number
          longitude: number
          timestamp: string
          walk_id: string
        }
        Update: {
          accuracy?: number | null
          altitude?: number | null
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          timestamp?: string
          walk_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "walk_locations_walk_id_fkey"
            columns: ["walk_id"]
            isOneToOne: false
            referencedRelation: "walks"
            referencedColumns: ["id"]
          },
        ]
      }
      walks: {
        Row: {
          created_at: string | null
          description: string | null
          distance: number | null
          duration: number | null
          end_time: string | null
          id: string
          notes: string | null
          pet_id: string
          photos: string[] | null
          route_data: Json | null
          start_time: string
          title: string
          updated_at: string | null
          user_id: string
          weather_data: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          distance?: number | null
          duration?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          pet_id: string
          photos?: string[] | null
          route_data?: Json | null
          start_time: string
          title: string
          updated_at?: string | null
          user_id: string
          weather_data?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          distance?: number | null
          duration?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          pet_id?: string
          photos?: string[] | null
          route_data?: Json | null
          start_time?: string
          title?: string
          updated_at?: string | null
          user_id?: string
          weather_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "walks_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "walks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profileusers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_last_sign_in: {
        Args: { user_id: string }
        Returns: {
          last_sign_in_at: string
        }[]
      }
      lookup_user_email_by_username: {
        Args: { input_username: string }
        Returns: {
          email: string
        }[]
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
  public: {
    Enums: {},
  },
} as const
