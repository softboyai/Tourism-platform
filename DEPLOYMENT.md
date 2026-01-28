# Deployment Guide - Tourism Platform

## Testing Checklist

### Backend Testing

#### 1. Server Health Check
- [ ] Server starts without errors
- [ ] Health endpoint `/health` returns success
- [ ] MongoDB connection successful

#### 2. Database Models
- [ ] Admin model creates successfully
- [ ] Site model creates with validation
- [ ] Hotel model creates with validation
- [ ] Event model creates with validation
- [ ] Guide model creates with validation
- [ ] Inquiry model creates with validation

#### 3. Authentication
- [ ] Admin registration/seed works
- [ ] Admin login returns JWT token
- [ ] Protected routes require valid token
- [ ] Invalid token returns 401

#### 4. Public API Endpoints
- [ ] `GET /api/sites` returns sites
- [ ] `GET /api/sites?search=term` filters by search
- [ ] `GET /api/sites?category=beach` filters by category
- [ ] `GET /api/sites?city=Port-Gentil` filters by city
- [ ] `GET /api/sites/:id` returns single site
- [ ] `GET /api/hotels` returns hotels
- [ ] `GET /api/events` returns events
- [ ] `GET /api/guides` returns guides
- [ ] `POST /api/inquiries` creates inquiry

#### 5. Admin CRUD Operations
- [ ] Create site with images (protected)
- [ ] Update site (protected)
- [ ] Delete site (protected)
- [ ] Create hotel with images (protected)
- [ ] Update hotel (protected)
- [ ] Delete hotel (protected)
- [ ] Create event with poster (protected)
- [ ] Update event (protected)
- [ ] Delete event (protected)
- [ ] Create guide (protected)
- [ ] Update guide (protected)
- [ ] Delete guide (protected)
- [ ] `GET /api/admin/inquiries` returns inquiries (protected)

#### 6. Image Upload
- [ ] Multiple images upload for sites
- [ ] Multiple images upload for hotels
- [ ] Single poster image upload for events
- [ ] Images are accessible via `/uploads/:filename`
- [ ] Invalid file types are rejected
- [ ] File size limit enforced (5MB)

### Frontend Testing

#### 1. Public Pages
- [ ] Homepage loads and displays stats
- [ ] Sites page displays sites
- [ ] Site filters (search, category, city) work
- [ ] Site details page displays correctly
- [ ] Hotels page displays hotels
- [ ] Events page displays events
- [ ] Guides page displays guides
- [ ] Contact form submits inquiry

#### 2. Admin Dashboard
- [ ] Login page works
- [ ] Invalid credentials show error
- [ ] Valid login redirects to dashboard
- [ ] Dashboard displays all tabs
- [ ] Sites CRUD operations work
- [ ] Hotels CRUD operations work
- [ ] Events CRUD operations work
- [ ] Guides CRUD operations work
- [ ] Inquiries are displayed
- [ ] Logout clears token and redirects

## Security Checklist

### Authentication & Authorization
- [x] Passwords are hashed using bcrypt
- [x] JWT tokens expire after 7 days
- [x] Admin routes are protected with middleware
- [x] Token validation on every protected request
- [ ] Rate limiting on login endpoint (recommended)
- [ ] Strong JWT_SECRET in production

### Data Validation
- [x] Input validation on all models
- [x] Required fields enforced
- [x] Email format validation
- [x] File type validation for uploads
- [x] File size limits enforced
- [ ] Sanitize user inputs (XSS prevention)

### API Security
- [x] CORS enabled for frontend domain
- [ ] Environment variables for sensitive data
- [ ] No sensitive data in error messages
- [ ] Proper error handling (no stack traces in production)

### File Upload Security
- [x] File type validation (images only)
- [x] File size limits
- [ ] Virus scanning (recommended for production)
- [ ] Unique filenames to prevent overwrites

## Deployment Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Git installed
- Domain/URL for frontend

### Backend Deployment (Render/Railway)

#### Option 1: Render.com

1. **Create Render Account**
   - Go to https://render.com
   - Sign up/login

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Settings:
     - **Name**: tourism-platform-backend
     - **Runtime**: Node
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
     - **Environment**: Node 18

