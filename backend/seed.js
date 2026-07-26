const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Notification = require('./models/Notification');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blogdb';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing collections
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Notification.deleteMany({});
    console.log('🧹 Cleared existing posts, comments, and notifications.');

    // Seed Authors
    const authorsData = [
      {
        name: 'Alex Nova',
        email: 'alex.nova@blogsphere.com',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: 'Quantum networks researcher, tech columnist & digital minimalist.',
        headline: 'Senior Technology Analyst @ Cosmic Labs',
        website: 'https://blogsphere.dev',
        twitter: 'https://twitter.com/alexnova_dev'
      },
      {
        name: 'Dr. Elena Rostova',
        email: 'elena.rostova@blogsphere.com',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        bio: 'AI Ethics Chair & Distributed Systems Researcher. Writing on machine cognition and human dignity.',
        headline: 'Lead AI Scientist @ DeepMind Research',
        website: 'https://elenarostova.ai',
        twitter: 'https://twitter.com/elena_ai'
      },
      {
        name: 'Marcus Vance',
        email: 'marcus.vance@blogsphere.com',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        bio: 'Principal UI/UX Architect creating glassmorphic, accessible, and high-performance design systems.',
        headline: 'VP of Product Design @ PixelCraft',
        website: 'https://marcusvance.design',
        twitter: 'https://twitter.com/marcusvance_ui'
      },
      {
        name: 'Sophia Chen',
        email: 'sophia.chen@blogsphere.com',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        bio: 'Full-stack software architect specializing in Rust, WebAssembly, and high-concurrency microservices.',
        headline: 'Staff Engineer @ CloudScale Infra',
        website: 'https://sophiachen.dev',
        twitter: 'https://twitter.com/sophiachen_tech'
      }
    ];

    const seededAuthors = [];
    for (const aData of authorsData) {
      let user = await User.findOne({ email: aData.email });
      if (!user) {
        user = await User.create(aData);
      }
      seededAuthors.push(user);
    }
    console.log(`👤 Seeded ${seededAuthors.length} author profiles.`);

    const [alex, elena, marcus, sophia] = seededAuthors;

    // Seed Posts
    const postsData = [
      {
        title: 'Architecting the Quantum Web: A New Era of Decentralized Connectivity',
        excerpt: 'Discover how quantum entanglement is reshaping our understanding of global networks and what it means for digital privacy in the decade ahead.',
        content: `<p>As quantum computing transitions from theoretical physics labs to commercial infrastructure, computer scientists are encountering a groundbreaking paradigm: the Quantum Internet.</p>
        <h2>What is Quantum Entanglement in Networking?</h2>
        <p>Unlike classical optical fiber networks that transmit binary bits (0s and 1s), quantum networks leverage qubits linked through quantum entanglement. This ensures that any eavesdropping attempt instantly alters the quantum state, making data transmission inherently unhackable.</p>
        <blockquote>"Quantum cryptography does not just encrypt data; it fundamentally transforms the physics of information security."</blockquote>
        <p>In this article, we explore the architectural layers of quantum key distribution (QKD) and how future decentralized web protocols will adapt to ultra-low latency quantum entanglement channels.</p>`,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
        tags: ['Technology', 'AI', 'Web3', 'Innovation'],
        author: alex._id,
        featured: true,
        readTime: 6,
        viewCount: 2450
      },
      {
        title: 'Beyond Transformers: The Dawn of Multi-Modal Reasoning Engines',
        excerpt: 'An architectural deep dive into next-generation AI foundation models that unify symbolic logic with continuous neural representations.',
        content: `<p>Generative language models have captured the global imagination, yet token prediction represents only the first stepping stone toward true artificial general reasoning.</p>
        <h2>Unifying Symbolic Logic with Neural Arrays</h2>
        <p>Modern machine intelligence is shifting toward hybrid architectures. By pairing continuous embedding layers with discrete symbolic solvers, future models reason through complex mathematical proofs without hallucinations.</p>
        <blockquote>"Language is the medium of human expression, but logic is the skeleton of truth."</blockquote>
        <p>We analyze benchmark performances across autonomous multi-modal agents and explore what this means for software engineering workflows.</p>`,
        coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80',
        tags: ['AI', 'Technology', 'Innovation', 'Coding'],
        author: elena._id,
        featured: true,
        readTime: 7,
        viewCount: 3120
      },
      {
        title: 'Crafting Cosmic Glass: Principles of Modern Glassmorphism & UI Elegance',
        excerpt: 'Learn how to construct vibrant translucent interfaces, dynamic ambient glows, and responsive elevation systems in CSS.',
        content: `<p>Visual aesthetics in web applications are far more than cosmetic polish; they form the foundation of immediate user trust, immersion, and engagement.</p>
        <h2>The 4 Pillars of Cosmic Glass Design</h2>
        <p>1. <strong>Backdrop Filters:</strong> Subtle Gaussian blurs (<code>blur(12px)</code>) that soften background content while maintaining context.<br/>
        2. <strong>Tailored Borders:</strong> Multi-stop linear gradients featuring subtle opacity shifts.<br/>
        3. <strong>Dynamic Ambient Glows:</strong> Radial gradient shadows that react to user cursor movements.<br/>
        4. <strong>Harmonious Typography:</strong> Clean sans-serif UI headers paired with elegant editorial body prose.</p>`,
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
        tags: ['Design', 'Web Development', 'Coding'],
        author: marcus._id,
        featured: true,
        readTime: 5,
        viewCount: 1890
      },
      {
        title: 'High-Performance Microservices in Rust & WebAssembly: A Production Benchmark',
        excerpt: 'Replacing heavy container runtimes with lightweight WebAssembly modules yields 10x throughput and 90% memory savings.',
        content: `<p>As cloud infrastructure costs grow exponentially, backend architects are seeking alternatives to heavy Docker runtime footprints for micro-services.</p>
        <h2>Why WebAssembly on the Server?</h2>
        <p>Wasm runtimes provide hardware-level sandboxing with near-instant startup times (under 5 milliseconds). When compiled from Rust, backend microservices handle tens of thousands of concurrent requests on minimal CPU allocation.</p>
        <blockquote>"Efficiency in software isn't just an optimization metric; it's a sustainability imperative."</blockquote>`,
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
        tags: ['Coding', 'Technology', 'Web Development'],
        author: sophia._id,
        featured: false,
        readTime: 6,
        viewCount: 1560
      },
      {
        title: 'The Solitude of Digital Existence: Reclaiming Deep Focus in a Hyper-Connected World',
        excerpt: 'Exploring how continuous notifications fragment cognition and practical strategies for cultivating intentional digital minimalism.',
        content: `<p>We live in an era where we are constantly reached, yet rarely deeply heard. Social algorithm feeds offer an illusion of intimate proximity while insulating us from meaningful intellectual depth.</p>
        <h2>The Architecture of Attention</h2>
        <p>Modern web applications are engineered around dopamine loop triggers. By reclaiming intentional solitude and quiet reading environments like BlogSphere, we cultivate deeper focus and long-form comprehension.</p>
        <blockquote>"Solitude is not loneliness; it is the sanctuary where deep thought and creative insight reside."</blockquote>`,
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
        tags: ['Philosophy', 'Lifestyle', 'Productivity'],
        author: alex._id,
        featured: false,
        readTime: 4,
        viewCount: 1240
      },
      {
        title: 'Neuro-Interfaces: The Dawn of Direct Thought-to-Prose Authoring',
        excerpt: 'Direct neural interfaces are exiting clinical trials. How brain-computer sensors will revolutionize long-form publishing.',
        content: `<p>Direct neural interfaces are no longer restricted to research laboratories. Recent clinical trials demonstrate high-speed text synthesis directly from motor cortex neural firing patterns.</p>
        <h2>Synthesizing Thought into Prose</h2>
        <p>Imagine composing complex technical books by silently conceptualizing narrative flows while generative AI assistants format syntax, cross-references, and code snippets in real time.</p>`,
        coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
        tags: ['Innovation', 'AI', 'Technology'],
        author: elena._id,
        featured: false,
        readTime: 5,
        viewCount: 1780
      }
    ];

    const createdPosts = await Post.insertMany(postsData);
    console.log(`📚 Successfully seeded ${createdPosts.length} rich story articles!`);

    // Seed Sample Comments on the first post
    const sampleComments = [
      {
        post: createdPosts[0]._id,
        author: elena._id,
        content: 'Fascinating read on QKD protocols! The security implications for decentralized key exchange are truly transformative.',
        likes: [alex._id, marcus._id]
      },
      {
        post: createdPosts[0]._id,
        author: marcus._id,
        content: 'The diagramming of quantum entanglement networks is super clear. Great article, Alex!',
        likes: [elena._id]
      },
      {
        post: createdPosts[1]._id,
        author: sophia._id,
        content: 'Combining symbolic logic with continuous embeddings solves the exact hallucination problem we faced in automated code review models!',
        likes: [elena._id, alex._id]
      }
    ];

    await Comment.insertMany(sampleComments);
    console.log(`💬 Seeded ${sampleComments.length} discussion comments!`);

    // Seed Sample Notification for Alex Nova
    await Notification.create({
      recipient: alex._id,
      actor: elena._id,
      type: 'clap',
      post: createdPosts[0]._id,
      read: false
    });
    await Notification.create({
      recipient: alex._id,
      actor: marcus._id,
      type: 'comment',
      post: createdPosts[0]._id,
      read: false
    });
    console.log(`🔔 Seeded sample notifications for Alex Nova.`);

    console.log('🎉 Data seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedData();
