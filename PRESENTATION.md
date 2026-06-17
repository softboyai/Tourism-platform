# Tourism Promotion Platform - Project Presentation Guide
## Ogooué-Maritime Province, Gabon

---

## HOW TO RUN THE PROJECT

### Prerequisites
- Node.js installed (v18+)
- MongoDB installed and running locally

### Steps to Start
```
cd backend
npm install
npm run start:all
```
The browser will open automatically at: http://localhost:5000

### Admin Login Credentials
- **Email:** admin@tourism-gabon.com
- **Password:** c

If admin doesn't exist yet, open a second terminal and run:
```
cd backend
node quick-create-admin.js
```

---

## PROJECT OVERVIEW

### Problem Statement
Tourism information for the Ogooué-Maritime Province of Gabon is scattered across
different sources, making it difficult for tourists to plan visits. There is no
centralized platform for discovering tourist sites, hotels, events, and tour guides
in the region.

### Solution
A web-based Tourism Promotion Platform that:
- Centralizes all tourism information in one place
- Allows visitors to browse, search, and save favorite places
- Enables visitors to send inquiries about specific places
- Provides administrators with content management and reporting tools

### Target Users
1. **Tourists/Visitors** - Browse sites, save favorites, send inquiries
2. **Administrators** - Manage content, view inquiries, generate reports

---

## TECHNOLOGIES USED

| Component       | Technology        | Purpose                          |
|----------------|-------------------|----------------------------------|
| Frontend       | HTML, CSS, JS     | User interface                   |
| Backend        | Node.js + Express | REST API server                  |
| Database       | MongoDB + Mongoose| Data storage                     |
| Authentication | JWT + bcrypt      | Secure admin access              |
| PDF Generation | PDFKit            | Report export                    |
| File Upload    | Multer            | Image handling                   |

### Architecture: MVC Pattern
```
backend/
├── src/
│   ├── models/        ← Data structure (MongoDB schemas)
│   ├── controllers/   ← Business logic
│   ├── routes/        ← API endpoints
│   ├── middleware/    ← Auth verification
│   └── config/       ← Database connection
frontend/
├── index.html         ← Homepage
├── sites.html         ← Tourist sites listing
├── hotels.html        ← Hotels listing
├── favorites.html     ← User's saved places
├── contact.html       ← Contact form
├── admin-login.html   ← Admin authentication
├── admin-dashboard.html ← Admin panel
├── css/styles.css     ← Styling
└── js/                ← Page scripts + API helper
```

---

## FEATURES TO DEMONSTRATE

### A. Visitor Features (No login required)

#### 1. Browse Tourist Sites
- Go to "Tourist Sites" page
- Show filtering by category (beach, forest, museum, etc.)
- Show search by name
- Show filter by city

#### 2. View Site Details
- Click on any site card
- Show the detail page with images, description, location
- Show "View on Map" link (opens Google Maps)

#### 3. Add to Favorites
- On the sites page, click the "🤍 Favorite" button on any card
- It turns to "❤️ Saved"
- Go to the "❤️ Favorites" page in navigation
- Show the saved places appear there
- Explain: "Favorites are stored in the browser using localStorage"

#### 4. Contact About a Place
- From the Favorites page OR Site Details page, click "📩 Contact"
- Fill in name, email, and message
- Submit the form
- Show success message
- Explain: "This inquiry is now saved in MongoDB and visible to the admin"

#### 5. Browse Hotels
- Go to Hotels page
- Show hotel cards with phone numbers and WhatsApp links
- Click "🤍 Favorite" to save a hotel
- Show "📞 Call" button (clickable phone link)

#### 6. General Contact Form
- Go to Contact page
- Submit a general inquiry
- This also saves to the database

---

### B. Admin Features (Login required)

#### 1. Admin Login
- Go to Admin page (or navigate to admin-login.html)
- Login with: admin@tourism-gabon.com / c
- Explain: "Password is hashed with bcrypt, authentication uses JWT tokens"

#### 2. Reports Dashboard (First thing you see)
- Show the "📊 Reports" tab (default tab)
- Click "📅 Today" — shows today's activity
- Click "📆 This Week" — shows last 7 days
- Show the cards: new sites, hotels, events, guides, inquiries
- Click "📥 Download PDF" — download and open the PDF report
- Explain: "The report queries MongoDB using date filtering on createdAt fields"

#### 3. Manage Tourist Sites
- Click "Tourist Sites" in sidebar
- Click "+ Add New Site" — fill the form, upload an image
- Show the new site appears in the table
- Edit a site — show the form pre-fills
- Delete a site — confirm deletion

#### 4. Manage Hotels
- Same CRUD operations as sites
- Add a hotel with name, price range, phone, address

#### 5. Manage Events
- Add an event with title, date, venue, poster image

#### 6. Manage Tour Guides
- Add a guide with name, languages, fees, areas covered

#### 7. View Inquiries
- Click "Inquiries" in sidebar
- Show the inquiries submitted by visitors
- Point out the ones that say "[Inquiry about site: ...]" — these came from the favorites/contact feature

---

## LIVE DEMO FLOW (Recommended Order)

1. Open the site → Show homepage with stats
2. Browse tourist sites → Filter by category
3. Click a site → Show details
4. Add 2 sites to favorites → Show ❤️ button works
5. Go to Favorites page → Show saved places
6. Click "Contact" on a favorite → Send an inquiry
7. Login as admin → Show dashboard
8. Go to Reports → Show today's data
9. Download PDF → Open and show the report
10. Go to Inquiries → Show the inquiry you just sent appears here
11. Add a new site → Show it appears on the public page

---

## COMMON DEFENSE QUESTIONS & ANSWERS

**Q: Why did you choose MongoDB over MySQL?**
"Tourism data has varied structures. Sites have coordinates, hotels have price ranges,
guides have language arrays. MongoDB's flexible document schema handles this without
complex table joins. Each collection can have different fields naturally."

**Q: How is authentication implemented?**
"Admin login sends email/password to the API. The server verifies the password using
bcrypt comparison, then generates a JWT token valid for 24 hours. Every admin request
includes this token in the Authorization header. The auth middleware verifies it before
allowing access to protected routes."

**Q: How does the favorites system work?**
"It uses the browser's localStorage API. When a user clicks the heart button, the
place's data is saved as a JSON array in localStorage. No server request needed.
This means favorites persist across page refreshes but are specific to that browser."

**Q: How does the PDF report work?**
"When the admin clicks Download PDF, the frontend sends a GET request to
/api/admin/reports/pdf?type=daily. The server queries all collections using
MongoDB's date filtering ($gte operator on createdAt), counts records, fetches
recent inquiries, then uses PDFKit to generate a formatted PDF document that
streams directly to the browser as a file download."

**Q: What is REST API?**
"REST is an architectural style for web services. Each URL represents a resource.
GET /api/sites returns all sites. GET /api/sites/:id returns one site.
POST /api/sites creates a new site. PUT updates, DELETE removes.
All responses use consistent JSON format with status and data fields."

**Q: How would you improve this project?**
"I would add: user registration so favorites sync across devices, email notifications
when inquiries arrive, image optimization and cloud storage, Google Maps API for
interactive maps, multi-language support (French/English), and mobile app version."

**Q: What security measures are in place?**
"Passwords hashed with bcrypt (10 salt rounds), JWT token authentication,
CORS configuration, input validation on all models with Mongoose schema validators,
file upload restrictions with Multer (image types only, size limits)."

---

## DATABASE COLLECTIONS

| Collection | Key Fields                              | Purpose              |
|-----------|------------------------------------------|----------------------|
| admins    | email, passwordHash                      | Admin accounts       |
| sites     | name, category, description, city, location, images | Tourist places |
| hotels    | name, priceRange, phone, whatsapp, address, city | Accommodations |
| events    | title, date, venue, description, city    | Local events         |
| guides    | fullName, languages, fees, phone, areasCovered | Tour guides    |
| inquiries | name, email, message, createdAt          | User messages        |

All collections have `createdAt` timestamp — this enables the reporting feature.

---

## API ENDPOINTS

### Public (No auth required)
- GET /api/sites — List all sites (supports ?search, ?category, ?city)
- GET /api/sites/:id — Get site details
- GET /api/hotels — List all hotels
- GET /api/events — List all events
- GET /api/guides — List all guides
- POST /api/inquiries — Submit contact form

### Admin (JWT required)
- POST /api/admin/login — Login
- POST /api/sites — Create site
- PUT /api/sites/:id — Update site
- DELETE /api/sites/:id — Delete site
- (Same for hotels, events, guides)
- GET /api/admin/inquiries — View all inquiries
- GET /api/admin/reports?type=daily|weekly — Get report data
- GET /api/admin/reports/pdf?type=daily|weekly — Download PDF report

---

## FINAL TIPS

- Speak confidently about what each part does
- If you don't know an answer, say "That's something I'd research for the next version"
- Always relate back to the problem: "This helps tourists find information easily"
- Show the database in MongoDB Compass if asked to prove data is stored
- The PDF download is impressive — always demo it
