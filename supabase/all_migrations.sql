-- ============================================
-- 20260420171538_001_create_profiles.sql
-- ============================================

/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, PK, references auth.users)
      - `display_name` (text)
      - `avatar_url` (text, nullable)
      - `preferred_weight_unit` (text, 'kg' or 'lbs', default 'kg')
      - `created_at` / `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Users can read/update their own profile
    - Profile auto-created via trigger on auth.users insert

  3. Notes
    - Trigger fires on new Supabase Auth user signup
    - display_name initialized from email or Google metadata
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  preferred_weight_unit text NOT NULL DEFAULT 'kg',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), ''),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ============================================
-- 20260420171555_002_create_cats.sql
-- ============================================

/*
  # Create cats table

  1. New Tables
    - `cats` — stores all cat profile information
      - `id` (uuid, PK)
      - `owner_id` (uuid, FK → profiles)
      - `name`, `photo_url`, `breed`, `color_markings`, `date_of_birth`
      - `gender` ('male', 'female', 'unknown')
      - `is_neutered` (boolean)
      - `microchip_number`, `adoption_date`, `living_situation`
      - `blood_type`, `allergies` (text[]), `notes`
      - `is_active` (boolean, soft delete)
      - `created_at` / `updated_at`

  2. Security
    - Enable RLS
    - Owner can CRUD their own cats

  3. Notes
    - is_active=false means cat is deceased/archived (soft delete)
    - allergies stored as text array
*/

CREATE TABLE IF NOT EXISTS cats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  photo_url text,
  breed text,
  color_markings text,
  date_of_birth date,
  gender text NOT NULL DEFAULT 'unknown',
  is_neutered boolean NOT NULL DEFAULT false,
  microchip_number text,
  adoption_date date,
  living_situation text NOT NULL DEFAULT 'indoor',
  blood_type text,
  allergies text[],
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cats_owner_id_idx ON cats(owner_id);
CREATE INDEX IF NOT EXISTS cats_is_active_idx ON cats(is_active);

ALTER TABLE cats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their cats"
  ON cats FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert their cats"
  ON cats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their cats"
  ON cats FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their cats"
  ON cats FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);


-- ============================================
-- 20260420171607_003_create_weight_logs.sql
-- ============================================

/*
  # Create weight_logs table

  1. New Tables
    - `weight_logs` — weight measurements for each cat
      - `id` (uuid, PK)
      - `cat_id` (uuid, FK → cats)
      - `weight_kg` (decimal) — always stored in kg, UI converts
      - `recorded_at` (date)
      - `notes` (text, nullable)
      - `created_at`

  2. Security
    - Enable RLS
    - Access allowed only if cat belongs to auth user
*/

CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id uuid NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
  weight_kg decimal(5,2) NOT NULL,
  recorded_at date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS weight_logs_cat_id_idx ON weight_logs(cat_id);
CREATE INDEX IF NOT EXISTS weight_logs_recorded_at_idx ON weight_logs(recorded_at);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view weight logs for their cats"
  ON weight_logs FOR SELECT
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can insert weight logs for their cats"
  ON weight_logs FOR INSERT
  TO authenticated
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update weight logs for their cats"
  ON weight_logs FOR UPDATE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()))
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can delete weight logs for their cats"
  ON weight_logs FOR DELETE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));


-- ============================================
-- 20260420171620_004_create_vaccinations.sql
-- ============================================

/*
  # Create vaccinations table

  1. New Tables
    - `vaccinations` — vaccination records per cat
      - `id`, `cat_id`, `vaccine_name`, `date_administered`
      - `next_due_date` (nullable), `administered_by`, `batch_number`, `notes`
      - `created_at`

  2. Security
    - RLS: access only if cat belongs to auth user
*/

CREATE TABLE IF NOT EXISTS vaccinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id uuid NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  date_administered date NOT NULL,
  next_due_date date,
  administered_by text,
  batch_number text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vaccinations_cat_id_idx ON vaccinations(cat_id);
CREATE INDEX IF NOT EXISTS vaccinations_next_due_date_idx ON vaccinations(next_due_date);

ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vaccinations for their cats"
  ON vaccinations FOR SELECT
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can insert vaccinations for their cats"
  ON vaccinations FOR INSERT
  TO authenticated
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update vaccinations for their cats"
  ON vaccinations FOR UPDATE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()))
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can delete vaccinations for their cats"
  ON vaccinations FOR DELETE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));


-- ============================================
-- 20260420171632_005_create_vet_visits.sql
-- ============================================

/*
  # Create vet_visits table

  1. New Tables
    - `vet_visits` — vet appointment records per cat
      - `id`, `cat_id`, `visit_date`, `vet_name`, `clinic_name`
      - `reason`, `diagnosis`, `treatment`, `cost`
      - `follow_up_date`, `documents` (text[]), `notes`
      - `created_at`

  2. Security
    - RLS: access only if cat belongs to auth user
*/

CREATE TABLE IF NOT EXISTS vet_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id uuid NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
  visit_date date NOT NULL,
  vet_name text,
  clinic_name text,
  reason text NOT NULL,
  diagnosis text,
  treatment text,
  cost decimal(10,2),
  follow_up_date date,
  documents text[],
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vet_visits_cat_id_idx ON vet_visits(cat_id);
CREATE INDEX IF NOT EXISTS vet_visits_visit_date_idx ON vet_visits(visit_date);

ALTER TABLE vet_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vet visits for their cats"
  ON vet_visits FOR SELECT
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can insert vet visits for their cats"
  ON vet_visits FOR INSERT
  TO authenticated
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update vet visits for their cats"
  ON vet_visits FOR UPDATE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()))
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can delete vet visits for their cats"
  ON vet_visits FOR DELETE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));


-- ============================================
-- 20260420171643_006_create_medications.sql
-- ============================================

/*
  # Create medications table

  1. New Tables
    - `medications` — medication tracking per cat
      - `id`, `cat_id`, `name`, `dosage`, `frequency`
      - `start_date`, `end_date` (nullable = ongoing)
      - `prescribed_by`, `reason`, `notes`
      - `is_active` (boolean), `created_at`

  2. Security
    - RLS: access only if cat belongs to auth user
*/

CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id uuid NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  prescribed_by text,
  reason text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS medications_cat_id_idx ON medications(cat_id);
CREATE INDEX IF NOT EXISTS medications_is_active_idx ON medications(is_active);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view medications for their cats"
  ON medications FOR SELECT
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can insert medications for their cats"
  ON medications FOR INSERT
  TO authenticated
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update medications for their cats"
  ON medications FOR UPDATE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()))
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can delete medications for their cats"
  ON medications FOR DELETE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));


-- ============================================
-- 20260420171659_007_create_treatments.sql
-- ============================================

/*
  # Create treatments table

  1. New Tables
    - `treatments` — preventive treatments (flea/tick, deworming, other)
      - `id`, `cat_id`, `treatment_type` ('flea_tick', 'deworming', 'other')
      - `product_name`, `date_administered`, `next_due_date`, `notes`
      - `created_at`

  2. Security
    - RLS: access only if cat belongs to auth user
*/

CREATE TABLE IF NOT EXISTS treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id uuid NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
  treatment_type text NOT NULL DEFAULT 'other',
  product_name text NOT NULL,
  date_administered date NOT NULL,
  next_due_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS treatments_cat_id_idx ON treatments(cat_id);
CREATE INDEX IF NOT EXISTS treatments_next_due_date_idx ON treatments(next_due_date);

ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view treatments for their cats"
  ON treatments FOR SELECT
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can insert treatments for their cats"
  ON treatments FOR INSERT
  TO authenticated
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update treatments for their cats"
  ON treatments FOR UPDATE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()))
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can delete treatments for their cats"
  ON treatments FOR DELETE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));


-- ============================================
-- 20260420171713_008_create_feeding.sql
-- ============================================

/*
  # Create feeding table

  1. New Tables
    - `feeding` — dietary information per cat
      - `id`, `cat_id`, `food_type` ('dry','wet','raw','mixed')
      - `brand`, `product_name`, `portion_size`, `feeding_schedule`
      - `started_on`, `notes`, `is_current`
      - `created_at`

  2. Security
    - RLS: access only if cat belongs to auth user
*/

CREATE TABLE IF NOT EXISTS feeding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id uuid NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
  food_type text NOT NULL DEFAULT 'dry',
  brand text,
  product_name text,
  portion_size text,
  feeding_schedule text,
  started_on date,
  notes text,
  is_current boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS feeding_cat_id_idx ON feeding(cat_id);
CREATE INDEX IF NOT EXISTS feeding_is_current_idx ON feeding(is_current);

ALTER TABLE feeding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view feeding records for their cats"
  ON feeding FOR SELECT
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can insert feeding records for their cats"
  ON feeding FOR INSERT
  TO authenticated
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update feeding records for their cats"
  ON feeding FOR UPDATE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()))
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can delete feeding records for their cats"
  ON feeding FOR DELETE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));


-- ============================================
-- 20260420171723_009_create_photos.sql
-- ============================================

/*
  # Create photos table

  1. New Tables
    - `photos` — photo gallery per cat
      - `id`, `cat_id`, `url` (Supabase Storage URL)
      - `caption`, `taken_at`, `created_at`

  2. Security
    - RLS: access only if cat belongs to auth user
*/

CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id uuid NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text,
  taken_at date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS photos_cat_id_idx ON photos(cat_id);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view photos for their cats"
  ON photos FOR SELECT
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can insert photos for their cats"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update photos for their cats"
  ON photos FOR UPDATE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()))
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can delete photos for their cats"
  ON photos FOR DELETE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));


-- ============================================
-- 20260420171735_010_create_journal_entries.sql
-- ============================================

/*
  # Create journal_entries table

  1. New Tables
    - `journal_entries` — free-form diary/notes per cat
      - `id`, `cat_id`, `title`, `content`
      - `entry_date` (default today), `tags` (text[])
      - `created_at`

  2. Security
    - RLS: access only if cat belongs to auth user
*/

CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id uuid NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
  title text,
  content text NOT NULL,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  tags text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS journal_entries_cat_id_idx ON journal_entries(cat_id);
CREATE INDEX IF NOT EXISTS journal_entries_entry_date_idx ON journal_entries(entry_date);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view journal entries for their cats"
  ON journal_entries FOR SELECT
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can insert journal entries for their cats"
  ON journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update journal entries for their cats"
  ON journal_entries FOR UPDATE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()))
  WITH CHECK (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));

CREATE POLICY "Users can delete journal entries for their cats"
  ON journal_entries FOR DELETE
  TO authenticated
  USING (cat_id IN (SELECT id FROM cats WHERE owner_id = auth.uid()));


-- ============================================
-- 20260420171800_011_create_storage_buckets.sql
-- ============================================

-- Create storage buckets and policies
-- Buckets: cat-photos (public), vet-documents (private)
-- Authenticated users can upload to their own folder ({user_id}/{cat_id}/)

-- Create buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('cat-photos', 'cat-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('vet-documents', 'vet-documents', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- cat-photos: anyone can view (public bucket)
CREATE POLICY "Public read access for cat photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'cat-photos');

-- cat-photos: authenticated users can upload to their own folder
CREATE POLICY "Authenticated users can upload cat photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'cat-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- cat-photos: users can update their own photos
CREATE POLICY "Users can update their own cat photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'cat-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- cat-photos: users can delete their own photos
CREATE POLICY "Users can delete their own cat photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'cat-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- vet-documents: only owner can read
CREATE POLICY "Owners can read their vet documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'vet-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- vet-documents: authenticated users can upload to their own folder
CREATE POLICY "Authenticated users can upload vet documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'vet-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- vet-documents: users can update their own documents
CREATE POLICY "Users can update their own vet documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'vet-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- vet-documents: users can delete their own documents
CREATE POLICY "Users can delete their own vet documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'vet-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );


