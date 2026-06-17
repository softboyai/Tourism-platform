# 🇬🇦 Tourism Promotion Platform — Ogooué-Maritime Province, Gabon

A full-stack web application for promoting tourism in the Ogooué-Maritime Province of Gabon. The platform serves as an **information bridge** connecting visitors with local tourist sites, hotels, events, and tour guides — without requiring user accounts or bookings.

## 📋 Project Overview

| Feature | Description |
|---------|-------------|
| **Tourist Sites** | Browse beaches, parks, museums, waterfalls with photos, contact info, and map links |
| **Hotels** | View hotels with prices, phone, WhatsApp, and address |
| **Events** | Upcoming events with dates, venues, organizer contacts |
| **Tour Guides** | Find guides with languages, fees, phone, and WhatsApp |
| **Contact System** | Visitors send messages → Admin replies → Reply sent to visitor's email |
| **Admin Dashboard** | Full CRUD management, reports (daily/weekly), PDF export |
| **Favorites** | Visitors can bookmark sites/hotels locally (no account needed) |

> **Important:** This platform is an information portal (bridge). There are no user accounts, no bookings, no payments. Visitors contact services directly via the phone/email/WhatsApp shown on each listing.

---

## 🏗️ Architecture

```
Tourism-platform/
├── backend/                  # Node.js + Express API server
│   ├── server.js             # Entry point
│   ├── seed-data.js          # Database seeding script
│   ├── .env.example          # Environment variables template
│   ├── src/
│   │   ├── config/           # Database connection
│   │   ├── models/           # Mongoose schemas (Site, Hotel, Event, Guide, Inquiry, Admin)
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # JWT auth, file upload
│   │   ├── utils/            # Email service, seed admin
│   │   └── uploads/          # Uploaded images (gitignored)
│   └── package.json
├── frontend/                 # Static HTML/CSS/JS (no framework)
│   ├── index.html            # Homepage
│   ├── sites.html            # Tourist sites listing
│   ├── site-details.html     # Single site details page
│   ├── hotels.html           # Hotels listing
│   ├── events.html           # Events listing
│   ├── guides.html           # Tour guides listing
│   ├── favorites.html        # Saved favorites (localStorage)
│   ├── contact.html          # Contact form
│   ├── admin-login.html      # Admin login page
│   ├── admin-dashboard.html  # Admin management panel
│   ├── css/styles.css        # All styles
│   ├── js/
│   │   ├── api.js            # API client (all fetch calls)
│   │   ├── sites.js          # Sites page logic
│   │   ├── site-details.js   # Site details page logic
│   │   ├── hotels.js         # Hotels page logic
│   │   ├── events.js         # Events page logic
│   │   ├── guides.js         # Guides page logic
│   │   ├── contact.js        # Contact form logic
│   │   ├── admin-login.js    # Admin login logic
│   │   └── admin-dashboard.js # Admin CRUD + reports
│   └── images/               # Static images
└── README.md                 # This file
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens) — admin only |
| **File Upload** | Multer |
| **Email** | Nodemailer (SMTP) |
| **PDF Reports** | PDFKit |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **No frameworks** | No React/Vue/Angular — pure HTML/JS |

---

## 🚀 Installation & Setup

### Prerequisites

1. **Node.js** (v16 or higher) — [Download](https://nodejs.org/)
2. **MongoDB** — either:
   - Local install: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
   - Or cloud: [MongoDB Atlas Free Tier](https://www.mongodb.com/cloud/atlas/register)
3. **Git** — [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/softboyai/Tourism-platform.git
cd Tourism-platform
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `backend/.env` with your settings:

```env
# Required — your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/tourism-platform

# Required — any random secret string for JWT tokens
JWT_SECRET=my-secret-key-for-jwt-tokens
```

> **Email is OPTIONAL for local use.** The project works fully without SMTP. Admin replies are saved in the database. If you want replies also emailed to visitors, see the "Email Setup" section below.

### Step 4: Start MongoDB

**Local MongoDB (Windows):**
```bash
net start MongoDB
```

**Or if using MongoDB Atlas:** just make sure your `MONGODB_URI` in `.env` points to your Atlas cluster.

### Step 5: Seed the Database (Sample Data)

```bash
cd backend
npm run seed
```

This creates:
- 1 admin account (`admin@tourism-gabon.com` / `admin123`)
- 8 tourist sites with contact info
- 7 hotels across different price ranges
- 6 events with organizer contacts
- 6 tour guides with phone/WhatsApp

### Step 6: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 Server is running on port 5000
✅ MongoDB Connected: localhost
```

### Step 7: Open in Browser

The backend serves both the API and the frontend:

| URL | What |
|-----|------|
| http://localhost:5000 | Homepage |
| http://localhost:5000/sites.html | Tourist Sites |
| http://localhost:5000/hotels.html | Hotels |
| http://localhost:5000/events.html | Events |
| http://localhost:5000/guides.html | Tour Guides |
| http://localhost:5000/contact.html | Contact Form |
| http://localhost:5000/admin-login.html | Admin Login |
| http://localhost:5000/health | API Health Check |

---

## 👤 Admin Credentials

After running `npm run seed`:

| Field | Value |
|-------|-------|
| **Email** | `admin@tourism-gabon.com` |
| **Password** | `admin123` |

