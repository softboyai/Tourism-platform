# Tourism Platform — Backend

Node.js + Express + MongoDB API for the Tourism Promotion Platform.

## Quick Start

```bash
npm install
cp .env.example .env    # Edit with your MongoDB URI
npm run seed            # Populate database with sample data
npm run dev             # Start server on port 5000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with auto-reload (development) |
| `npm start` | Start without auto-reload (production) |
| `npm run seed` | Seed database with sample sites, hotels, events, guides |

## Structure

```
src/
├── config/        # Database connection
├── models/        # Mongoose schemas (Site, Hotel, Event, Guide, Inquiry, Admin)
├── controllers/   # Route handlers
├── routes/        # API endpoint definitions
├── middleware/    # JWT auth, file upload (multer)
├── utils/         # Email service, seed utilities
└── uploads/       # Uploaded images (gitignored)
```

## Full Documentation

See the main [README.md](../README.md) in the project root for:
- Complete API endpoint list
- Feature explanations
- Deployment instructions
- Troubleshooting
