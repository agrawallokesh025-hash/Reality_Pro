-- Migration 0001: Auth setup, RLS policies, and Triggers

-- 1. Trigger for creating user profiles automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'user' -- Default role is 'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for "users"
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view basic public profile of agents" ON users FOR SELECT USING (role IN ('seller', 'admin'));

-- Policies for "properties"
CREATE POLICY "Anyone can view properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Sellers can create properties" ON properties FOR INSERT WITH CHECK (
  auth.uid() = seller_id AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('seller', 'admin'))
);
CREATE POLICY "Sellers can update their own properties" ON properties FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete their own properties" ON properties FOR DELETE USING (auth.uid() = seller_id);

-- Policies for "property_images"
CREATE POLICY "Anyone can view property images" ON property_images FOR SELECT USING (true);
CREATE POLICY "Sellers can manage property images" ON property_images FOR ALL USING (
  EXISTS (SELECT 1 FROM properties WHERE id = property_id AND seller_id = auth.uid())
);

-- Policies for "favorites"
CREATE POLICY "Users can manage their own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Policies for "bookings"
CREATE POLICY "Users can manage their own bookings" ON bookings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Sellers can view bookings for their properties" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM properties WHERE id = property_id AND seller_id = auth.uid())
);
