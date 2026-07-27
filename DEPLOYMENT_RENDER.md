# 🚀 BlogSphere Deployment Guide on Render

This guide provides step-by-step instructions to deploy **BlogSphere** (Full-Stack MERN / React + Node.js) on [Render](https://render.com).

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Database Setup (MongoDB Atlas)](#2-database-setup-mongodb-atlas)
3. [Deployment Option A: Render Blueprint (1-Click Automated)](#3-deployment-option-a-render-blueprint-1-click-automated)
4. [Deployment Option B: Manual Setup (Render Dashboard)](#4-deployment-option-b-manual-setup-render-dashboard)
5. [Environment Variables Reference](#5-environment-variables-reference)
6. [Post-Deployment & Troubleshooting](#6-post-deployment--troubleshooting)

---

## 1. Prerequisites

- A **GitHub Account** containing your cloned or pushed repository (`kishanyadav5436/blogsphere-app`).
- A **Render Account** (free tier available at [render.com](https://render.com)).
- A **MongoDB Atlas Account** (free cloud database at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)).

---

## 2. Database Setup (MongoDB Atlas)

Since local MongoDB (`mongodb://localhost:27017`) is not accessible from Render cloud servers, set up a free cloud database:

1. **Sign up / Log in** to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Create a Free Cluster** (M0 Sandbox - 512MB free).
3. **Create a Database User**:
   - Go to **Security -> Database Access**.
   - Add a new database user (e.g. username: `admin`, generate a strong password).
4. **Configure IP Access**:
   - Go to **Security -> Network Access**.
   - Click **Add IP Address** -> Select **Allow Access From Anywhere** (`0.0.0.0/0`) so Render servers can connect.
5. **Get Connection String**:
   - Go to **Database -> Connect -> Drivers**.
   - Copy your connection string (format: `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/blogdb?retryWrites=true&w=majority`).
   - Replace `<username>` and `<password>` with your database user credentials.

---

## 3. Deployment Option A: Render Blueprint (1-Click Automated)

Our repository includes a pre-configured `render.yaml` blueprint file. Render will automatically set up both the backend API and frontend static site.

### Steps:
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** (top right) -> Select **Blueprint**.
3. Connect your GitHub repository (`blogsphere-app`).
4. Render will read `render.yaml` and prompt you for required parameters:
   - `MONGO_URI`: Paste your MongoDB Atlas connection string.
   - `JWT_SECRET`: Render auto-generates a secure secret, or you can enter a custom key.
5. Click **Apply**. Render will automatically provision both services:
   - `blogsphere-backend` (Node.js API)
   - `blogsphere-frontend` (React Static Site)

Render will handle setting `REACT_APP_API_URL` and `CLIENT_URL` between the two services automatically!

---

## 4. Deployment Option B: Manual Setup (Render Dashboard)

If you prefer to configure services manually via the Render Web UI:

### Step 4.1: Deploy Backend Web Service
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Select your GitHub repository.
3. Configure the settings:
   - **Name**: `blogsphere-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/blogdb`
   - `JWT_SECRET`: `your_secure_jwt_secret_key`
   - `JWT_EXPIRE`: `7d`
   - `CLIENT_URL`: `https://blogsphere-frontend.onrender.com` (update after creating frontend)
5. Click **Create Web Service**.
6. Copy the deployed backend URL (e.g. `https://blogsphere-backend.onrender.com`).

---

### Step 4.2: Deploy Frontend Static Site
1. In Render Dashboard, click **New +** -> **Static Site**.
2. Select your GitHub repository.
3. Configure the settings:
   - **Name**: `blogsphere-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Add **Environment Variable**:
   - `REACT_APP_API_URL`: `https://blogsphere-backend.onrender.com` (Your backend service URL)
5. Add **Rewrite Rules** (for React Router single-page navigation):
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
6. Click **Create Static Site**.

---

## 5. Environment Variables Reference

### Backend (`backend/`)
| Variable | Description | Example / Value |
|---|---|---|
| `NODE_ENV` | Runtime environment | `production` |
| `PORT` | Server listening port | `10000` (Render default) |
| `MONGO_URI` | Cloud database connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `random_long_secret_string` |
| `JWT_EXPIRE` | Token validity duration | `7d` |
| `CLIENT_URL` | Allowed frontend domain for CORS | `https://blogsphere-frontend.onrender.com` |
| `SUPABASE_URL` | Supabase project URL | `https://todcuzbuiikggzcuofck.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase publishable key | `sb_publishable_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key | `sb_publishable_...` |

### Frontend (`frontend/`)
| Variable | Description | Example / Value |
|---|---|---|
| `REACT_APP_API_URL` | Deployed backend API base URL | `https://blogsphere-backend.onrender.com` |
| `REACT_APP_SUPABASE_URL` | Supabase project URL (optional) | `https://todcuzbuiikggzcuofck.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase publishable key (optional) | `sb_publishable_...` |

---

## 6. Post-Deployment & Troubleshooting

### 1. Verification
- Open your backend URL: `https://blogsphere-backend.onrender.com/`
  - Expected JSON response: `{"message":"BlogSphere API is running 🚀","status":"OK",...}`
- Open your frontend URL: `https://blogsphere-frontend.onrender.com/`
  - Test registration, login, blog post creation, reading, and bookmarking.

### 2. Common Issues & Fixes
- **Backend Spin-Up Delay (Render Free Tier)**:
  - Free web services on Render sleep after 15 minutes of inactivity. The first request after sleep may take 30-50 seconds to respond while waking up.
- **MongoDB Connection Error (`MongooseServerSelectionError`)**:
  - Verify IP access in MongoDB Atlas network security is set to `0.0.0.0/0`.
  - Ensure password special characters are URL-encoded in `MONGO_URI` (e.g. `@` as `%40`).
- **CORS Error in Browser Console**:
  - Check that `CLIENT_URL` on backend matches your exact frontend URL without a trailing slash.
- **404 Not Found on Page Refresh**:
  - Ensure the SPA rewrite rule (`/* -> /index.html`) is active on Render Static Site dashboard or `public/_redirects` is included in the build.