3. **Set Environment Variables**
   ```
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tourism-platform
   JWT_SECRET=your-strong-random-secret-key-here
   ADMIN_SECRET=your-admin-registration-secret
   UPLOAD_PATH=./src/uploads
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment

#### Option 2: Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up/login

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure Service**
   - Select `backend` folder as root
   - Add environment variables (same as Render)

4. **Deploy**
   - Railway auto-detects Node.js
   - Deployment happens automatically

### MongoDB Atlas Setup

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose free tier (M0)
   - Select region
   - Create cluster

3. **Create Database User**
   - Go to "Database Access"
   - Add new database user
   - Note username and password

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Add IP address (0.0.0.0/0 for all, or specific IPs)

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Use this as `MONGODB_URI` in environment variables

### Frontend Deployment (Netlify/Vercel)

#### Option 1: Netlify

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up/login

2. **Deploy Site**
   - Click "Add new site" → "Import an existing project"
   - Connect Git repository
   - Settings:
     - **Base directory**: `frontend`
     - **Build command**: (leave empty, static site)
     - **Publish directory**: `frontend`

3. **Update API URL**
   - Edit `frontend/js/api.js`
   - Change `API_BASE_URL` to your backend URL:
     ```javascript
     const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
     ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment

#### Option 2: Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up/login

2. **Import Project**
   - Click "New Project"
   - Import Git repository
   - Settings:
     - **Root Directory**: `frontend`
     - **Framework Preset**: Other

3. **Update API URL** (same as Netlify)

4. **Deploy**
   - Click "Deploy"

### Post-Deployment Steps

1. **Create Initial Admin**
   ```bash
   # Using seed route (recommended)
   curl -X POST https://your-backend-url.com/api/admin/seed \
     -H "Content-Type: application/json" \
     -d '{
       "secret": "your-admin-secret-key",
       "email": "admin@tourism-gabon.com",
       "password": "your-secure-password"
     }'
   ```

   Or use the Node.js script:
   ```bash
   cd backend
   node -e "require('./src/utils/seedAdmin')()"
   ```

2. **Verify Uploads Directory**
   - Ensure `backend/src/uploads` exists on server
   - Check file permissions (read/write)

3. **Test All Endpoints**
   - Run through testing checklist
   - Verify images are accessible
   - Test admin login

4. **Update CORS Settings**
   - In `backend/server.js`, update CORS if needed:
     ```javascript
     app.use(cors({
       origin: 'https://your-frontend-url.com'
     }));
     ```

### Environment Variables Reference

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=generate-strong-random-string-here
ADMIN_SECRET=generate-strong-random-string-here
UPLOAD_PATH=./src/uploads
```

#### Generate Secure Secrets
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate ADMIN_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Check MongoDB URI is correct
- Verify IP whitelist includes server IP
- Check database user credentials

**Upload Errors**
- Ensure uploads directory exists and is writable
- Check file permissions
- Verify file size limits

**JWT Token Errors**
- Verify JWT_SECRET is set
- Check token expiration
- Ensure token is sent in Authorization header

### Frontend Issues

**API Requests Fail**
- Check API_BASE_URL is correct
- Verify CORS settings on backend
- Check browser console for errors

**Images Not Loading**
- Verify image paths are correct
- Check uploads directory is served statically
- Ensure backend URL is accessible

## Production Recommendations

1. **Enable HTTPS**
   - Use SSL certificates (Let's Encrypt free)
   - Update API URLs to use HTTPS

2. **Add Rate Limiting**
   - Use express-rate-limit
   - Protect login and API endpoints

3. **Implement Logging**
   - Use Winston or similar
   - Log errors and important events

4. **Backup Database**
   - Set up automated MongoDB backups
   - Test restore procedures

5. **Monitor Performance**
   - Use tools like New Relic or Datadog
   - Monitor API response times

6. **Security Headers**
   - Add helmet.js for security headers
   - Implement CSRF protection

7. **Image Optimization**
   - Compress images before upload
   - Use CDN for image delivery

## Support

For issues or questions:
1. Check error logs
2. Review API responses
3. Verify environment variables
4. Test locally first

---

**Deployment Complete! 🎉**

Your Tourism Platform should now be live and accessible to users.

