# 🔧 Troubleshooting Guide - Empty Dropdowns

## Quick Fix Steps

### Step 1: Open the Debug Tool
1. Open `debug.html` in your browser
2. Click "Test Providers API" button
3. Check what you see

### Step 2: Check Browser Console
1. Open DevTools (Press `F12` or right-click → Inspect)
2. Go to the **Console** tab
3. Look for errors or messages with emojis (🔍, ✅, ❌)

---

## Common Issues & Solutions

### Issue 1: CORS Error
**Symptoms:**
```
Access to fetch at 'https://svp.vg.no...' has been blocked by CORS policy
```

**What it means:** The browser is blocking API requests due to security restrictions.

**Solutions:**
1. **Use a CORS proxy** (temporary fix for testing)
2. **Run from a web server** instead of file:// protocol
3. **Use the fallback data** (already implemented in v2)

**To use a local web server:**
```bash
# If you have Python installed:
python -m http.server 8000

# Or Node.js:
npx http-server

# Then open: http://localhost:8000
```

---

### Issue 2: Network Error
**Symptoms:**
```
Failed to fetch
TypeError: NetworkError
```

**What it means:** Can't reach the API (firewall, VPN, or API is down).

**Solutions:**
1. Check your internet connection
2. Try disabling VPN temporarily
3. Test the API URL directly in browser
4. Use fallback data (v2 has hardcoded fallback providers and sports)

---

### Issue 3: Authentication Required
**Symptoms:**
```
Response Status: 401 or 403
```

**What it means:** The API requires authentication.

**Solution:**
The provider dropdown should still work with fallback data in v2. The sport types also have fallback data.

---

### Issue 4: API Changed Format
**Symptoms:**
```
Response Status: 200 but dropdowns still empty
```

**What it means:** The API response structure changed.

**Solution:**
1. Check the debug tool to see actual API response
2. Look at the data structure in the "Data:" section
3. We may need to update the code to match new structure

---

## What's Different in V2?

### ✅ Improved Error Handling
- Better console logging with emojis
- Shows exactly what's happening

### ✅ Fallback Data
**Providers:** Always shows VG, Aftonbladet, BT, Aftenbladet

**Sport Types:** Shows 10 common sports if API fails:
- Football
- Handball
- Hockey
- Basketball
- Athletics
- Skiing
- Tennis
- Golf
- Motorsport
- Cycling

### ✅ Debug Tool
New `debug.html` file tests each API endpoint individually

---

## Step-by-Step Debugging

### 1. Test API Access
Open this URL directly in your browser:
```
https://svp.vg.no/svp/api/v1/providers?appName=edm_antichurn
```

**Expected:** You should see JSON data like:
```json
{
  "_embedded": {
    "providers": [...]
  }
}
```

### 2. Check Console Logs
In `index.html`, open console (F12) and look for:

**Good signs:**
```
🔍 Fetching providers from API...
✅ Successfully fetched providers from API: 4
🎯 Populating provider dropdown...
➕ Added provider: VG (Verdens Gang)
✅ Provider dropdown populated with 4 providers
```

**Bad signs:**
```
❌ Error fetching providers: TypeError...
⚠️ Using fallback providers: 4 providers
```

### 3. Inspect HTML Elements
In DevTools Console, run:
```javascript
document.getElementById('provider-select').innerHTML
```

**Expected:** Should show `<option>` tags with providers

### 4. Test Manually
In DevTools Console, run:
```javascript
fetch('https://svp.vg.no/svp/api/v1/providers?appName=edm_antichurn')
  .then(r => r.json())
  .then(d => console.log(d))
```

This will show if fetch works at all.

---

## Working Without API

If the API is completely inaccessible, the v2 version will still work with:

### Provider Dropdown
✅ Shows: VG, Aftonbladet, BT, Aftenbladet (hardcoded)

### Sport Type Dropdown
✅ Shows: 10 common sports (hardcoded fallback)

### Teams/Categories Dropdowns
⚠️ Will be empty if API fails, but you can still:
- Use the filter options that don't need API (dates, limits, sort)
- Manually enter filter values if you know them

---

## Still Not Working?

### Share Debug Info
1. Open `debug.html`
2. Click all 4 test buttons
3. Take screenshots of results
4. Check browser console for errors
5. Share what you see

### Quick Workaround
If dropdowns are empty but you know the values:
1. Use the URL Generator directly
2. Manually type filter values you know
3. Or use the working example from your VG sports project

---

## Contact Info
If none of this helps, provide:
1. Browser name and version
2. Screenshots of debug.html results
3. Console errors from DevTools
4. Operating system

---

**The app should work even with API failures thanks to the fallback data! 🚀**
