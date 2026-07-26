-- ==========================================================
-- BLOGSPHERE SUPABASE SAMPLE SEED DATA SCRIPT
-- Copy & Run this script in Supabase Dashboard -> SQL Editor
-- (Make sure you ran supabase_schema.sql first!)
-- ==========================================================

-- 1. SEED PROFILES
INSERT INTO public.profiles (id, name, email, avatar_url, bio, headline, website, twitter, role)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Alex Nova',
    'alex.nova@blogsphere.com',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'Quantum networks researcher, tech columnist & digital minimalist.',
    'Senior Technology Analyst @ Cosmic Labs',
    'https://blogsphere.dev',
    'https://twitter.com/alexnova_dev',
    'admin'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Dr. Elena Rostova',
    'elena.rostova@blogsphere.com',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    'AI Ethics Chair & Distributed Systems Researcher. Writing on machine cognition.',
    'Lead AI Scientist @ DeepMind Research',
    'https://elenarostova.ai',
    'https://twitter.com/elena_ai',
    'user'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Marcus Vance',
    'marcus.vance@blogsphere.com',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'Principal UI/UX Architect creating glassmorphic, accessible design systems.',
    'VP of Product Design @ PixelCraft',
    'https://marcusvance.design',
    'https://twitter.com/marcusvance_ui',
    'user'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Sophia Chen',
    'sophia.chen@blogsphere.com',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    'Full-stack software architect specializing in Rust, WebAssembly, and cloud microservices.',
    'Staff Engineer @ CloudScale Infra',
    'https://sophiachen.dev',
    'https://twitter.com/sophiachen_tech',
    'user'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  headline = EXCLUDED.headline,
  avatar_url = EXCLUDED.avatar_url;

-- 2. SEED POSTS
INSERT INTO public.posts (id, title, excerpt, content, cover_image, author_id, tags, view_count, read_time, featured, published)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Architecting the Quantum Web: A New Era of Decentralized Connectivity',
    'Discover how quantum entanglement is reshaping our understanding of global networks and what it means for digital privacy in the decade ahead.',
    '<p>As quantum computing transitions from theoretical physics labs to commercial infrastructure, computer scientists are encountering a groundbreaking paradigm: the Quantum Internet.</p><h2>What is Quantum Entanglement in Networking?</h2><p>Unlike classical optical fiber networks that transmit binary bits (0s and 1s), quantum networks leverage qubits linked through quantum entanglement. This ensures that any eavesdropping attempt instantly alters the quantum state, making data transmission inherently unhackable.</p><blockquote>"Quantum cryptography does not just encrypt data; it fundamentally transforms the physics of information security."</blockquote>',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    '11111111-1111-1111-1111-111111111111',
    ARRAY['Technology', 'AI', 'Web3', 'Innovation'],
    2450,
    6,
    true,
    true
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Beyond Transformers: The Dawn of Multi-Modal Reasoning Engines',
    'An architectural deep dive into next-generation AI foundation models that unify symbolic logic with continuous neural representations.',
    '<p>Generative language models have captured the global imagination, yet token prediction represents only the first stepping stone toward true artificial general reasoning.</p><h2>Unifying Symbolic Logic with Neural Arrays</h2><p>Modern machine intelligence is shifting toward hybrid architectures. By pairing continuous embedding layers with discrete symbolic solvers, future models reason through complex mathematical proofs without hallucinations.</p>',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80',
    '22222222-2222-2222-2222-222222222222',
    ARRAY['AI', 'Technology', 'Innovation', 'Coding'],
    3120,
    7,
    true,
    true
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Crafting Cosmic Glass: Principles of Modern Glassmorphism & UI Elegance',
    'Learn how to construct vibrant translucent interfaces, dynamic ambient glows, and responsive elevation systems in CSS.',
    '<p>Visual aesthetics in web applications are far more than cosmetic polish; they form the foundation of immediate user trust, immersion, and engagement.</p><h2>The 4 Pillars of Cosmic Glass Design</h2><p>1. Backdrop Filters: Subtle Gaussian bluring.<br/>2. Tailored Borders: Multi-stop linear gradients.<br/>3. Dynamic Ambient Glows: Responsive shadow highlights.<br/>4. Harmonious Typography: Clean sans-serif headers paired with serif prose.</p>',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    '33333333-3333-3333-3333-333333333333',
    ARRAY['Design', 'Web Development', 'Coding'],
    1890,
    5,
    true,
    true
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'High-Performance Microservices in Rust & WebAssembly: A Production Benchmark',
    'Replacing heavy container runtimes with lightweight WebAssembly modules yields 10x throughput and 90% memory savings.',
    '<p>As cloud infrastructure costs grow exponentially, backend architects are seeking alternatives to heavy Docker runtime footprints for micro-services.</p><h2>Why WebAssembly on the Server?</h2><p>Wasm runtimes provide hardware-level sandboxing with near-instant startup times (under 5 milliseconds).</p>',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    '44444444-4444-4444-4444-444444444444',
    ARRAY['Coding', 'Technology', 'Web Development'],
    1560,
    6,
    false,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt;

-- 3. SEED COMMENTS
INSERT INTO public.comments (id, post_id, author_id, content)
VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222',
    'Fascinating read on QKD protocols! The security implications for decentralized key exchange are truly transformative.'
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '33333333-3333-3333-3333-333333333333',
    'The diagramming of quantum entanglement networks is super clear. Great article, Alex!'
  )
ON CONFLICT (id) DO NOTHING;

-- 4. SEED NOTIFICATIONS
INSERT INTO public.notifications (id, recipient_id, actor_id, type, post_id, read)
VALUES
  (
    'n1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'clap',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    false
  )
ON CONFLICT (id) DO NOTHING;
