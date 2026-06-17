# 🇬🇦 Tourism Promotion Platform — Ogooué-Maritime Province, Gabon

A full-stack web application for promoting tourism in the Ogooué-Maritime Province of Gabon. Visitors can register, log in, and book hotels, events, and tour guides. Admins manage all content and bookings through a dedicated dashboard.

---

## 📋 Features

### Visitor / User
| Feature | Description |
|---------|-------------|
| **Browse** | Tourist sites, hotels, events, tour guides with photos and contact info |
| **Register / Login** | Create a personal account to make bookings |
| **Book** | Request bookings for hotels, events, and tour guides |
| **My Bookings** | View all your booking requests and their status (Pending / Confirmed / Cancelled) |
| **Admin note** | See admin responses attached to your bookings |
| **Favorites** | Save sites and hotels to a local favorites list (no login needed) |
| **Contact** | Send a message to the admin via the contact form |

### Admin
| Feature | Description |
|---------|-------------|
| **Dashboard** | Manage all content from one panel |
| **CRUD** | Create, edit, delete tourist sites, hotels, events, tour guides |
| **Bookings** | View all booking requests, confirm or cancel them, add notes to users |
| **Inquiries** | Read visitor messages and reply (reply saved in database) |
| **Reports** | Daily / weekly statistics with PDF export |
| **Image upload** | Multiple images for sites and hotels, poster for events |

### Navigation logic
- **Not logged in** → Login and Register buttons visible, Admin link visible
- **Logged in as user** → username, My Bookings, Logout visible — Admin link hidden
- **Admin** accesses the platform via a separate login at `/admin-login.html`

---

## 🏗️ Architecture

```
Tourism-platform/
├── backend/                        # Node.js + Express API
│   ├── server.js                   # Entry point — registers all routes
│   ├── seed-data.js                # Seed script (sample data + admin account)
│   ├── .env.example                # Environment variables template
│   └── src/
│       ├── config/database.js      # MongoDB connection
│       ├── models/
│       │   ├── Admin.js            # Admin account
│       │   ├── User.js             # Visitor accounts (register/login)
│       │   ├── Booking.js          # Booking requests
│       │   ├── Site.js             # Tourist sites
│       │   ├── Hotel.js            # Hotels
│       │   ├── Event.js            # Events
│       │   ├── Guide.js            # Tour guides
│       │   └── Inquiry.js          # Contact messages
│       ├── controllers/
│       │   ├── userAuthController.js   # Register, login, profile
│       │   ├── bookingController.js    # Booking CRUD (user + admin)
│       │   ├── authController.js       # Admin login
│       │   ├── adminController.js      # Reports, seed
│       │   ├── siteController.js
│       │   ├── hotelController.js
│       │   ├── eventController.js
│       │   ├── guideController.js
│       │   └── inquiryController.js
│       ├── routes/
│       │   ├── userRoutes.js       # /api/auth/register, /api/auth/login
│       │   ├── bookingRoutes.js    # /api/bookings, /api/admin/bookings
│       │   ├── authRoutes.js       # /api/admin/login
│       │   ├── adminRoutes.js      # /api/admin/reports
│       │   ├── siteRoutes.js
│       │   ├── hotelRoutes.js
│       │   ├── eventRoutes.js
│       │   ├── guideRoutes.js
│       │   └── inquiryRoutes.js
│       ├── middleware/
│       │   ├── auth.js             # Admin JWT verification
│       │   ├── userAuth.js         # User JWT verification
│       │   └── uploadMiddleware.js # Multer file upload
│       └── utils/
│           ├── emailService.js     # SMTP email (optional)
│           ├── seedAdmin.js
│           └── upload.js
├── frontend/                       # Static HTML/CSS/JS (no framework)
│   ├── index.html                  # Homepage
│   ├── sites.html                  # Tourist sites listing
│   ├── site-details.html           # Single site detail
│   ├── hotels.html                 # Hotels listing + Book Now
│   ├── events.html                 # Events listing + Register/Book
│   ├── guides.html                 # Guides listing + Book Guide
│   ├── favorites.html              # Saved favorites (localStorage)
│   ├── contact.html                # Contact form
│   ├── register.html               # User registration
│   ├── login.html                  # User login
│   ├── my-bookings.html            # User bookings dashboard
│   ├── admin-login.html            # Admin login
│   ├── admin-dashboard.html        # Admin management panel
│   ├── css/styles.css              # All styles (original green + gold theme)
│   └── js/
│       ├── api.js                  # All API calls (admin + user)
│       ├── user-auth.js            # User session helpers + nav rendering
│       ├── register.js
│       ├── login.js
│       ├── my-bookings.js
│       ├── sites.js
│       ├── site-details.js
│       ├── hotels.js               # Includes booking modal
│       ├── events.js               # Includes booking modal
│       ├── guides.js               # Includes booking modal
│       ├── contact.js
│       ├── admin-dashboard.js      # Full CRUD + bookings + inquiries
│       └── admin-login.js
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT — separate tokens for users and admins |
| **File Upload** | Multer |
| **Email (optional)** | Nodemailer (SMTP) |
| **PDF Reports** | PDFKit |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript — no framework |

---

## 🚀 Setup & Run

### Prerequisites
- **Node.js** v16+ → [nodejs.org](https://nodejs.org/)
- **MongoDB** local or cloud:
  - Local: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud free tier: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

### Step 1 — Clone
```bash
git clone https://github.com/softboyai/Tourism-platform.git
cd Tourism-platform
```

### Step 2 — Install dependencies
```bash
cd backend
npm install
```

### Step 3 — Configure environment
```bash
cp .env.example .env
```
Edit `backend/.env` — at minimum set your MongoDB URI:
```env
MONGODB_URI=mongodb://localhost:27017/tourism-platform
JWT_SECRET=any-random-secret-string
```

### Step 4 — Start MongoDB (local)
```bash
# Windows
net start MongoDB
```

### Step 5 — Seed database
```bash
npm run seed
```
Creates sample data and the admin account:

| Field | Value |
|-------|-------|
| Admin email | `admin@tourism-gabon.com` |
| Admin password | `admin123` |

### Step 6 — Start server
```bash
npm run dev
```
You should see:
```
🚀 Server is running on port 5000
✅ MongoDB Connected: localhost
```

### Step 7 — Open browser
The server serves both the API and the frontend.

| Page | URL |
|------|-----|
| 🏠 Home | http://localhost:5000 |
| 🏝️ Sites | http://localhost:5000/sites.html |
| 🏨 Hotels | http://localhost:5000/hotels.html |
| 🎉 Events | http://localhost:5000/events.html |
| 🧑‍🏫 Guides | http://localhost:5000/guides.html |
| 📋 My Bookings | http://localhost:5000/my-bookings.html |
| 📩 Contact | http://localhost:5000/contact.html |
| 🔐 Admin | http://localhost:5000/admin-login.html |
| ❤️ Favorites | http://localhost:5000/favorites.html |

---

## 📡 API Reference

### Public endpoints (no auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sites` | All tourist sites (supports `?search=&category=&city=`) |
| GET | `/api/sites/:id` | Single site |
| GET | `/api/hotels` | All hotels |
| GET | `/api/hotels/:id` | Single hotel |
| GET | `/api/events` | All events |
| GET | `/api/events/:id` | Single event |
| GET | `/api/guides` | All guides |
| GET | `/api/guides/:id` | Single guide |
| POST | `/api/inquiries` | Submit contact message |
| POST | `/api/admin/login` | Admin login |

