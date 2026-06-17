-- Run this query in your Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/octdlzzsvomgrbleqtpx/sql/new)
-- This promotes the verified test seller account to the 'admin' role.

UPDATE public.users
SET role = 'admin'
WHERE email = 'test.seller.verified@gmail.com';
