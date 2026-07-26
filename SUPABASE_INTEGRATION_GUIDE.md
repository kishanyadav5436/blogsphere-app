# BlogSphere - Supabase Integration Guide

This guide explains how to connect and migrate **BlogSphere** from MongoDB to **Supabase** (PostgreSQL, Auth, Storage, and Realtime).

---

## 1. Prerequisites & Account Setup

1. Create a free account at [Supabase.com](https://supabase.com).
2. Create a new project named `blogsphere`.
3. Obtain your Project Credentials from **Project Settings -> API**:
   - **Project URL**: `https://<your-project-id>.supabase.co`
   - **`anon` Public Key**: Client-side API key.
   - **`service_role` Secret Key**: Server-side secret key.

---

## 2. Environment Variables Configuration

### Backend `.env` (`backend/.env`)

```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend `.env` (`frontend/.env`)

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_public_key
```

---

## 3. Database Schema Setup (Supabase SQL Editor)

Run the following SQL migration script in your **Supabase Dashboard -> SQL Editor**:

```sql
-- 1. PROFILES TABLE (Linked to Supabase Auth Users)
CREATE TABLE public.profiles (
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. POSTS TABLE
CREATE TABLE public.posts (
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
CREATE POLICY "Published posts are viewable by everyone" ON public.posts FOR SELECT USING (published = true);
CREATE POLICY "Authors can insert own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- 3. CLAPS TABLE
CREATE TABLE public.claps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  count INT DEFAULT 1 CHECK (count <= 50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 4. COMMENTS TABLE
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKMARKS TABLE
CREATE TABLE public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 6. FOLLOWS TABLE
CREATE TABLE public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Code Implementation

### Step 1: Install `@supabase/supabase-js`

```bash
# In backend directory
cd backend
npm install @supabase/supabase-js

# In frontend directory
cd ../frontend
npm install @supabase/supabase-js
```

### Step 2: Client Initialization Files

#### Backend Client (`backend/config/supabase.js`)

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;
```

#### Frontend Client (`frontend/src/config/supabase.js`)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 5. Image Storage Bucket Setup

1. Go to **Supabase Dashboard -> Storage**.
2. Click **New Bucket** and name it `blog-assets`.
3. Check the box to make it **Public**.
4. Use the Supabase SDK to upload cover images directly:

```javascript
const uploadImage = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('blog-assets')
    .upload(fileName, file);

  if (error) throw error;
  
  const { data: publicUrlData } = supabase.storage
    .from('blog-assets')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};
```

---

## 6. Real-time Subscription Setup

Supabase built-in Realtime enables instant notification updates without requiring a custom WebSocket server:

```javascript
// Listen to new notifications in React component
useEffect(() => {
  const channel = supabase
    .channel('public:notifications')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
      console.log('New notification received!', payload.new);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```
