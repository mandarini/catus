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