### User endpoints (JWT — user token required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get logged-in user profile |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/mine` | Get user's own bookings |
| PUT | `/api/bookings/:id/cancel` | Cancel own booking |

### Admin endpoints (JWT — admin token required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST/PUT/DELETE | `/api/sites/:id` | Manage sites |
| POST/PUT/DELETE | `/api/hotels/:id` | Manage hotels |
| POST/PUT/DELETE | `/api/events/:id` | Manage events |
| POST/PUT/DELETE | `/api/guides/:id` | Manage guides |
| GET | `/api/admin/inquiries` | View all messages |
| PUT | `/api/admin/inquiries/:id/reply` | Reply to a message |
| DELETE | `/api/admin/inquiries/:id` | Delete a message |
| GET | `/api/admin/bookings` | View all bookings |
| PUT | `/api/admin/bookings/:id/status` | Confirm/cancel + add note |
| DELETE | `/api/admin/bookings/:id` | Delete a booking |
| GET | `/api/admin/reports?type=daily` | Daily report |
| GET | `/api/admin/reports?type=weekly` | Weekly report |
| GET | `/api/admin/reports/pdf?type=daily` | PDF report download |

---

## 🔄 Booking Flow

```
User registers / logs in
        ↓
Browses hotels / events / guides
        ↓
Clicks "Book Now" / "Register" / "Book Guide"
        ↓
Fills booking form (date, guests, notes)
        ↓
Booking saved → status: PENDING
        ↓
Admin sees it in dashboard → Confirms or Cancels + adds a note
        ↓
User sees updated status + admin note in "My Bookings"
```

---

## 🔧 Troubleshooting

| Problem | Fix |
|---------|-----|
| MongoDB connection error | Start MongoDB: `net start MongoDB` |
| Invalid password at admin login | Run `npm run seed` to reset |
| Token expired | Log in again (tokens last 7 days) |
| Failed to fetch | Make sure backend is running on port 5000 |
| Port 5000 in use | Change `PORT` in `.env`, update `API_BASE_URL` in `frontend/js/api.js` |

---

## 📧 Email Setup (Optional)

The platform works fully without email. If you want admin replies to the contact form to also send an email to the visitor:

1. Enable Gmail 2-Step Verification at https://myaccount.google.com/security
2. Create an App Password at https://myaccount.google.com/apppasswords
3. Add to `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM="Gabon Tourism <your-email@gmail.com>"
```
4. Restart the server.

---

## 📦 npm Scripts

Run from the `backend/` folder:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with auto-reload (development) |
| `npm start` | Start without auto-reload (production) |
| `npm run seed` | Populate database with sample data |
