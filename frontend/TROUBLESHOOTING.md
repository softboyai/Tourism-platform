# Troubleshooting: "Failed to fetch" Error

## Problem
When trying to login, you get "Failed to fetch" error.

## Common Causes & Solutions

### 1. ✅ **Backend Server Not Running** (Most Common)

**Solution:** Make sure the backend server is running:

```powershell
cd "C:\Users\kamanzi\Desktop\TOURISM PLATFORM\backend"
npm run dev
```

You should see:
```
🚀 Server is running on port 5000
✅ MongoDB Connected: ...
```

---

### 2. ✅ **Opening HTML Files Directly (file:// protocol)**

**Problem:** Browsers block API requests when opening HTML files directly (file://)

**Solution:** Use a local web server instead of opening files directly:

#### Option A: Python HTTP Server (Recommended)
```powershell
cd "C:\Users\kamanzi\Desktop\TOURISM PLATFORM\frontend"
python -m http.server 8000
```
Then open: `http://localhost:8000/admin-login.html`

#### Option B: Node.js http-server
```powershell
# Install http-server globally (once)
npm install -g http-server

# Run server
cd "C:\Users\kamanzi\Desktop\TOURISM PLATFORM\frontend"
http-server -p 8000
```
Then open: `http://localhost:8000/admin-login.html`

#### Option C: VS Code Live Server
- Install "Live Server" extension in VS Code
- Right-click on `index.html` → "Open with Live Server"

---

### 3. ✅ **Backend Running on Wrong Port**

**Check:** Make sure backend is on port 5000

**Test:** Open in browser: `http://localhost:5000/health`

You should see:
```json
{
  "status": "success",
  "message": "Tourism Platform API is running"
}
```

If it doesn't work, check your `.env` file:
```env
PORT=5000
```

---

### 4. ✅ **CORS Issues**

**Solution:** Already enabled in `server.js`:
```javascript
app.use(cors()); // Enable CORS for frontend requests
```

If you still have issues, check the browser console (F12) for CORS errors.

---

### 5. ✅ **Firewall Blocking Connection**

**Solution:** Allow Node.js through Windows Firewall:
- Windows Security → Firewall & network protection
- Allow an app through firewall
- Check "Node.js"

---

## Quick Test Steps

1. **Check backend is running:**
   ```powershell
   # Should show server running message
   # If not, start it:
   cd backend
   npm run dev
   ```

2. **Test API endpoint:**
   - Open browser: `http://localhost:5000/health`
   - Should show JSON response

3. **Use a web server for frontend:**
   ```powershell
   cd frontend
   python -m http.server 8000
   ```

4. **Open login page:**
   - Go to: `http://localhost:8000/admin-login.html`
   - NOT: `file:///C:/Users/.../admin-login.html`

5. **Check browser console (F12):**
   - Look for any error messages
   - Check Network tab for failed requests

---

## Complete Setup Example

```powershell
# Terminal 1: Backend Server
cd "C:\Users\kamanzi\Desktop\TOURISM PLATFORM\backend"
npm run dev

# Terminal 2: Frontend Server
cd "C:\Users\kamanzi\Desktop\TOURISM PLATFORM\frontend"
python -m http.server 8000

# Then open in browser:
# http://localhost:8000/admin-login.html
```

---

## Still Not Working?

1. Check both servers are running
2. Check browser console (F12) for errors
3. Verify API URL in `frontend/js/api.js` is `http://localhost:5000/api`
4. Try testing API directly: `http://localhost:5000/api/admin/login` (will fail but shows if API is reachable)

---

**Most common fix: Use a web server instead of opening HTML files directly!** 🎯

