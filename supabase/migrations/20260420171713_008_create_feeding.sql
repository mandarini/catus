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
