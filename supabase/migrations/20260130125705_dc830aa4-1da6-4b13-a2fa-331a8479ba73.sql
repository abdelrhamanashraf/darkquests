-- Create storage bucket for store item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('store-items', 'store-items', true);

-- Allow anyone to view store item images
CREATE POLICY "Public read access for store items"
ON storage.objects FOR SELECT
USING (bucket_id = 'store-items');

-- Allow authenticated admins to upload store item images
CREATE POLICY "Admin upload access for store items"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'store-items' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated admins to update store item images
CREATE POLICY "Admin update access for store items"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'store-items' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated admins to delete store item images
CREATE POLICY "Admin delete access for store items"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'store-items' 
  AND auth.role() = 'authenticated'
);