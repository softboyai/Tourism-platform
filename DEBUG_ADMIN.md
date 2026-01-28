# Debugging Admin Dashboard Issues

## Problem: Items Added But Not Showing

If you're adding items successfully but they don't appear:

### Step 1: Check Browser Console (F12)
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try adding an item again
4. Look for any error messages (red text)

### Step 2: Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try adding an item
4. Look for the API request (should be `/api/sites`, `/api/hotels`, etc.)
5. Click on it and check:
   - **Status**: Should be 201 (created) or 200 (updated)
   - **Response**: Should show `{"status": "success", ...}`
   - If status is 400 or 500, check the error message

### Step 3: Check Backend Console
Look at your backend server terminal. You should see:
- Any error messages
- "Create site error:" if something failed
- Database connection status

### Step 4: Verify Data in Database
If using MongoDB locally, you can check:
```javascript
// In MongoDB shell or Compass
use tourism-platform
db.sites.find()
db.hotels.find()
db.events.find()
db.guides.find()
```

### Step 5: Common Issues

#### Issue 1: Location Field Error
**Error**: "Invalid location format" or "location.lat is required"
**Fix**: Make sure you enter valid numbers for Latitude and Longitude

#### Issue 2: Missing Required Fields
**Error**: "Name, category, description, city, and location are required"
**Fix**: Fill in ALL required fields (marked with *)

#### Issue 3: Authentication Error
**Error**: "Access denied" or "Invalid token"
**Fix**: 
- Logout and login again
- Check that token is in localStorage (F12 → Application → Local Storage)

#### Issue 4: CORS Error
**Error**: "Failed to fetch" or CORS error
**Fix**: 
- Make sure backend is running
- Make sure you're using a web server (not file://)
- Check API_BASE_URL in `frontend/js/api.js`

### Step 6: Test API Directly

Test if the API is working:

```powershell
# Test GET sites
curl http://localhost:5000/api/sites

# Test POST site (replace token with your actual token)
curl -X POST http://localhost:5000/api/sites `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{"name":"Test Site","category":"beach","description":"Test","city":"Port-Gentil","location":{"lat":-0.7,"lng":8.8}}'
```

### Step 7: Clear and Retry

1. **Clear browser cache**: Ctrl+Shift+Delete
2. **Hard refresh**: Ctrl+F5
3. **Clear localStorage**: F12 → Application → Local Storage → Clear
4. **Logout and login again**

### Step 8: Check File Uploads

If uploading images:
- Check `backend/src/uploads/` folder exists
- Check file permissions
- Check file size (max 5MB)
- Check file type (only images: jpg, png, gif, webp)

## Quick Fix Checklist

- [ ] Backend server is running (`npm run dev`)
- [ ] MongoDB is connected (check backend console)
- [ ] Using web server for frontend (not file://)
- [ ] All required fields filled in
- [ ] Valid coordinates (numbers, not text)
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls (201/200 status)
- [ ] Token is valid (try logout/login)

## Still Not Working?

1. Check backend logs for detailed error messages
2. Check browser console for JavaScript errors
3. Verify API endpoint is correct: `http://localhost:5000/api`
4. Test with a simple item (no images first)
5. Try different browser (Chrome, Firefox, Edge)

---

**Most Common Fix**: Make sure you're using a web server (http://localhost:8000) not opening files directly (file://)!

