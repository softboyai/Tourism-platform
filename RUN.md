# ⚡ Quick Run Guide

Get the Tourism Platform running locally in under 5 minutes.

---

## Prerequisites

- **Node.js** v16+ → [nodejs.org](https://nodejs.org/)
- **MongoDB** running locally → [download](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (free cloud) → [atlas](https://www.mongodb.com/cloud/atlas/register)

---

## Setup

```bash
# 1. Clone
git clone https://github.com/softboyai/Tourism-platform.git
cd Tourism-platform/backend

# 2. Install dependencies
npm install

# 3. Create .env from template
cp .env.example .env
# Open .env and set your MONGODB_URI if needed

# 4. Start MongoDB (Windows local)
net start MongoDB

# 5. Seed database with sample data + admin account
npm run seed

# 6. Start server
npm run dev
```

Server starts at **http://localhost:5000**

---

## Pages

| Page | URL |
|------|-----|
| 🏠 Home | http://localhost:5000 |
| 🏝️ Tourist Sites | http://localhost:5000/sites.html |
| 🏨 Hotels | http://localhost:5000/hotels.html |
| 🎉 Events | http://localhost:5000/events.html |
| 🧑‍🏫 Tour Guides | http://localhost:5000/guides.html |
| 📩 Contact | http://localhost:5000/contact.html |
| 📋 My Bookings | http://localhost:5000/my-bookings.html |
| 🔐 Admin Login | http://localhost:5000/admin-login.html |
| ❤️ Favorites | http://localhost:5000/favorites.html |

---

## Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@tourism-gabon.com` |
| Password | `admin123` |

---

## How It Works

1. **Visitors** browse the site freely — no account needed
2. **Register / Login** to unlock booking features
3. **Book** hotels, events, or tour guides via the "Book Now" button
4. Track booking status in **My Bookings** (Pending → Confirmed / Cancelled)
5. **Admin** manages everything from the dashboard — content, bookings, messages, reports

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| MongoDB not connecting | `net start MongoDB` |
| Invalid admin password | `npm run seed` to reset |
| Token expired | Log in again |
| Port 5000 in use | Change `PORT` in `.env` |

---

See **README.md** for full documentation, API reference, and booking flow.
