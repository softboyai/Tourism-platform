# ⚡ Quick Run Guide

Fastest way to get the Tourism Platform running locally.

---

## Prerequisites

- **Node.js** v16+ installed → [nodejs.org](https://nodejs.org/)
- **MongoDB** running locally → [download](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud, free) → [atlas](https://www.mongodb.com/cloud/atlas/register)

---

## 5-Minute Setup

```bash
# 1. Clone
git clone https://github.com/softboyai/Tourism-platform.git
cd Tourism-platform

# 2. Install dependencies
cd backend
npm install

# 3. Create .env file
cp .env.example .env
# Edit .env → set your MONGODB_URI (and optionally SMTP for emails)

# 4. Make sure MongoDB is running
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Atlas: just set the URI in .env

# 5. Seed database with sample data
npm run seed

# 6. Start the server
npm run dev
```

---

## Open in Browser

| Page | URL |
|------|-----|
| 🏠 Homepage | http://localhost:5000 |
| 🏝️ Tourist Sites | http://localhost:5000/sites.html |
| 🏨 Hotels | http://localhost:5000/hotels.html |
| 🎉 Events | http://localhost:5000/events.html |
| 🧑‍🏫 Tour Guides | http://localhost:5000/guides.html |
| 📩 Contact | http://localhost:5000/contact.html |
| 🔐 Admin Login | http://localhost:5000/admin-login.html |

---

## Admin Login

| Field | Value |
|-------|-------|
| Email | `admin@tourism-gabon.com` |
| Password | `admin123` |

---

## Email Replies (Optional)

To enable email sending when admin replies to visitor messages, edit `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

**Gmail setup:** Google Account → Security → 2-Step Verification → App passwords → Create one.

Without SMTP configured, replies are saved in the database but not emailed.

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Cannot connect to MongoDB | Start MongoDB: `net start MongoDB` |
| Invalid password | Run `npm run seed` to reset admin |
| Token expired | Log in again (tokens last 7 days) |
| Port 5000 busy | Change `PORT` in `.env`, update `API_BASE_URL` in `frontend/js/api.js` |

---

## Project Summary

- **Backend:** Node.js + Express + MongoDB + JWT + Nodemailer
- **Frontend:** HTML + CSS + Vanilla JavaScript (no framework)
- **No user accounts** — the site is an information bridge only
- **Admin** manages all content via dashboard
- **Visitors** browse info and contact services directly via phone/email/WhatsApp shown on listings
- **Contact form** → admin replies → reply emailed to visitor

See `README.md` for full documentation.
