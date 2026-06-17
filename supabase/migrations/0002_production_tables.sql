-- Migration: Add blog_posts, property_views, email_logs tables and extend status fields
-- Target Supabase Project Ref: octdlzzsvomgrbleqtpx

-- 1. Extend property_status enum
-- In PostgreSQL, ALTER TYPE ADD VALUE cannot run inside a transaction block,
-- but standard SQL statements are executed sequentially.
ALTER TYPE property_status ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE property_status ADD VALUE IF NOT EXISTS 'under_offer';

-- 2. Create Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Property Views Table (impression counters)
CREATE TABLE IF NOT EXISTS public.property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Email Logs Table (outbox auditor)
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL, -- 'sent', 'failed'
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_property_views_property ON public.property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient);

-- 6. Enable Row-Level Security (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
-- Blog posts: Everyone can read published posts. Only admins can manage posts.
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.blog_posts;
CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (published_at IS NOT NULL AND published_at <= NOW());

DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Property views: Anyone can insert view logs (public traffic). Only admins can inspect views.
DROP POLICY IF EXISTS "Anyone can log property views" ON public.property_views;
CREATE POLICY "Anyone can log property views" ON public.property_views FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view property views" ON public.property_views;
CREATE POLICY "Admins can view property views" ON public.property_views FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Email logs: Only admins can view email dispatch logs.
DROP POLICY IF EXISTS "Admins can view email logs" ON public.email_logs;
CREATE POLICY "Admins can view email logs" ON public.email_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Anyone can insert email logs" ON public.email_logs;
CREATE POLICY "Anyone can insert email logs" ON public.email_logs FOR INSERT WITH CHECK (true);

