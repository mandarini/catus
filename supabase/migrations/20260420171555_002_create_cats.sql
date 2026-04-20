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
