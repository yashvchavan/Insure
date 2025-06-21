# InsureEase Deployment Guide

This guide will help you deploy the InsureEase application to various hosting platforms.

## Prerequisites

- Node.js 18+ installed
- Git repository set up
- Database (MongoDB) configured
- Required API keys and services set up

## Environment Variables

Copy `env.example` to `.env.local` and configure the following variables:

```bash
# Database Configuration
MONGODB_URI=your-mongodb-connection-string

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (Resend)
RESEND_API_KEY=your-resend-api-key-here

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay Configuration (for payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# NextAuth Configuration
NEXTAUTH_URL=your-production-url
NEXTAUTH_SECRET=your-nextauth-secret-here

# API Configuration
NEXT_PUBLIC_API_URL=your-production-api-url

# Development/Production
NODE_ENV=production
```

## Deployment Options

### 1. Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd Frontend_next
   vercel
   ```

3. **Configure Environment Variables:**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add all environment variables from `.env.local`

4. **Automatic Deployments:**
   - Connect your GitHub repository to Vercel
   - Every push to main branch will trigger automatic deployment

### 2. Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Drag and drop the `.next` folder to Netlify
   - Or connect your GitHub repository

3. **Configure redirects:**
   Create `_redirects` file in `public/`:
   ```
   /*    /index.html   200
   ```

### 3. Railway

1. **Connect Repository:**
   - Connect your GitHub repository to Railway
   - Railway will automatically detect Next.js

2. **Configure Environment Variables:**
   - Add all environment variables in Railway dashboard

3. **Deploy:**
   - Railway will automatically build and deploy

### 4. DigitalOcean App Platform

1. **Create App:**
   - Connect your GitHub repository
   - Select Node.js as the environment

2. **Configure Build Command:**
   ```
   npm run build
   ```

3. **Configure Run Command:**
   ```
   npm start
   ```

4. **Set Environment Variables:**
   - Add all required environment variables

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Cluster:**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster

2. **Configure Network Access:**
   - Add your IP address or `0.0.0.0/0` for all IPs

3. **Create Database User:**
   - Create a database user with read/write permissions

4. **Get Connection String:**
   - Copy the connection string and replace `<password>` with your user password

### Local MongoDB (Development)

```bash
# Install MongoDB locally
# Start MongoDB service
mongod

# Connection string
MONGODB_URI=mongodb://localhost:27017/insure-ease
```

## File Upload Setup (Cloudinary)

1. **Create Cloudinary Account:**
   - Sign up at [Cloudinary](https://cloudinary.com/)

2. **Get Credentials:**
   - Cloud Name
   - API Key
   - API Secret

3. **Configure Environment Variables:**
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

## Email Setup (Resend)

1. **Create Resend Account:**
   - Sign up at [Resend](https://resend.com/)

2. **Get API Key:**
   - Generate an API key from your dashboard

3. **Configure Environment Variable:**
   ```
   RESEND_API_KEY=your-resend-api-key-here
   ```

## Payment Setup (Razorpay)

1. **Create Razorpay Account:**
   - Sign up at [Razorpay](https://razorpay.com/)

2. **Get API Keys:**
   - Key ID
   - Key Secret

3. **Configure Environment Variables:**
   ```
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   ```

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connected and working
- [ ] File uploads working
- [ ] Email functionality tested
- [ ] Payment integration tested
- [ ] SSL certificate enabled
- [ ] Domain configured (if using custom domain)
- [ ] Error monitoring set up
- [ ] Performance monitoring configured

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version (should be 18+)
   - Ensure all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables:**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Restart deployment after adding variables

3. **Database Connection:**
   - Verify MongoDB connection string
   - Check network access settings
   - Ensure database user has correct permissions

4. **File Uploads:**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper CORS configuration

### Performance Optimization

1. **Enable Caching:**
   - Configure CDN for static assets
   - Enable browser caching
   - Use Redis for session storage

2. **Image Optimization:**
   - Use Next.js Image component
   - Configure Cloudinary transformations
   - Implement lazy loading

3. **Code Splitting:**
   - Next.js automatically handles code splitting
   - Use dynamic imports for large components

## Monitoring and Maintenance

1. **Error Tracking:**
   - Set up Sentry or similar error tracking
   - Monitor application logs

2. **Performance Monitoring:**
   - Use Vercel Analytics or similar
   - Monitor Core Web Vitals

3. **Regular Updates:**
   - Keep dependencies updated
   - Monitor security advisories
   - Regular database backups

## Support

For deployment issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Check application logs
4. Verify environment variables 