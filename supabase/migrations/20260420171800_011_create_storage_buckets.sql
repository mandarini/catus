/*
  # Create storage buckets and policies

  1. Buckets
    - `cat-photos` — public bucket for cat profile pics and gallery photos
    - `vet-documents` — private bucket for vet visit PDFs and documents

  2. Security
    - Authenticated users can upload to their own folder ({user_id}/{cat_id}/*)
    - cat-photos: publicly readable (no auth needed for viewing)
    - vet-documents: only the owner can read (signed URLs)
    - Max file sizes enforced via policies
*/

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
