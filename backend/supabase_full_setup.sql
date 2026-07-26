-- ==========================================================
-- BLOGSPHERE SUPABASE FULL SETUP (CREATES TABLES + SEEDS DATA)
-- ==========================================================

-- ----------------------------------------------------------
-- STEP 1: CREATE TABLES & RLS POLICIES
-- ----------------------------------------------------------

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles viewable" ON public.profiles;
CREATE POLICY "Public profiles viewable" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Users insert profile" ON public.profiles;
CREATE POLICY "Users insert profile" ON public.profiles FOR INSERT WITH CHECK (true);

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

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Posts viewable" ON public.posts;
CREATE POLICY "Posts viewable" ON public.posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Posts insert" ON public.posts;
CREATE POLICY "Posts insert" ON public.posts FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Posts update" ON public.posts;
CREATE POLICY "Posts update" ON public.posts FOR UPDATE USING (true);

-- 3. CLAPS TABLE
CREATE TABLE IF NOT EXISTS public.claps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  count INT DEFAULT 1 CHECK (count <= 50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE public.claps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Claps viewable" ON public.claps;
CREATE POLICY "Claps viewable" ON public.claps FOR SELECT USING (true);
DROP POLICY IF EXISTS "Claps insert" ON public.claps;
CREATE POLICY "Claps insert" ON public.claps FOR INSERT WITH CHECK (true);

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
DROP POLICY IF EXISTS "Comments viewable" ON public.comments;
CREATE POLICY "Comments viewable" ON public.comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Comments insert" ON public.comments;
CREATE POLICY "Comments insert" ON public.comments FOR INSERT WITH CHECK (true);

-- 5. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Bookmarks viewable" ON public.bookmarks;
CREATE POLICY "Bookmarks viewable" ON public.bookmarks FOR SELECT USING (true);

-- 6. FOLLOWS TABLE
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Follows viewable" ON public.follows;
CREATE POLICY "Follows viewable" ON public.follows FOR SELECT USING (true);

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
DROP POLICY IF EXISTS "Notifications viewable" ON public.notifications;
CREATE POLICY "Notifications viewable" ON public.notifications FOR SELECT USING (true);


-- ----------------------------------------------------------
-- STEP 2: INSERT SEED DATA (PROFILES, POSTS, COMMENTS, NOTIFICATIONS)
-- ----------------------------------------------------------

-- SEED PROFILES (Valid Hex UUIDs: 0-9, a-f)
INSERT INTO public.profiles (id, name, email, avatar_url, bio, headline, website, twitter, role)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Alex Nova', 'alex.nova@blogsphere.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 'Quantum networks researcher, tech columnist & digital minimalist.', 'Senior Technology Analyst @ Cosmic Labs', 'https://blogsphere.dev', 'https://twitter.com/alexnova_dev', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'Dr. Elena Rostova', 'elena.rostova@blogsphere.com', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', 'AI Ethics Chair & Distributed Systems Researcher.', 'Lead AI Scientist @ DeepMind Research', 'https://elenarostova.ai', 'https://twitter.com/elena_ai', 'user'),
  ('33333333-3333-3333-3333-333333333333', 'Marcus Vance', 'marcus.vance@blogsphere.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 'Principal UI/UX Architect creating glassmorphic design systems.', 'VP of Product Design @ PixelCraft', 'https://marcusvance.design', 'https://twitter.com/marcusvance_ui', 'user'),
  ('44444444-4444-4444-4444-444444444444', 'Sophia Chen', 'sophia.chen@blogsphere.com', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', 'Full-stack software architect specializing in Rust & WebAssembly.', 'Staff Engineer @ CloudScale Infra', 'https://sophiachen.dev', 'https://twitter.com/sophiachen_tech', 'user')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, headline = EXCLUDED.headline, avatar_url = EXCLUDED.avatar_url;

-- SEED POSTS (Valid Hex UUIDs: a-f)
INSERT INTO public.posts (id, title, excerpt, content, cover_image, author_id, tags, view_count, read_time, featured, published)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Architecting the Quantum Web: A New Era of Decentralized Connectivity', 'Discover how quantum entanglement is reshaping global networks and privacy.', '<p>As quantum computing transitions from theoretical physics labs to commercial infrastructure, computer scientists are encountering a groundbreaking paradigm: the Quantum Internet.</p><h2>What is Quantum Entanglement in Networking?</h2><p>Unlike classical optical fiber networks that transmit binary bits (0s and 1s), quantum networks leverage qubits linked through quantum entanglement.</p>', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80', '11111111-1111-1111-1111-111111111111', ARRAY['Technology', 'AI', 'Web3', 'Innovation'], 2450, 6, true, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Beyond Transformers: The Dawn of Multi-Modal Reasoning Engines', 'An architectural deep dive into next-generation AI foundation models.', '<p>Generative language models have captured the global imagination, yet token prediction represents only the first stepping stone toward true artificial general reasoning.</p>', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80', '22222222-2222-2222-2222-222222222222', ARRAY['AI', 'Technology', 'Innovation', 'Coding'], 3120, 7, true, true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Crafting Cosmic Glass: Principles of Modern Glassmorphism & UI Elegance', 'Learn how to construct translucent interfaces, ambient glows, and responsive elevations.', '<p>Visual aesthetics in web applications form the foundation of immediate user trust, immersion, and engagement.</p>', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80', '33333333-3333-3333-3333-333333333333', ARRAY['Design', 'Web Development', 'Coding'], 1890, 5, true, true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'High-Performance Microservices in Rust & WebAssembly: A Production Benchmark', 'Replacing container runtimes with WebAssembly yields 10x throughput and 90% memory savings.', '<p>As cloud infrastructure costs grow, backend architects seek lightweight WebAssembly runtimes.</p>', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80', '44444444-4444-4444-4444-444444444444', ARRAY['Coding', 'Technology', 'Web Development'], 1560, 6, false, true)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content;

-- SEED COMMENTS (Valid Hex UUIDs)
INSERT INTO public.comments (id, post_id, author_id, content)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Fascinating read on QKD protocols! The security implications for key exchange are truly transformative.'),
  ('c2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'The diagramming of quantum entanglement networks is super clear. Great article, Alex!')
ON CONFLICT (id) DO NOTHING;

-- SEED NOTIFICATIONS (Valid Hex UUID: f1111111-1111-1111-1111-111111111111)
INSERT INTO public.notifications (id, recipient_id, actor_id, type, post_id, read)
VALUES
  ('f1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'clap', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', false)
ON CONFLICT (id) DO NOTHING;
