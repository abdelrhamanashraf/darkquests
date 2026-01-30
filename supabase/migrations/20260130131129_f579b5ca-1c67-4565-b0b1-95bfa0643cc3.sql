-- Drop existing permissive policies for store_items
DROP POLICY IF EXISTS "Anyone can insert store items" ON public.store_items;
DROP POLICY IF EXISTS "Anyone can update store items" ON public.store_items;
DROP POLICY IF EXISTS "Anyone can delete store items" ON public.store_items;

-- Create admin-only policies for store_items management
CREATE POLICY "Admins can insert store items"
ON public.store_items FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update store items"
ON public.store_items FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete store items"
ON public.store_items FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));