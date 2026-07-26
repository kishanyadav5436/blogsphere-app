-- ==========================================================
-- BLOGSPHERE SUPABASE POSTGRESQL DATABASE MIGRATION SCRIPT
-- Copy & Run this entire script in Supabase Dashboard -> SQL Editor
-- ==========================================================

-- 1. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT DEFAULT '',
  bio VARCHAR(200) DEFAULT '',
  headline VARCHAR(100) DEFAULT '',
  website TEXT DEFAULT '',
  twitter TEXT DEFAULT '',
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create profile on Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  excerpt VARCHAR(300) NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT DEFAULT '',
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  view_count INT DEFAULT 0,
  read_time INT DEFAULT 1,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are viewable by everyone" ON public.posts FOR SELECT USING (published = true);
CREATE POLICY "Authors can insert own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- 3. CLAPS TABLE (Up to 50 claps per user per post)
CREATE TABLE IF NOT EXISTS public.claps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  count INT DEFAULT 1 CHECK (count <= 50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE public.claps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Claps viewable by everyone" ON public.claps FOR SELECT USING (true);
CREATE POLICY "Authenticated users can clap" ON public.claps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own claps" ON public.claps FOR UPDATE USING (auth.uid() = user_id);

-- 4. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- 5. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- 6. FOLLOWS TABLE
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Follows viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users insert own follow" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users delete own follow" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = recipient_id);

-- 8. STORAGE BUCKET FOR MEDIA ASSETS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-assets', 'blog-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access to blog-assets" ON storage.objects FOR SELECT USING (bucket_id = 'blog-assets');
CREATE POLICY "Auth Upload to blog-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-assets' AND auth.role() = 'authenticated');
