# Connection Troubleshooting Guide

Your Render service is live but the frontend can't connect. Here's how to fix it.

## Current Status

✅ **Render service is running**  
❌ **Frontend can't connect to backend**  
❌ **404 errors on root endpoint**  

## Quick Fixes

### 1. Set Environment Variables in Render

Go to your Render service dashboard and add these environment variables:

```
FRONTEND_URL=https://insure-webapp-qpxym3zee-yashvchavan07-gmailcoms-projects.vercel.app
```

### 2. Set Environment Variables in Vercel

Go to your Vercel project settings and add:

```
NEXT_PUBLIC_CHATBOT_API_URL=https://your-chatbot-service.onrender.com/api/chat
NEXT_PUBLIC_VOICE_NAV_API_URL=https://your-voice-nav-service.onrender.com
```

**Replace `your-chatbot-service.onrender.com` with your actual Render URL.**

### 3. Redeploy Both Services

After setting environment variables:
1. **Redeploy Render service** (Manual Deploy → Deploy latest commit)
2. **Redeploy Vercel frontend** (should auto-deploy)

## Testing the Connection

### Test 1: Check Render Service

Visit your Render URL directly:
```
https://your-chatbot-service.onrender.com/
```

Expected response:
```json
{
  "message": "InsureEase Chatbot API",
  "status": "running",
  "endpoints": {
    "health": "/api/health",
    "chat": "/api/chat"
  }
}
```

### Test 2: Test Health Endpoint

```
https://your-chatbot-service.onrender.com/api/health
```

Expected response:
```json
{"status": "healthy"}
```

### Test 3: Test Chat Endpoint

Use curl or Postman:
```bash
curl -X POST https://your-chatbot-service.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is health insurance?"}'
```

## Debugging Steps

### Step 1: Check Browser Console

1. Open your Vercel app
2. Open Developer Tools (F12)
3. Go to Console tab
4. Try using the chatbot
5. Look for error messages

### Step 2: Check Network Tab

1. In Developer Tools, go to Network tab
2. Try using the chatbot
3. Look for failed requests
4. Check the request URL and response

### Step 3: Verify URLs

Make sure your environment variables have the correct URLs:

**In Vercel:**
```
NEXT_PUBLIC_CHATBOT_API_URL=https://your-actual-render-url.onrender.com/api/chat
```

**In Render:**
```
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
```

## Common Issues

### Issue 1: CORS Errors
**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution:**
- Check that `FRONTEND_URL` is set correctly in Render
- Redeploy Render service after setting environment variables

### Issue 2: 404 Errors
**Error:** `404 Not Found`

**Solution:**
- The updated `app.py` now has a root endpoint
- Redeploy Render service

### Issue 3: Network Errors
**Error:** `Failed to fetch`

**Solution:**
- Check if Render service is running
- Verify the URL in `NEXT_PUBLIC_CHATBOT_API_URL`
- Check Render logs for errors

### Issue 4: Environment Variables Not Loading
**Error:** `undefined` in console logs

**Solution:**
- Redeploy Vercel after setting environment variables
- Check that variable names are correct
- Variables starting with `NEXT_PUBLIC_` are available in browser

## Quick Test Script

Run this Python script to test your chatbot:

```python
import requests

# Replace with your actual Render URL
url = "https://your-chatbot-service.onrender.com"

# Test health
response = requests.get(f"{url}/api/health")
print(f"Health: {response.status_code} - {response.json()}")

# Test chat
response = requests.post(
    f"{url}/api/chat",
    json={"query": "What is health insurance?"},
    headers={"Content-Type": "application/json"}
)
print(f"Chat: {response.status_code} - {response.json()}")
```

## Expected Behavior

After fixing:

1. **Root endpoint** should return API info
2. **Health endpoint** should return `{"status": "healthy"}`
3. **Chat endpoint** should return responses
4. **Frontend** should connect without errors
5. **Chatbot** should respond to messages

## Still Having Issues?

1. **Check Render logs** for specific errors
2. **Verify all environment variables** are set
3. **Test endpoints individually** with curl/Postman
4. **Check browser console** for detailed error messages
5. **Ensure both services are redeployed** after changes

Let me know what specific error messages you see in the browser console! 