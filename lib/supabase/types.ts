export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          preferred_weight_unit: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          avatar_url?: string | null;
          preferred_weight_unit?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          preferred_weight_unit?: string;
          updated_at?: string;
        };
      };
      cats: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          photo_url: string | null;
          breed: string | null;
          color_markings: string | null;
          date_of_birth: string | null;
          gender: string;
          is_neutered: boolean;
          microchip_number: string | null;
          adoption_date: string | null;
          living_situation: string;
          blood_type: string | null;
          allergies: string[] | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          photo_url?: string | null;
          breed?: string | null;
          color_markings?: string | null;
          date_of_birth?: string | null;
          gender?: string;
          is_neutered?: boolean;
          microchip_number?: string | null;
          adoption_date?: string | null;
          living_situation?: string;
          blood_type?: string | null;
          allergies?: string[] | null;
          notes?: string | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          photo_url?: string | null;
          breed?: string | null;
          color_markings?: string | null;
          date_of_birth?: string | null;
          gender?: string;
          is_neutered?: boolean;
          microchip_number?: string | null;
          adoption_date?: string | null;
          living_situation?: string;
          blood_type?: string | null;
          allergies?: string[] | null;
          notes?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      weight_logs: {
        Row: {
          id: string;
          cat_id: string;
          weight_kg: number;
          recorded_at: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cat_id: string;
          weight_kg: number;
          recorded_at?: string;
          notes?: string | null;
        };
        Update: {
          weight_kg?: number;
          recorded_at?: string;
          notes?: string | null;
        };
      };
      vaccinations: {
        Row: {
          id: string;
          cat_id: string;
          vaccine_name: string;
          date_administered: string;
          next_due_date: string | null;
          administered_by: string | null;
          batch_number: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cat_id: string;
          vaccine_name: string;
          date_administered: string;
          next_due_date?: string | null;
          administered_by?: string | null;
          batch_number?: string | null;
          notes?: string | null;
        };
        Update: {
          vaccine_name?: string;
          date_administered?: string;
          next_due_date?: string | null;
          administered_by?: string | null;
          batch_number?: string | null;
          notes?: string | null;
        };
      };
      vet_visits: {
        Row: {
          id: string;
          cat_id: string;
          visit_date: string;
          vet_name: string | null;
          clinic_name: string | null;
          reason: string;
          diagnosis: string | null;
          treatment: string | null;
          cost: number | null;
          follow_up_date: string | null;
          documents: string[] | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cat_id: string;
          visit_date: string;
          vet_name?: string | null;
          clinic_name?: string | null;
          reason: string;
          diagnosis?: string | null;
          treatment?: string | null;
          cost?: number | null;
          follow_up_date?: string | null;
          documents?: string[] | null;
          notes?: string | null;
        };
        Update: {
          visit_date?: string;
          vet_name?: string | null;
          clinic_name?: string | null;
          reason?: string;
          diagnosis?: string | null;
          treatment?: string | null;
          cost?: number | null;
          follow_up_date?: string | null;
          documents?: string[] | null;
          notes?: string | null;
        };
      };
      medications: {
        Row: {
          id: string;
          cat_id: string;
          name: string;
          dosage: string;
          frequency: string;
          start_date: string;
          end_date: string | null;
          prescribed_by: string | null;
          reason: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          cat_id: string;
          name: string;
          dosage: string;
          frequency: string;
          start_date: string;
          end_date?: string | null;
          prescribed_by?: string | null;
          reason?: string | null;
          notes?: string | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          dosage?: string;
          frequency?: string;
          start_date?: string;
          end_date?: string | null;
          prescribed_by?: string | null;
          reason?: string | null;
          notes?: string | null;
          is_active?: boolean;
        };
      };
      treatments: {
        Row: {
          id: string;
          cat_id: string;
          treatment_type: string;
          product_name: string;
          date_administered: string;
          next_due_date: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cat_id: string;
          treatment_type?: string;
          product_name: string;
          date_administered: string;
          next_due_date?: string | null;
          notes?: string | null;
        };
        Update: {
          treatment_type?: string;
          product_name?: string;
          date_administered?: string;
          next_due_date?: string | null;
          notes?: string | null;
        };
      };
      feeding: {
        Row: {
          id: string;
          cat_id: string;
          food_type: string;
          brand: string | null;
          product_name: string | null;
          portion_size: string | null;
          feeding_schedule: string | null;
          started_on: string | null;
          notes: string | null;
          is_current: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          cat_id: string;
          food_type?: string;
          brand?: string | null;
          product_name?: string | null;
          portion_size?: string | null;
          feeding_schedule?: string | null;
          started_on?: string | null;
          notes?: string | null;
          is_current?: boolean;
        };
        Update: {
          food_type?: string;
          brand?: string | null;
          product_name?: string | null;
          portion_size?: string | null;
          feeding_schedule?: string | null;
          started_on?: string | null;
          notes?: string | null;
          is_current?: boolean;
        };
      };
      photos: {
        Row: {
          id: string;
          cat_id: string;
          url: string;
          caption: string | null;
          taken_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cat_id: string;
          url: string;
          caption?: string | null;
          taken_at?: string | null;
        };
        Update: {
          url?: string;
          caption?: string | null;
          taken_at?: string | null;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          cat_id: string;
          title: string | null;
          content: string;
          entry_date: string;
          tags: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cat_id: string;
          title?: string | null;
          content: string;
          entry_date?: string;
          tags?: string[] | null;
        };
        Update: {
          title?: string | null;
          content?: string;
          entry_date?: string;
          tags?: string[] | null;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Cat = Database['public']['Tables']['cats']['Row'];
export type WeightLog = Database['public']['Tables']['weight_logs']['Row'];
export type Vaccination = Database['public']['Tables']['vaccinations']['Row'];
export type VetVisit = Database['public']['Tables']['vet_visits']['Row'];
export type Medication = Database['public']['Tables']['medications']['Row'];
export type Treatment = Database['public']['Tables']['treatments']['Row'];
export type Feeding = Database['public']['Tables']['feeding']['Row'];
export type Photo = Database['public']['Tables']['photos']['Row'];
export type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];
