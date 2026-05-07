# 🌿 SprayBot Monitor

A real-time IoT dashboard for pesticide spraying bots (ESP32 + ThingSpeak).  
Supports **English / हिन्दी / తెలుగు** with live data, demo mode, and full bot management.

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express, MongoDB, JWT |
| IoT Data | ThingSpeak API (ESP32) |
| Charts | Recharts |

---

## 📱 Features

- Live ThingSpeak data — distance, area, pesticide, tank level
- Demo mode — works without a real bot connected
- 3 languages — English, हिन्दी, తెలుగు
- Manual bot connect with ThingSpeak Channel ID + Read API Key
- Reports — demo always visible, live data when bot is connected
- Dark / Light theme toggle
- Mobile responsive with bottom navigation

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

## 🔑 Environment Variables

**Backend** (`backend/.env`):

| Key | Description |
|-----|-------------|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry e.g. `30d` |
| `ALLOWED_ORIGINS` | Comma-separated allowed frontend URLs |

**Frontend** (`frontend/.env`):

| Key | Description |
|-----|-------------|
| `VITE_API_URL` | Backend API URL |

---

## 📡 ThingSpeak Field Mapping

Your ESP32 should send data to ThingSpeak with these fields:

| Field | Data |
|-------|------|
| field1 | Tank level (%) |
| field2 | Distance traveled (m) |
| field3 | Area covered (acres) |
| field4 | Pesticide sprayed (L) |
| field5 | Operating time (min) |
