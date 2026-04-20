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
