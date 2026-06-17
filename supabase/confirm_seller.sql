-- Run this query in the Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/octdlzzsvomgrbleqtpx/sql/new)
-- This confirms the seeded seller account and sets the correct password format.

UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  encrypted_password = crypt('password123', gen_salt('bf'))
WHERE email = 'test.seller@example.com';

UPDATE public.users
SET role = 'seller'
WHERE email = 'test.seller@example.com';
