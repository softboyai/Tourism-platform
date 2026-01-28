# Quick Start Guide

## 🔧 Setting Up Environment Variables

The `.env` file has been created for you! It contains default settings for local development.

### Current Configuration
- **MongoDB URI**: `mongodb://localhost:27017/tourism-platform` (Local MongoDB)
- **Port**: `5000`
- **JWT Secret**: Default (change in production!)

## 📋 Next Steps

### Option 1: Use Local MongoDB (Recommended for Development)

1. **Install MongoDB locally** (if not installed):
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB via Docker

2. **Start MongoDB service**:
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # Or manually start mongod
   mongod --dbpath "C:\data\db"
   ```

3. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```

### Option 2: Use MongoDB Atlas (Cloud - Free)

1. **Create MongoDB Atlas account**:
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free tier

2. **Create a cluster**:
   - Click "Build a Database"
   - Choose free tier (M0)
   - Select a region
   - Create cluster

3. **Create database user**:
   - Go to "Database Access"
   - Add new database user
   - Remember username and password

4. **Whitelist IP**:
   - Go to "Network Access"
   - Add IP address: `0.0.0.0/0` (allows all IPs) OR your specific IP

5. **Get connection string**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string

6. **Update `.env` file**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tourism-platform
   ```
   Replace `username` and `password` with your database user credentials.

7. **Start the server**:
   ```bash
   cd backend
   npm run dev
   ```

## ✅ Verify Setup

After starting the server, you should see:
```
🚀 Server is running on port 5000
📍 Health check: http://localhost:5000/health
✅ MongoDB Connected: localhost:27017
```

## 🔐 Create Admin User

Once the server is running, create an admin user:

```bash
# Using curl (PowerShell)
curl -X POST http://localhost:5000/api/admin/seed `
  -H "Content-Type: application/json" `
  -d '{\"secret\": \"admin-registration-secret-key-change-in-production\", \"email\": \"admin@example.com\", \"password\": \"admin123\"}'
```

Or use the Node.js script:
```bash
cd backend
node -e "require('./src/utils/seedAdmin')()"
```

## 🚀 Access the Application

- **Frontend**: Open `frontend/index.html` in your browser
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/health`
- **Admin Login**: Open `frontend/admin-login.html`

## 📝 Troubleshooting

### MongoDB Connection Error
- **Problem**: `MongoDB Connection Error: The uri parameter to openUri() must be a string`
- **Solution**: Check that `.env` file exists and `MONGODB_URI` is set correctly

### Port Already in Use
- **Problem**: `Port 5000 already in use`
- **Solution**: Change `PORT` in `.env` to a different port (e.g., `5001`)

### MongoDB Not Running (Local)
- **Problem**: Cannot connect to MongoDB
- **Solution**: 
  - Ensure MongoDB service is running: `net start MongoDB`
  - Or start mongod manually
  - Or switch to MongoDB Atlas (cloud)

## 🔒 Security Note

⚠️ **Important**: The default secrets in `.env` are for development only!
For production, generate strong random secrets:
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate ADMIN_SECRET  
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

**You're all set! Start the server and begin building your tourism platform! 🎉**

