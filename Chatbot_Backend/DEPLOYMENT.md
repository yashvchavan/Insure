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
flask==2.3.3
flask-cors==4.0.0
pandas==2.0.3
scikit-learn==1.3.0
numpy==1.24.3
gunicorn==21.2.0
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
pip install -r requirements.txt
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

**requirements.txt:**
```
flask==2.3.3
flask-cors==4.0.0
SpeechRecognition==3.10.0
gTTS==2.3.2
pydub==0.25.1
gunicorn==21.2.0
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

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly in Render
   - Check that your Vercel domain is included in allowed origins

2. **Service Not Starting**
   - Check the build logs in Render
   - Ensure all required files are in the repository
   - Verify the start command is correct

3. **Import Errors**
   - Make sure all dependencies are in `requirements.txt`
   - Check Python version compatibility

4. **File Not Found Errors**
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