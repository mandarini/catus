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
