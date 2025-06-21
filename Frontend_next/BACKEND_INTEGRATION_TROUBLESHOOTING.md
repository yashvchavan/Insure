# Backend Integration Troubleshooting Guide

This guide helps you fix issues with your Vercel frontend communicating with Render backend services.

## Common Issues & Solutions

### 1. "Failed to process" Error

**Symptoms:**
- Frontend shows "Failed to process" error
- Backend services are deployed but not responding
- CORS errors in browser console

**Causes:**
- Incorrect API URLs
- CORS configuration issues
- Backend services not running
- Environment variables not set

### 2. CORS Errors

**Error Messages:**
```
Access to fetch at 'https://your-service.onrender.com' from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

**Solutions:**

1. **Check Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add these variables:
   ```
   NEXT_PUBLIC_CHATBOT_API_URL=https://your-chatbot-service.onrender.com/api/chat
   NEXT_PUBLIC_VOICE_NAV_API_URL=https://your-voice-nav-service.onrender.com
   ```

2. **Check Environment Variables in Render:**
   - Go to Render Dashboard → Your Service → Environment
   - Add this variable:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

3. **Redeploy Services:**
   - After changing environment variables, redeploy both services
   - In Render: Click "Manual Deploy" → "Deploy latest commit"

### 3. Backend Services Not Responding

**Check Service Status:**

1. **Test Chatbot Service:**
   ```
   https://your-chatbot-service.onrender.com/api/health
   ```
   Expected: `{"status": "healthy"}`

2. **Test Voice Navigation Service:**
   ```
   https://your-voice-nav-service.onrender.com/health
   ```
   Expected: `{"status": "healthy", "service": "voice-navigation"}`

**If Services Are Down:**

1. **Check Render Logs:**
   - Go to Render Dashboard → Your Service → Logs
   - Look for error messages

2. **Common Issues:**
   - Missing `requirements.txt`
   - Incorrect start command
   - Missing files (like `insurance_dataset.csv`)

### 4. Environment Variable Issues

**Debug Environment Variables:**

1. **Check Frontend Variables:**
   Add this to your frontend to debug:
   ```javascript
   console.log('Chatbot URL:', process.env.NEXT_PUBLIC_CHATBOT_API_URL);
   console.log('Voice Nav URL:', process.env.NEXT_PUBLIC_VOICE_NAV_API_URL);
   ```

2. **Check Backend Variables:**
   Add this to your backend:
   ```python
   print(f"Frontend URL: {os.environ.get('FRONTEND_URL')}")
   ```

### 5. Network Issues

**Test API Calls:**

1. **Test Chatbot API:**
   ```bash
   curl -X POST https://your-chatbot-service.onrender.com/api/chat \
     -H "Content-Type: application/json" \
     -d '{"query": "hello"}'
   ```

2. **Test Voice Navigation API:**
   ```bash
   curl -X POST https://your-voice-nav-service.onrender.com/test-command \
     -H "Content-Type: application/json" \
     -d '{"text": "policy"}'
   ```

### 6. Render Service Sleep Issues

**Problem:**
- Render free tier services sleep after 15 minutes
- First request after sleep takes 30-60 seconds

**Solutions:**

1. **Upgrade to Paid Plan:**
   - Paid plans don't sleep
   - Better performance

2. **Use External Monitoring:**
   - Set up uptime monitoring
   - Services like UptimeRobot can ping your services

3. **Optimize for Cold Starts:**
   - Keep services lightweight
   - Use efficient startup commands

## Step-by-Step Debugging

### Step 1: Verify Backend Services

1. **Check if services are running:**
   - Visit health check URLs
   - Check Render dashboard status

2. **Test basic functionality:**
   - Use curl or Postman to test APIs
   - Verify responses are correct

### Step 2: Check Frontend Configuration

1. **Verify environment variables:**
   - Check Vercel environment variables
   - Ensure URLs are correct

2. **Test API calls:**
   - Open browser developer tools
   - Check Network tab for failed requests
   - Look for CORS errors

### Step 3: Fix CORS Issues

1. **Update backend CORS:**
   - Ensure frontend URL is in allowed origins
   - Check CORS configuration in backend code

2. **Redeploy services:**
   - After CORS changes, redeploy both services
   - Clear browser cache

### Step 4: Test Integration

1. **Test chatbot:**
   - Try sending a message
   - Check browser console for errors

2. **Test voice navigation:**
   - Try voice commands
   - Verify navigation works

## Quick Fixes

### Fix 1: Update Environment Variables

In Vercel, set these environment variables:
```
NEXT_PUBLIC_CHATBOT_API_URL=https://your-chatbot-service.onrender.com/api/chat
NEXT_PUBLIC_VOICE_NAV_API_URL=https://your-voice-nav-service.onrender.com
```

### Fix 2: Update Backend CORS

Ensure your backend allows your Vercel domain:
```python
allowed_origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://your-app.vercel.app"
]
```

### Fix 3: Check Service URLs

Verify your Render service URLs are correct:
- Chatbot: `https://your-chatbot-service.onrender.com`
- Voice Nav: `https://your-voice-nav-service.onrender.com`

## Testing Checklist

- [ ] Backend services are running (health checks pass)
- [ ] Environment variables are set correctly
- [ ] CORS is configured properly
- [ ] API endpoints respond correctly
- [ ] Frontend can make requests
- [ ] No console errors in browser
- [ ] Chatbot messages work
- [ ] Voice navigation works

## Common Error Messages

### "Failed to fetch"
- Check if backend service is running
- Verify API URL is correct
- Check network connectivity

### "CORS policy blocked"
- Update CORS configuration in backend
- Ensure frontend URL is in allowed origins
- Redeploy backend services

### "Service unavailable"
- Check Render service status
- Look at service logs
- Verify start command is correct

### "Environment variable not found"
- Check Vercel environment variables
- Ensure variable names are correct
- Redeploy frontend after changes

## Still Having Issues?

1. **Check Render Logs:**
   - Go to service logs in Render dashboard
   - Look for specific error messages

2. **Test Locally:**
   - Test services locally first
   - Use same environment variables

3. **Use Browser Developer Tools:**
   - Check Network tab for failed requests
   - Look at Console for error messages

4. **Contact Support:**
   - Check Render documentation
   - Review Vercel deployment logs 