-- FINAL CONSOLIDATED DATABASE MIGRATION SCRIPT FOR REALTY PRO
-- Target Supabase Project Ref: octdlzzsvomgrbleqtpx
-- Copy and run this script in the Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/octdlzzsvomgrbleqtpx/sql/new)

-- =========================================================================
-- 1. CLEANUP & EXTENSIONS
-- =========================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 2. TYPE DEFINITIONS (ENUMS)
-- =========================================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'seller', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE property_type AS ENUM ('apartment', 'house', 'villa', 'commercial', 'land');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE property_status AS ENUM ('available', 'sold', 'rented');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE property_purpose AS ENUM ('buy', 'rent');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE furnishing_status AS ENUM ('furnished', 'semi-furnished', 'unfurnished');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =========================================================================
-- 3. TABLE SCHEMAS
-- =========================================================================

-- Profiles Table (Expected by Application as "users" for Auth Trigger sync)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  type property_type NOT NULL,
  purpose property_purpose NOT NULL,
  status property_status DEFAULT 'available',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  bedrooms INT,
  bathrooms INT,
  area_sqft DECIMAL(10, 2),
  features JSONB,
  furnishing_status furnishing_status DEFAULT 'unfurnished',
  parking_spaces INT DEFAULT 0,
  property_age INT DEFAULT 0,
  property_video_url TEXT,
  property_documents JSONB,
  is_luxury BOOLEAN DEFAULT FALSE,
  is_new_project BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property Images Table
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Leads Table (General Marketing / Contact Captures)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inquiries Table (Property Specific Detailed Messages)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments Table (Scheduled Property Visits)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  appointment_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 4. PERFORMANCE TUNING (INDEXES)
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_properties_seller ON public.properties(seller_id);
CREATE INDEX IF NOT EXISTS idx_properties_pricing ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_search ON public.properties(city, state, purpose, type);
CREATE INDEX IF NOT EXISTS idx_property_images_property ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_property ON public.leads(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property ON public.inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_appointments_schedule ON public.appointments(appointment_date, user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- =========================================================================
-- 5. AUTH AUTO-SYNC TRIGGERS
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =========================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- users policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can view basic public profile of agents" ON public.users;
CREATE POLICY "Anyone can view basic public profile of agents" ON public.users FOR SELECT USING (role IN ('seller', 'admin'));

-- properties policies
DROP POLICY IF EXISTS "Anyone can view properties" ON public.properties;
CREATE POLICY "Anyone can view properties" ON public.properties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Sellers can create properties" ON public.properties;
CREATE POLICY "Sellers can create properties" ON public.properties FOR INSERT WITH CHECK (
  auth.uid() = seller_id AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('seller', 'admin'))
);

DROP POLICY IF EXISTS "Sellers can update their own properties" ON public.properties;
CREATE POLICY "Sellers can update their own properties" ON public.properties FOR UPDATE USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Sellers can delete their own properties" ON public.properties;
CREATE POLICY "Sellers can delete their own properties" ON public.properties FOR DELETE USING (auth.uid() = seller_id);

-- property_images policies
DROP POLICY IF EXISTS "Anyone can view property images" ON public.property_images;
CREATE POLICY "Anyone can view property images" ON public.property_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Sellers can manage property images" ON public.property_images;
CREATE POLICY "Sellers can manage property images" ON public.property_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND seller_id = auth.uid())
);

-- favorites policies
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;
CREATE POLICY "Users can manage their own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- leads policies
DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
CREATE POLICY "Users can view own leads" ON public.leads FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Sellers can view leads for properties" ON public.leads;
CREATE POLICY "Sellers can view leads for properties" ON public.leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND seller_id = auth.uid())
);

DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;
CREATE POLICY "Anyone can submit leads" ON public.leads FOR INSERT WITH CHECK (true);

-- inquiries policies
DROP POLICY IF EXISTS "Users can manage own inquiries" ON public.inquiries;
CREATE POLICY "Users can manage own inquiries" ON public.inquiries FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Sellers can view inquiries for properties" ON public.inquiries;
CREATE POLICY "Sellers can view inquiries for properties" ON public.inquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND seller_id = auth.uid())
);

DROP POLICY IF EXISTS "Anyone can submit inquiries" ON public.inquiries;
CREATE POLICY "Anyone can submit inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

-- appointments policies
DROP POLICY IF EXISTS "Users can manage own appointments" ON public.appointments;
CREATE POLICY "Users can manage own appointments" ON public.appointments FOR ALL USING (auth.uid() = user_id OR auth.uid() = agent_id);

DROP POLICY IF EXISTS "Sellers can view appointments for properties" ON public.appointments;
CREATE POLICY "Sellers can view appointments for properties" ON public.appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND seller_id = auth.uid())
);

-- notifications policies
DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- =========================================================================
-- 7. STORAGE BUCKET SETUP (PROPERTY UPLOADS)
-- =========================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('properties', 'properties', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Access" ON storage.objects;
CREATE POLICY "Public Storage Access" ON storage.objects FOR SELECT USING (bucket_id = 'properties');

DROP POLICY IF EXISTS "Seller Storage Uploads" ON storage.objects;
CREATE POLICY "Seller Storage Uploads" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'properties' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('seller', 'admin')
  )
);

DROP POLICY IF EXISTS "Seller Storage Deletes" ON storage.objects;
CREATE POLICY "Seller Storage Deletes" ON storage.objects FOR DELETE USING (
  bucket_id = 'properties' 
  AND auth.role() = 'authenticated'
  AND owner_id = auth.uid()::text
);
