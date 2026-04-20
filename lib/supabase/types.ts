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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cats: {
        Row: {
          adoption_date: string | null
          allergies: string[] | null
          blood_type: string | null
          breed: string | null
          color_markings: string | null
          created_at: string
          date_of_birth: string | null
          gender: string
          id: string
          is_active: boolean
          is_neutered: boolean
          living_situation: string
          microchip_number: string | null
          name: string
          notes: string | null
          owner_id: string
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          adoption_date?: string | null
          allergies?: string[] | null
          blood_type?: string | null
          breed?: string | null
          color_markings?: string | null
          created_at?: string
          date_of_birth?: string | null
          gender?: string
          id?: string
          is_active?: boolean
          is_neutered?: boolean
          living_situation?: string
          microchip_number?: string | null
          name: string
          notes?: string | null
          owner_id: string
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          adoption_date?: string | null
          allergies?: string[] | null
          blood_type?: string | null
          breed?: string | null
          color_markings?: string | null
          created_at?: string
          date_of_birth?: string | null
          gender?: string
          id?: string
          is_active?: boolean
          is_neutered?: boolean
          living_situation?: string
          microchip_number?: string | null
          name?: string
          notes?: string | null
          owner_id?: string
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cats_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feeding: {
        Row: {
          brand: string | null
          cat_id: string
          created_at: string
          feeding_schedule: string | null
          food_type: string
          id: string
          is_current: boolean
          notes: string | null
          portion_size: string | null
          product_name: string | null
          started_on: string | null
        }
        Insert: {
          brand?: string | null
          cat_id: string
          created_at?: string
          feeding_schedule?: string | null
          food_type?: string
          id?: string
          is_current?: boolean
          notes?: string | null
          portion_size?: string | null
          product_name?: string | null
          started_on?: string | null
        }
        Update: {
          brand?: string | null
          cat_id?: string
          created_at?: string
          feeding_schedule?: string | null
          food_type?: string
          id?: string
          is_current?: boolean
          notes?: string | null
          portion_size?: string | null
          product_name?: string | null
          started_on?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feeding_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          cat_id: string
          content: string
          created_at: string
          entry_date: string
          id: string
          tags: string[] | null
          title: string | null
        }
        Insert: {
          cat_id: string
          content: string
          created_at?: string
          entry_date?: string
          id?: string
          tags?: string[] | null
          title?: string | null
        }
        Update: {
          cat_id?: string
          content?: string
          created_at?: string
          entry_date?: string
          id?: string
          tags?: string[] | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          cat_id: string
          created_at: string
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean
          name: string
          notes: string | null
          prescribed_by: string | null
          reason: string | null
          start_date: string
        }
        Insert: {
          cat_id: string
          created_at?: string
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          prescribed_by?: string | null
          reason?: string | null
          start_date: string
        }
        Update: {
          cat_id?: string
          created_at?: string
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          prescribed_by?: string | null
          reason?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          caption: string | null
          cat_id: string
          created_at: string
          id: string
          taken_at: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          cat_id: string
          created_at?: string
          id?: string
          taken_at?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          cat_id?: string
          created_at?: string
          id?: string
          taken_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          preferred_weight_unit: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id: string
          preferred_weight_unit?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          preferred_weight_unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      treatments: {
        Row: {
          cat_id: string
          created_at: string
          date_administered: string
          id: string
          next_due_date: string | null
          notes: string | null
          product_name: string
          treatment_type: string
        }
        Insert: {
          cat_id: string
          created_at?: string
          date_administered: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          product_name: string
          treatment_type?: string
        }
        Update: {
          cat_id?: string
          created_at?: string
          date_administered?: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          product_name?: string
          treatment_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatments_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccinations: {
        Row: {
          administered_by: string | null
          batch_number: string | null
          cat_id: string
          created_at: string
          date_administered: string
          id: string
          next_due_date: string | null
          notes: string | null
          vaccine_name: string
        }
        Insert: {
          administered_by?: string | null
          batch_number?: string | null
          cat_id: string
          created_at?: string
          date_administered: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          vaccine_name: string
        }
        Update: {
          administered_by?: string | null
          batch_number?: string | null
          cat_id?: string
          created_at?: string
          date_administered?: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccinations_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
        ]
      }
      vet_visits: {
        Row: {
          cat_id: string
          clinic_name: string | null
          cost: number | null
          created_at: string
          diagnosis: string | null
          documents: string[] | null
          follow_up_date: string | null
          id: string
          notes: string | null
          reason: string
          treatment: string | null
          vet_name: string | null
          visit_date: string
        }
        Insert: {
          cat_id: string
          clinic_name?: string | null
          cost?: number | null
          created_at?: string
          diagnosis?: string | null
          documents?: string[] | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          reason: string
          treatment?: string | null
          vet_name?: string | null
          visit_date: string
        }
        Update: {
          cat_id?: string
          clinic_name?: string | null
          cost?: number | null
          created_at?: string
          diagnosis?: string | null
          documents?: string[] | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          reason?: string
          treatment?: string | null
          vet_name?: string | null
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "vet_visits_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_logs: {
        Row: {
          cat_id: string
          created_at: string
          id: string
          notes: string | null
          recorded_at: string
          weight_kg: number
        }
        Insert: {
          cat_id: string
          created_at?: string
          id?: string
          notes?: string | null
          recorded_at?: string
          weight_kg: number
        }
        Update: {
          cat_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          recorded_at?: string
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "weight_logs_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "cats"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

// Convenience type aliases
export type Cat = Tables<'cats'>
export type Profile = Tables<'profiles'>
export type WeightLog = Tables<'weight_logs'>
export type Vaccination = Tables<'vaccinations'>
export type VetVisit = Tables<'vet_visits'>
export type Medication = Tables<'medications'>
export type Treatment = Tables<'treatments'>
export type Feeding = Tables<'feeding'>
export type Photo = Tables<'photos'>
export type JournalEntry = Tables<'journal_entries'>
