# Quick Run Guide

Run the Tourism Platform locally in a few steps.

## 1. Clone (if from GitHub)

```bash
git clone https://github.com/softboyai/Tourism-platform.git
cd Tourism-platform
```

## 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set MONGODB_URI (and optionally JWT_SECRET, ADMIN_SECRET)
npm run dev
```

Leave this terminal open. You should see: `Server is running on port 5000` and `MongoDB Connected`.

## 3. Create admin (once)

In a **new** terminal:

```bash
cd backend
node quick-create-admin.js
```

Default login: **admin@tourism-gabon.com** / **Admin123456**

## 4. Frontend

In another terminal:

```bash
cd frontend
python -m http.server 8000
```

Or: `npx http-server frontend -p 8000`

## 5. Open in browser

- **Website:** http://localhost:8000  
- **Admin:** http://localhost:8000/admin-login.html  
- **API health:** http://localhost:5000/health  

## Run both (Windows)

**Terminal 1 – Backend**
```powershell
cd backend
npm run dev
```

**Terminal 2 – Frontend**
```powershell
cd frontend
python -m http.server 8000
```

Then open: http://localhost:8000

## Troubleshooting

- **"Failed to fetch"** → Use a web server for frontend (step 4), not `file://`.
- **MongoDB error** → Start MongoDB or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and set `MONGODB_URI` in `.env`.
- **Port in use** → Change `PORT` in `.env` (e.g. 5001) and update `API_BASE_URL` in `frontend/js/api.js`.
