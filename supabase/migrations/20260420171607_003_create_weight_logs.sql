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
