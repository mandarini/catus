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
