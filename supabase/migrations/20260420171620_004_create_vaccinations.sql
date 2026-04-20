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