---

## 📡 API Endpoints

### Public (No authentication required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sites` | Get all tourist sites (with search/filter) |
| GET | `/api/sites/:id` | Get single site details |
| GET | `/api/hotels` | Get all hotels |
| GET | `/api/hotels/:id` | Get single hotel |
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get single event |
| GET | `/api/guides` | Get all guides |
| GET | `/api/guides/:id` | Get single guide |
| POST | `/api/inquiries` | Submit a contact message |
| POST | `/api/admin/login` | Admin login (returns JWT) |

### Admin (JWT token required in `Authorization: Bearer <token>` header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sites` | Create a site (multipart/form-data) |
| PUT | `/api/sites/:id` | Update a site |
| DELETE | `/api/sites/:id` | Delete a site |
| POST | `/api/hotels` | Create a hotel (multipart/form-data) |
| PUT | `/api/hotels/:id` | Update a hotel |
| DELETE | `/api/hotels/:id` | Delete a hotel |
| POST | `/api/events` | Create an event (multipart/form-data) |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event |
| POST | `/api/guides` | Create a guide |
| PUT | `/api/guides/:id` | Update a guide |
| DELETE | `/api/guides/:id` | Delete a guide |
| GET | `/api/admin/inquiries` | Get all contact messages |
| PUT | `/api/admin/inquiries/:id/reply` | Reply to a message (sends email) |
| DELETE | `/api/admin/inquiries/:id` | Delete a message |
| GET | `/api/admin/reports?type=daily` | Get daily report |
| GET | `/api/admin/reports?type=weekly` | Get weekly report |
| GET | `/api/admin/reports/pdf?type=daily` | Download report as PDF |

---

## ✨ Key Features Explained

### 1. Contact & Reply System (No User Account)

- Visitor fills the contact form (name + email + message)
- Message is saved in the database
- Admin sees all messages in the dashboard with status (Pending/Replied)
- Admin clicks "Reply" → types a response
- The reply is **emailed directly to the visitor's email address**
- No user account or login needed for visitors

### 2. Information Bridge (No Booking)

The platform does NOT handle bookings or payments. It shows contact information for each service:
- **Sites** → phone, email, address
- **Hotels** → phone, WhatsApp, address
- **Events** → organizer name, phone, email
- **Guides** → phone, WhatsApp

Visitors contact them directly.

### 3. Admin Dashboard

- **Reports:** Daily/weekly statistics with PDF download
- **CRUD:** Create, Read, Update, Delete for all entities
- **Image Upload:** Multiple images for sites/hotels, poster for events
- **JWT Auth:** Token expires in 7 days, auto-redirect to login when expired

### 4. Favorites (Local Storage)

Visitors can "favorite" sites and hotels. Saved in the browser's localStorage — no account needed, but favorites are lost if browser data is cleared.

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| `MongoDB Connection Error` | Make sure MongoDB is running (`net start MongoDB`) or check your Atlas URI |
| `Token expired` | Log in again at `/admin-login.html` — tokens last 7 days |
| `Failed to fetch` | Make sure backend is running on port 5000 |
| `Invalid email or password` | Run `npm run seed` to reset admin credentials |
| `SMTP not configured` | This is normal for local use. Replies are saved but not emailed. |
| `Port 5000 in use` | Change `PORT` in `.env` and update `API_BASE_URL` in `frontend/js/api.js` |

---

## 📧 Email Setup (Optional — For Gmail)

**The project works 100% without email.** This is only needed if you want admin replies to actually reach the visitor's inbox.

### Step-by-step Gmail SMTP setup:

1. **Use or create a Gmail account** (e.g. `kamanzijeanmarievianney15@gmail.com`)

2. **Enable 2-Step Verification:**
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification" → Turn it ON
   - Follow the prompts (phone number verification)

3. **Create an App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - If you don't see this option, make sure 2-Step Verification is enabled
   - Select app: "Mail"
   - Select device: "Windows Computer"
   - Click "Generate"
   - Google gives you a **16-character password** (like `abcd efgh ijkl mnop`)

4. **Add to your `backend/.env`:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=kamanzijeanmarievianney15@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop
   SMTP_FROM="Gabon Tourism <kamanzijeanmarievianney15@gmail.com>"
   ```
   Replace the `SMTP_PASS` with your actual app password from step 3.

5. **Restart the server** (`npm run dev`) — now when admin replies, the visitor gets an email.

### Without email configured:
- Admin can still reply to messages
- Replies are saved in the database
- Admin dashboard shows the reply status
- But the visitor won't receive an email notification

---

## 📦 npm Scripts

Run these from the `backend/` folder:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with auto-reload (development) |
| `npm start` | Start server (production) |
| `npm run seed` | Populate database with sample data |

---

## 🌐 Deployment

For deployment (Render, Railway, VPS, etc.):

1. Set environment variables on your hosting platform
2. Use `npm start` (not `npm run dev`)
3. Set `MONGODB_URI` to your Atlas connection string
4. Update `API_BASE_URL` in `frontend/js/api.js` to your deployed URL
5. Configure SMTP for email replies

---

## 📝 License

Student project — Ogooué-Maritime Province Tourism Promotion Platform.
