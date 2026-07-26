# BlogSphere

A modern, full-stack editorial blogging platform built with a dark glassmorphic UI aesthetic, real-time interactive components, and robust backend services.

---

## 🌟 Key Features

- **Glassmorphic UI & Dark Theme**: Sleek translucent glass cards, dynamic particle networks, subtle borders, and neon accent glows.
- **Rich Text Editor**: Full article editing support powered by `react-quill` with live formatting, code blocks, and media embeds.
- **Editorial Experience**: Featured author spotlights ("Cosmic Minds"), tag-based filtering, real-time search, and reading time estimation.
- **User Authentication**: Secure JWT-based authentication for user registration, login, and protected routes.
- **Engagement System**: Interactive post liking, bookmarking, and community comments.
- **Responsive Design**: Mobile-first layout with smooth micro-animations and intuitive navigation.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM v6
- **Styling**: Vanilla CSS (Custom Design System with Glassmorphism)
- **Icons & Visuals**: React Icons, `tsparticles`

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: Supabase / MongoDB
- **Authentication**: JSON Web Token (JWT) & bcryptjs
- **API Architecture**: RESTful API with express-validator

---

## 📁 Repository Structure

```text
BlogSphere/
├── frontend/             # React single-page application
│   ├── public/           # Static assets
│   └── src/              # Components, pages, and context state
├── backend/              # Node.js + Express API server
│   ├── config/           # Database and authentication configs
│   ├── middleware/       # Auth verification & error handlers
│   ├── models/           # Data models & schemas
│   └── routes/           # REST API endpoint routes
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16.0 or higher)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/kishanyadav5436/blogsphere-app.git
cd blogsphere-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

Start the backend server:
```bash
npm run dev
```
> Server running at `http://localhost:5000`

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm start
```
> Client running at `http://localhost:3000`

---

## 📡 Core API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & get token | ❌ |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | ✅ |
| `GET` | `/api/posts` | Fetch paginated posts (search & tag filtering) | ❌ |
| `GET` | `/api/posts/:id` | Fetch single post details | ❌ |
| `POST` | `/api/posts` | Create a new blog post | ✅ |
| `PUT` | `/api/posts/:id` | Edit an existing post (Author only) | ✅ |
| `DELETE` | `/api/posts/:id` | Delete a post (Author only) | ✅ |
| `PUT` | `/api/posts/:id/like` | Like / Unlike a post | ✅ |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
