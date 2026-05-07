# 🌱 SprayBot Monitor — Farmer Dashboard

A real-world web application that helps farmers monitor their pesticide spraying robots in real time. Built for use on Android mobile phones.

---

## What This Project Does

SprayBot Monitor connects to your ESP32-powered pesticide spraying bot and shows you live data on your phone or computer. You can see how far the bot has traveled, how much pesticide it has used, how much battery is left, and how much of your field has been covered.

---

## How It Helps Farmers

- See your bot's live status from anywhere using your phone
- Know when the pesticide tank is running low
- Know when the battery needs charging
- See reports of how much work the bot has done
- Save your farm details (village, district, crops grown)
- Send a help request if something goes wrong

---

## Main Features

- **Login / Register** — Secure account with email and password
- **Live Dashboard** — Real-time bot data (distance, area, pesticide, battery, tank)
- **Devices Page** — See all your connected bots
- **Reports** — Historical charts and analytics
- **Farmer Profile** — Save your name, phone, village, district, state, and crops
- **Help Form** — Send a message if you need support
- **Demo Mode** — See sample data before connecting a real bot
- **Mobile First** — Works great on Android phones
- **Dark / Light Mode** — Easy on the eyes in any lighting

---

## Tech Stack

| Part     | Technology                          |
|----------|-------------------------------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend  | Node.js, Express, MongoDB, Mongoose |
| Auth     | JWT (JSON Web Tokens), bcrypt       |
| Charts   | Recharts                            |
| Deploy   | Render (backend), Vercel (frontend) |

---

## Final Folder Structure

```
/
├── frontend/               ← React app (what farmers see)
│   ├── src/
│   │   ├── components/     ← UI components (sidebar, topbar, bottom nav)
│   │   ├── context/        ← Auth, ThingSpeak state
│   │   ├── hooks/          ← Custom React hooks
│   │   ├── lib/            ← Utilities
│   │   ├── pages/          ← All pages (Dashboard, Profile, Reports, etc.)
│   │   ├── services/       ← API service layer (api.ts)
│   │   └── App.tsx         ← Routes
│   ├── .env                ← Frontend environment variables
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                ← Express API server
│   ├── src/
│   │   ├── config/         ← MongoDB connection
│   │   ├── controllers/    ← Route logic (auth, profile, bots, telemetry, help)
│   │   ├── middleware/     ← Auth guard, error handler, validator
│   │   ├── models/         ← MongoDB schemas (User, Bot, Telemetry, HelpRequest)
│   │   ├── routes/         ← API route definitions
│   │   ├── services/       ← Business logic
│   │   ├── utils/          ← JWT helper, response helper
│   │   └── app.js          ← Express app setup
│   ├── server.js           ← Entry point
│   ├── .env                ← Backend environment variables
│   └── package.json
│
├── .env.example            ← Template for environment variables
├── .gitignore
└── README.md
```

---

## How to Run Locally

### Step 1 — Set up MongoDB

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free account and a free cluster
3. Click **Connect** → **Connect your application**
4. Copy the connection string (it looks like `mongodb+srv://...`)

### Step 2 — Set up the Backend

```bash
cd backend
npm install
```

Create a file called `.env` inside the `backend/` folder:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=paste_your_mongodb_connection_string_here
JWT_SECRET=any_long_random_string_at_least_32_characters
JWT_EXPIRES_IN=30d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080
```

Start the backend:

```bash
npm start
```

You should see: `🌱 SprayBot Backend running on port 5000`

### Step 3 — Set up the Frontend

```bash
cd frontend
npm install
```

Create a file called `.env` inside the `frontend/` folder:

```
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open your browser at: `http://localhost:8080`

---

## Required Environment Variables

### Backend (`backend/.env`)

| Variable          | Description                                      | Example                          |
|-------------------|--------------------------------------------------|----------------------------------|
| `PORT`            | Port the server runs on                          | `5000`                           |
| `NODE_ENV`        | Environment mode                                 | `development` or `production`    |
| `MONGODB_URI`     | Your MongoDB connection string                   | `mongodb+srv://user:pass@...`    |
| `JWT_SECRET`      | Secret key for signing tokens (keep this private)| Any long random string           |
| `JWT_EXPIRES_IN`  | How long login tokens last                       | `30d`                            |
| `ALLOWED_ORIGINS` | Frontend URLs allowed to call the API            | `https://your-app.vercel.app`    |

### Frontend (`frontend/.env`)

| Variable        | Description                    | Example                              |
|-----------------|--------------------------------|--------------------------------------|
| `VITE_API_URL`  | URL of your backend API        | `https://your-backend.onrender.com`  |

---

## How to Deploy Backend (Render)

1. Go to [https://render.com](https://render.com) and create a free account
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Set these settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add all environment variables from the table above
6. Click **Deploy**
7. Copy the URL Render gives you (e.g. `https://spraybot-api.onrender.com`)
8. Update `VITE_API_URL` in your frontend `.env` to this URL

---

## How to Deploy Frontend (Vercel)

1. Go to [https://vercel.com](https://vercel.com) and create a free account
2. Click **New Project** → Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL` = your Render backend URL
5. Click **Deploy**

---

## Mobile Support

This app is designed mobile-first for Android phones:

- Large touch-friendly buttons (minimum 44px height)
- Bottom navigation bar on mobile
- Responsive grid layouts that work on small screens
- No horizontal scrolling
- Readable font sizes
- Works in both portrait and landscape

---

## Production Ready

- Passwords are hashed with bcrypt (never stored as plain text)
- JWT tokens expire after 30 days
- Rate limiting prevents abuse (20 login attempts per 15 minutes)
- Helmet.js sets security headers
- CORS is configured to only allow your frontend
- Input validation on all API endpoints
- Centralized error handling
- MongoDB with Mongoose for reliable data storage

---

## API Endpoints

| Method | Endpoint                    | Auth Required | Description                    |
|--------|-----------------------------|---------------|--------------------------------|
| POST   | `/api/auth/register`        | No            | Create new account             |
| POST   | `/api/auth/login`           | No            | Login and get token            |
| GET    | `/api/auth/me`              | Yes           | Get current user               |
| GET    | `/api/profile`              | Yes           | Get farmer profile             |
| PUT    | `/api/profile`              | Yes           | Update farmer profile          |
| GET    | `/api/bots`                 | Yes           | Get your bots                  |
| POST   | `/api/bots`                 | Yes           | Register a bot                 |
| DELETE | `/api/bots/:botId`          | Yes           | Remove a bot                   |
| GET    | `/api/bots/available`       | Yes           | Find unclaimed bots            |
| POST   | `/api/telemetry`            | No (ESP32)    | ESP32 posts live data          |
| GET    | `/api/telemetry/:botId`     | Yes           | Get latest telemetry           |
| GET    | `/api/reports/:botId`       | Yes           | Get historical data            |
| POST   | `/api/help`                 | Yes           | Submit help request            |
| GET    | `/api/help`                 | Yes           | Get your help requests         |
| GET    | `/health`                   | No            | Check if server is running     |

---

*Built for real farmers. Designed for Android phones. Ready for production.*
