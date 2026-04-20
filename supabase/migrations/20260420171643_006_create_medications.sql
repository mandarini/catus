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
