-- SEED DATA FOR REALTY PRO DEMO & AUDIT VERIFICATION
-- Run this script in the Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/octdlzzsvomgrbleqtpx/sql/new)

-- 1. Insert a dummy user into auth.users (if it doesn't exist)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'test.seller@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test Seller","avatar_url":""}',
  'authenticated',
  'authenticated',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  encrypted_password = EXCLUDED.encrypted_password;

-- Since the trigger on_auth_user_created will insert the user into public.users,
-- let's ensure the user role is updated to 'seller' so they can list properties
UPDATE public.users 
SET role = 'seller' 
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Clean existing properties to make it a clean seed
DELETE FROM public.properties;

-- 2. Insert 15 test properties
INSERT INTO public.properties (id, seller_id, title, slug, description, price, type, purpose, status, address, city, state, zip_code, bedrooms, bathrooms, area_sqft, furnishing_status, property_age, is_luxury, is_featured, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Futuristic Glass Villa', 'futuristic-glass-villa', 'Stunning modern villa with glass walls and smart HUD displays.', 1250000.00, 'villa', 'buy', 'available', '101 Cyber Ave', 'Malibu', 'CA', '90265', 4, 4, 3500.00, 'furnished', 0, true, true, now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Neo-Tokyo Penthouse', 'neo-tokyo-penthouse', 'High-rise penthouse with neon views and automated home system.', 4500.00, 'apartment', 'rent', 'available', '202 Shibuya Rd', 'Tokyo', 'Tokyo', '150-0002', 2, 2, 1200.00, 'furnished', 1, false, true, now() - interval '2 days'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Cyberpunk Industrial Loft', 'cyberpunk-industrial-loft', 'Spacious industrial loft with metal framing and concrete floors.', 3200.00, 'apartment', 'rent', 'available', '303 Grid Street', 'San Francisco', 'CA', '94103', 1, 1, 950.00, 'semi-furnished', 2, false, false, now() - interval '3 days'),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', 'Holographic Mansion', 'holographic-mansion', 'Grand luxury mansion featuring a holographic theater room.', 4500000.00, 'villa', 'buy', 'available', '404 Reality Blvd', 'Malibu', 'CA', '90265', 6, 7, 7200.00, 'furnished', 0, true, true, now() - interval '4 days'),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001', 'Minimalist Smart House', 'minimalist-smart-house', 'Clean architectural lines, zero-energy home with full automation.', 850000.00, 'house', 'buy', 'available', '505 Silicon way', 'San Jose', 'CA', '95112', 3, 2, 2100.00, 'unfurnished', 0, false, false, now() - interval '5 days'),
  ('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000001', 'Downtown Studio Space', 'downtown-studio-space', 'Compact commercial studio, perfect for tech labs or production.', 2500.00, 'commercial', 'rent', 'available', '606 Matrix Way', 'New York', 'NY', '10001', 0, 1, 600.00, 'unfurnished', 3, false, false, now() - interval '6 days'),
  ('00000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000001', 'Virtual Forest Plot', 'virtual-forest-plot', 'A premium piece of natural forest land protected under eco-trust.', 350000.00, 'land', 'buy', 'available', '707 Eco Reserve', 'Redwood', 'CA', '95501', 0, 0, 43560.00, 'unfurnished', 0, false, false, now() - interval '7 days'),
  ('00000000-0000-0000-0000-000000000108', '00000000-0000-0000-0000-000000000001', 'Metropolitan Luxury Suite', 'metropolitan-luxury-suite', 'Premium suite with luxury fixtures and 24/7 concierge.', 5500.00, 'apartment', 'rent', 'available', '808 Broadway', 'New York', 'NY', '10003', 2, 2, 1400.00, 'furnished', 1, true, false, now() - interval '8 days'),
  ('00000000-0000-0000-0000-000000000109', '00000000-0000-0000-0000-000000000001', 'Cozy Cyber Cabin', 'cozy-cyber-cabin', 'Off-grid smart cabin surrounded by pine trees and mountain views.', 420000.00, 'house', 'buy', 'available', '909 Alpine Way', 'Aspen', 'CO', '81611', 2, 1, 1100.00, 'semi-furnished', 2, false, false, now() - interval '9 days'),
  ('00000000-0000-0000-0000-000000000110', '00000000-0000-0000-0000-000000000001', 'Commercial Tech Hub', 'commercial-tech-hub', 'Prime commercial real estate suited for server farms or offices.', 12000.00, 'commercial', 'rent', 'available', '110 Data Center Pkwy', 'Santa Clara', 'CA', '95054', 0, 4, 8500.00, 'unfurnished', 4, false, true, now() - interval '10 days'),
  ('00000000-0000-0000-0000-000000000111', '00000000-0000-0000-0000-000000000001', 'Sunset Blvd Estate', 'sunset-blvd-estate', 'Classic architecture combined with modern smart updates.', 2950000.00, 'house', 'buy', 'available', '1111 Sunset Blvd', 'Los Angeles', 'CA', '90026', 5, 5, 4800.00, 'semi-furnished', 5, true, false, now() - interval '11 days'),
  ('00000000-0000-0000-0000-000000000112', '00000000-0000-0000-0000-000000000001', 'Silicon Valley Condo', 'silicon-valley-condo', 'Sleek luxury condo in the heart of tech startups.', 3500.00, 'apartment', 'rent', 'available', '222 StartUp Ln', 'Palo Alto', 'CA', '94301', 1, 1.5, 850.00, 'furnished', 0, false, false, now() - interval '12 days'),
  ('00000000-0000-0000-0000-000000000113', '00000000-0000-0000-0000-000000000001', 'Quantum Computing HQ', 'quantum-computing-hq', 'Large-scale commercial building optimized for clean energy.', 15000000.00, 'commercial', 'buy', 'available', '333 Quantum Way', 'Austin', 'TX', '78701', 0, 10, 25000.00, 'unfurnished', 0, true, true, now() - interval '13 days'),
  ('00000000-0000-0000-0000-000000000114', '00000000-0000-0000-0000-000000000001', 'Solar Farm Acreage', 'solar-farm-acreage', 'Flat sunny land ideal for industrial solar capture installs.', 750000.00, 'land', 'buy', 'available', '444 Solar Plains', 'Phoenix', 'AZ', '85001', 0, 0, 871200.00, 'unfurnished', 0, false, false, now() - interval '14 days'),
  ('00000000-0000-0000-0000-000000000115', '00000000-0000-0000-0000-000000000001', 'Malibu Beach Retreat', 'malibu-beach-retreat', 'Beautiful beachfront cottage with private pier and smart deck.', 3200000.00, 'house', 'buy', 'available', '555 Pacific Coast Hwy', 'Malibu', 'CA', '90265', 3, 3, 2400.00, 'furnished', 3, true, true, now() - interval '15 days');

-- 3. Insert Property Images
INSERT INTO public.property_images (property_id, url, is_primary)
VALUES
  ('00000000-0000-0000-0000-000000000101', 'https://example.com/images/villa1.jpg', true),
  ('00000000-0000-0000-0000-000000000102', 'https://example.com/images/penthouse1.jpg', true),
  ('00000000-0000-0000-0000-000000000103', 'https://example.com/images/loft1.jpg', true),
  ('00000000-0000-0000-0000-000000000104', 'https://example.com/images/mansion1.jpg', true),
  ('00000000-0000-0000-0000-000000000105', 'https://example.com/images/smart1.jpg', true),
  ('00000000-0000-0000-0000-000000000106', 'https://example.com/images/studio1.jpg', true),
  ('00000000-0000-0000-0000-000000000107', 'https://example.com/images/land1.jpg', true),
  ('00000000-0000-0000-0000-000000000108', 'https://example.com/images/suite1.jpg', true),
  ('00000000-0000-0000-0000-000000000109', 'https://example.com/images/cabin1.jpg', true),
  ('00000000-0000-0000-0000-000000000110', 'https://example.com/images/hub1.jpg', true),
  ('00000000-0000-0000-0000-000000000111', 'https://example.com/images/sunset1.jpg', true),
  ('00000000-0000-0000-0000-000000000112', 'https://example.com/images/condo1.jpg', true),
  ('00000000-0000-0000-0000-000000000113', 'https://example.com/images/quantum1.jpg', true),
  ('00000000-0000-0000-0000-000000000114', 'https://example.com/images/solar1.jpg', true),
  ('00000000-0000-0000-0000-000000000115', 'https://example.com/images/malibu1.jpg', true);
