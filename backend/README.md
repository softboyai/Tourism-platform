# Tourism Platform Backend

Backend API for Tourism Promotion Platform of Gabon - Ogooué-Maritime Province.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong random string for JWT tokens
- `ADMIN_SECRET`: Secret key for admin registration
- `PORT`: Server port (default: 5000)

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 4. Test the Server

Visit `http://localhost:5000/health` in your browser or use curl:

```bash
curl http://localhost:5000/health
```

You should receive a JSON response:
```json
{
  "status": "success",
  "message": "Tourism Platform API is running",
  "timestamp": "2024-..."
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── models/          # Mongoose models
│   ├── routes/          # API route definitions
│   ├── controllers/     # Route handlers/controllers
│   ├── middleware/      # Custom middleware (auth, etc.)
│   ├── utils/           # Utility functions
│   └── uploads/         # Uploaded images (git-ignored)
├── server.js            # Main server file
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
└── package.json        # Dependencies and scripts
```

## Current Status

✅ Step 1 Complete: Basic Express server with health check endpoint

