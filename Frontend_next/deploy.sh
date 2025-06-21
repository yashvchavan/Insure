#!/bin/bash

# InsureEase Deployment Script
# This script helps prepare and deploy the application

echo "🚀 InsureEase Deployment Script"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from env.example..."
    if [ -f "env.example" ]; then
        cp env.example .env.local
        echo "✅ Created .env.local from env.example"
        echo "⚠️  Please update .env.local with your actual values before deploying"
    else
        echo "❌ env.example not found. Please create .env.local manually"
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying"
    exit 1
fi

echo "✅ Build successful!"

# Check for common issues
echo "🔍 Checking for common issues..."

# Check if environment variables are set
if [ -f ".env.local" ]; then
    echo "✅ .env.local found"
else
    echo "⚠️  .env.local not found - make sure to set environment variables in your hosting platform"
fi

# Check for TypeScript errors
echo "🔍 Checking TypeScript..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ No TypeScript errors found"
else
    echo "⚠️  TypeScript errors found. Please fix them before deploying"
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Set up your hosting platform (Vercel, Netlify, Railway, etc.)"
echo "2. Configure environment variables in your hosting platform"
echo "3. Connect your repository or upload the built files"
echo "4. Deploy!"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md" 