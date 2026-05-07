# 🌿 SprayBot Monitor — Web-Based Monitoring Dashboard

A real-time IoT dashboard for pesticide spraying bots (ESP32 + ThingSpeak).  
Supports **English / हिन्दी / తెలుగు** with live ThingSpeak data, demo mode, and full bot management.

---

## 🚀 Deploy in 10 Minutes (Free)

### STEP 1 — Deploy the Backend on Render

1. Go to **https://render.com** and click **"Sign Up"** → choose **"Sign up with GitHub"**
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect a repository"** → select **`web-based-monitoring-dashboard`**
4. Fill in these settings:
   - **Name:** `spraybot-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free
5. Scroll down to **"Environment Variables"** and add:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGODB_URI` | your MongoDB connection string (see below) |
   | `JWT_SECRET` | any long random string e.g. `mySecretKey123456789abc` |
   | `JWT_EXPIRES_IN` | `30d` |
   | `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` (update after step 2) |

6. Click **"Create Web Service"**
7. Wait ~2 minutes. Copy your backend URL — it looks like:  
   `https://spraybot-backend.onrender.com`

> **Getting a MongoDB URI (free):**
> - Go to https://cloud.mongodb.com → Create free account
> - Create a free cluster → Click "Connect" → "Drivers"
> - Copy the connection string and replace `<password>` with your password

---

### STEP 2 — Deploy the Frontend on Vercel

1. Go to **https://vercel.com** and click **"Sign Up"** → choose **"Continue with GitHub"**
2. Click **"Add New..."** → **"Project"**
3. Find **`web-based-monitoring-dashboard`** → click **"Import"**
4. Set:
   - **Root Directory:** click "Edit" → type `frontend` → click "Continue"
   - **Framework Preset:** Vite (auto-detected)
5. Expand **"Environment Variables"** and add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | your Render backend URL from Step 1 e.g. `https://spraybot-backend.onrender.com` |

6. Click **"Deploy"**
7. Wait ~1 minute. Your live website link will appear — it looks like:  
   `https://web-based-monitoring-dashboard.vercel.app`

---

### STEP 3 — Update CORS on Render

1. Go back to **Render** → your `spraybot-backend` service → **"Environment"**
2. Update `ALLOWED_ORIGINS` to your actual Vercel URL:  
   `https://web-based-monitoring-dashboard.vercel.app`
3. Click **"Save Changes"** — Render will redeploy automatically

---

## ✅ Your website is now live!

Open your Vercel URL in any browser. Share it with anyone.

---

## 🛠 Local Development

```bash
# Backend
cd backend
cp .env.example .env      # fill in your values
npm install
npm run dev               # runs on http://localhost:5000

# Frontend (new terminal)
cd frontend
cp .env.example .env      # set VITE_API_URL=http://localhost:5000
npm install
npm run dev               # runs on http://localhost:8080
```

---

## 📱 Features

- **Live ThingSpeak data** — distance, area, pesticide, tank level
- **Demo mode** — works without a real bot connected
- **3 languages** — English, हिन्दी, తెలుగు (switchable anywhere)
- **Manual bot connect** — enter Bot ID + ThingSpeak Channel ID + Read API Key
- **Reports** — demo reports always visible, live reports when bot is connected
- **Dark / Light theme**
- **Mobile responsive** with bottom navigation

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express, MongoDB, JWT |
| IoT Data | ThingSpeak API (ESP32) |
| Charts | Recharts |
| Hosting | Vercel (frontend) + Render (backend) |
