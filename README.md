# Tourism Promotion Platform - Ogooué-Maritime Province, Gabon

A complete web application for promoting tourism in Gabon's Ogooué-Maritime Province. Built with Node.js, Express, MongoDB, and Vanilla JavaScript.

**Repository:** [https://github.com/softboyai/Tourism-platform](https://github.com/softboyai/Tourism-platform)

## Features

### Public Website
- Browse tourist sites with search and filtering (category, city)
- View hotels and accommodations
- Check upcoming events
- Find tour guides
- Submit contact inquiries

### Admin Dashboard
- Secure admin authentication (JWT)
- CRUD operations for all resources:
  - Tourist Sites (with image upload)
  - Hotels (with image upload)
  - Events (with poster upload)
  - Tour Guides
- View and manage contact inquiries

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **Vanilla JavaScript** - Functionality
- **Fetch API** - HTTP requests

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth & upload middleware
│   │   ├── utils/          # Utility functions
│   │   └── uploads/        # Uploaded images
│   ├── server.js           # Main server file
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── css/
    │   └── styles.css      # Main stylesheet
    ├── js/
    │   ├── api.js          # API functions
    │   ├── index.js        # Homepage script
    │   ├── sites.js        # Sites page script
    │   └── ...
    ├── index.html          # Homepage
    ├── sites.html          # Sites listing
    └── ...
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/softboyai/Tourism-platform.git
   cd Tourism-platform
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   - Local: `mongod` (if installed locally)
   - Atlas: Use connection string in `.env`

5. **Create initial admin user**
   ```bash
   # Option 1: Use seed route (after server starts)
   curl -X POST http://localhost:5000/api/admin/seed \
     -H "Content-Type: application/json" \
     -d '{
       "secret": "your-admin-secret-key",
       "email": "admin@example.com",
       "password": "securepassword123"
     }'

   # Option 2: Use Node script
   node -e "require('./src/utils/seedAdmin')()"
   ```

6. **Start backend server**
   ```bash
   npm run dev  # Development with nodemon
   # or
   npm start    # Production
   ```

7. **Open frontend** (use a local server so API calls work)
   - **Recommended:** Use a local server so login and data load correctly:
     ```bash
     # Using Python
     cd frontend
     python -m http.server 8000
     
     # Using Node.js http-server
     npx http-server frontend -p 8000
     ```

8. **Access the application**
   - Frontend: `http://localhost:8000`
   - Backend API: `http://localhost:5000/api`
   - Health check: `http://localhost:5000/health`

## API Endpoints

### Public Endpoints
- `GET /api/sites` - Get all sites (with optional filters: search, category, city)
- `GET /api/sites/:id` - Get single site
- `GET /api/hotels` - Get all hotels
- `GET /api/events` - Get all events
- `GET /api/guides` - Get all guides
- `POST /api/inquiries` - Create inquiry

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `POST /api/sites` - Create site
- `PUT /api/sites/:id` - Update site
- `DELETE /api/sites/:id` - Delete site
- (Same pattern for hotels, events, guides)
- `GET /api/admin/inquiries` - Get all inquiries

## Configuration

### Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tourism-platform
JWT_SECRET=your-super-secret-jwt-key
ADMIN_SECRET=your-admin-registration-secret-key
UPLOAD_PATH=./src/uploads
```

## Development

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server (with nodemon)

### File Structure
- Models are in `backend/src/models/`
- Routes are in `backend/src/routes/`
- Controllers are in `backend/src/controllers/`
- Middleware is in `backend/src/middleware/`

## Testing

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed testing checklist and deployment instructions.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment guide for:
- Render/Railway (Backend)
- MongoDB Atlas (Database)
- Netlify/Vercel (Frontend)

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected admin routes
- File upload validation
- Input validation on all models

## License

This project is created for educational/tourism promotion purposes.

## Contact

For support or questions, please refer to the deployment documentation or create an issue.

---

**Built with ❤️ for Gabon Tourism**

