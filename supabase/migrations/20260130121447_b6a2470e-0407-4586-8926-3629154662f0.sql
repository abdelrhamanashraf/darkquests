-- Create enum for item types
CREATE TYPE public.store_item_type AS ENUM ('icon', 'title', 'cosmetic', 'banner');

-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create store_items table
CREATE TABLE public.store_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type store_item_type NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  rarity TEXT DEFAULT 'common',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_inventory table
CREATE TABLE public.user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  item_id UUID NOT NULL REFERENCES public.store_items(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  equipped BOOLEAN DEFAULT false,
  UNIQUE (user_id, item_id)
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Store items policies (anyone can view, only admins can modify)
CREATE POLICY "Anyone can view store items"
  ON public.store_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert store items"
  ON public.store_items FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update store items"
  ON public.store_items FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete store items"
  ON public.store_items FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User inventory policies
CREATE POLICY "Users can view their own inventory"
  ON public.user_inventory FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase items"
  ON public.user_inventory FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_store_items_updated_at
  BEFORE UPDATE ON public.store_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample store items
INSERT INTO public.store_items (name, description, type, price, rarity) VALUES
  ('Flame Crown', 'A crown forged in the flames of the First Flame', 'icon', 50, 'rare'),
  ('Hollow Mask', 'The face of those who have lost their way', 'icon', 25, 'common'),
  ('Dark Sign', 'The cursed mark of the undead', 'icon', 100, 'legendary'),
  ('Soul of Cinder', 'Embers of the Lords of Cinder', 'icon', 150, 'legendary'),
  ('Ashen One', 'Bearer of the curse, seeker of embers', 'title', 30, 'common'),
  ('Lord of Hollows', 'Ruler of the undead realm', 'title', 200, 'legendary'),
  ('Sunbro', 'Praise the sun!', 'title', 75, 'rare'),
  ('Giant Dad', 'The legend never dies', 'title', 100, 'rare'),
  ('Ember Aura', 'Surrounds you with dancing embers', 'cosmetic', 80, 'rare'),
  ('Dark Souls Banner', 'A banner from the Age of Fire', 'banner', 120, 'rare');