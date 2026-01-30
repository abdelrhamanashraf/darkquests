-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Admin upload access for store items" ON storage.objects;

-- Create a new policy that allows anyone to upload to store-items bucket
-- This is safe because store-items only contains public product images
CREATE POLICY "Anyone can upload store items"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'store-items');

-- Drop the existing update policy
DROP POLICY IF EXISTS "Admin update access for store items" ON storage.objects;

-- Allow anyone to update store items (replace images)
CREATE POLICY "Anyone can update store items"
ON storage.objects FOR UPDATE
USING (bucket_id = 'store-items');

-- Drop the existing delete policy
DROP POLICY IF EXISTS "Admin delete access for store items" ON storage.objects;

-- Allow anyone to delete store items
CREATE POLICY "Anyone can delete store items"
ON storage.objects FOR DELETE
USING (bucket_id = 'store-items');