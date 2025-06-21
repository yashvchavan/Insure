# Backend Services Deployment Guide (Render)

This guide will help you deploy the chatbot and voice navigation services to Render.

## Prerequisites

- Render account
- Git repository with your backend code
- Python 3.8+ support

## Service 1: Chatbot Service

### 1. Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your chatbot code

### 2. Configure the Service

**Name:** `insure-chatbot-service` (or your preferred name)

**Environment:** `Python 3`

**Build Command:**
```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn app:app --bind 0.0.0.0:$PORT
```

### 3. Environment Variables

Add these environment variables in Render:

```
FRONTEND_URL=https://your-vercel-app.vercel.app
PYTHON_VERSION=3.9
```

### 4. Files Required

Ensure these files are in your repository:

**requirements.txt:**
```
# Core Flask dependencies
flask==2.3.3
flask-cors==4.0.0
gunicorn==21.2.0

# Data processing - using older, more stable versions
numpy==1.21.6
pandas==1.3.5
scikit-learn==1.1.3

# HTTP requests
requests==2.28.2

# Additional dependencies for better compatibility
setuptools==65.5.1
wheel==0.38.4
```

**insurance_dataset.csv** - Your FAQ dataset

### 5. Deploy

Click "Create Web Service" and wait for deployment.

## Service 2: Voice Navigation Service

### 1. Create Another Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect the same GitHub repository
4. Select the repository containing your voice navigation code

### 2. Configure the Service

**Name:** `insure-voice-nav-service` (or your preferred name)

**Environment:** `Python 3`

**Build Command:**
```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements_voice.txt
```

**Start Command:**
```bash
gunicorn voice_nav_backend:app --bind 0.0.0.0:$PORT
```

### 3. Environment Variables

Add these environment variables in Render:

```
FRONTEND_URL=https://your-vercel-app.vercel.app
PYTHON_VERSION=3.9
```

### 4. Files Required

Ensure these files are in your repository:

**requirements_voice.txt:**
```
# Core Flask dependencies
flask==2.3.3
flask-cors==4.0.0
gunicorn==21.2.0

# Voice processing
SpeechRecognition==3.10.0
gTTS==2.3.2
pydub==0.25.1

# HTTP requests
requests==2.28.2

# Additional dependencies for better compatibility
setuptools==65.5.1
wheel==0.38.4
```

## Alternative Deployment Strategy (If scikit-learn fails)

If you continue to have issues with scikit-learn compilation, consider these alternatives:

### Option 1: Use Pre-built Docker Images

Create a `Dockerfile` for the chatbot service:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 5000

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]
```

### Option 2: Use Railway Instead of Render

Railway often has better compatibility with scikit-learn:

1. Go to [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Deploy as a web service
4. Set environment variables in Railway dashboard

### Option 3: Simplify Chatbot (Remove scikit-learn)

If scikit-learn continues to cause issues, you can create a simpler chatbot:

```python
# Simple keyword-based chatbot instead of ML-based
def find_best_match(user_query: str) -> Tuple[str, float]:
    """Simple keyword-based matching"""
    user_query = user_query.lower().strip()
    
    # Simple keyword matching
    keywords = {
        "policy": "You can view and manage your policies in the user dashboard.",
        "claim": "To file a claim, please visit the claims section.",
        "health": "We offer comprehensive health insurance policies.",
        "vehicle": "Our vehicle insurance covers cars, bikes, and commercial vehicles.",
        "home": "Protect your home with our comprehensive home insurance.",
        "travel": "Travel with peace of mind with our travel insurance.",
        "business": "We offer various business insurance solutions.",
        "premium": "Premium calculations are available in our calculator section.",
        "contact": "You can contact our support team at support@insure.com",
        "help": "I'm here to help! You can ask about policies, claims, or insurance types."
    }
    
    for keyword, response in keywords.items():
        if keyword in user_query:
            return response, 0.8
    
    return "I'm sorry, I don't have an answer for that. Please contact our support team.", 0.0
```

## Frontend Configuration

### 1. Set Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

```
NEXT_PUBLIC_CHATBOT_API_URL=https://your-chatbot-service.onrender.com/api/chat
NEXT_PUBLIC_VOICE_NAV_API_URL=https://your-voice-nav-service.onrender.com
```

### 2. Update Frontend Code

The frontend code should already be configured to use these environment variables.

## Testing the Deployment

### 1. Test Chatbot Service

Visit: `https://your-chatbot-service.onrender.com/api/health`

Expected response:
```json
{"status": "healthy"}
```

### 2. Test Voice Navigation Service

Visit: `https://your-voice-nav-service.onrender.com/health`

Expected response:
```json
{"status": "healthy", "service": "voice-navigation"}
```

### 3. Test Command Processing

Send a POST request to: `https://your-voice-nav-service.onrender.com/test-command`

Body:
```json
{
  "text": "policy"
}
```

Expected response:
```json
{
  "response": {
    "type": "navigation",
    "destination": "/user-dashboard",
    "message": "I'll take you to your policies"
  }
}
```

## Troubleshooting

### Common Issues

1. **scikit-learn Compilation Errors**
   - Use the updated requirements.txt with older versions
   - Try the alternative deployment strategies above
   - Consider using Railway instead of Render

2. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly in Render
   - Check that your Vercel domain is included in allowed origins

3. **Service Not Starting**
   - Check the build logs in Render
   - Ensure all required files are in the repository
   - Verify the start command is correct

4. **Import Errors**
   - Make sure all dependencies are in `requirements.txt`
   - Check Python version compatibility

5. **File Not Found Errors**
   - Ensure `insurance_dataset.csv` is in the repository
   - Check file paths in the code

### Debugging

1. **Check Render Logs**
   - Go to your service in Render dashboard
   - Click on "Logs" tab
   - Look for error messages

2. **Test Locally First**
   - Test the services locally before deploying
   - Use the same environment variables

3. **Health Check Endpoints**
   - Use the health check endpoints to verify services are running
   - Test with simple requests first

## Performance Optimization

### 1. Enable Auto-Scaling (Optional)

In Render, you can enable auto-scaling:
- Go to service settings
- Enable "Auto-Deploy"
- Set minimum and maximum instances

### 2. Environment Variables for Performance

```
PYTHONUNBUFFERED=1
FLASK_ENV=production
```

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to the repository
   - Use Render's environment variable feature

2. **CORS Configuration**
   - Only allow necessary origins
   - Use HTTPS in production

3. **Rate Limiting**
   - Consider adding rate limiting for production use
   - Monitor usage and costs

## Cost Optimization

1. **Free Tier Limits**
   - Render free tier has limitations
   - Services sleep after 15 minutes of inactivity
   - Consider paid plans for production use

2. **Resource Usage**
   - Monitor CPU and memory usage
   - Optimize code for better performance

## Support

If you encounter issues:

1. Check Render documentation
2. Review service logs
3. Test endpoints individually
4. Verify environment variables
5. Check CORS configuration
6. Try alternative deployment strategies if scikit-learn fails 