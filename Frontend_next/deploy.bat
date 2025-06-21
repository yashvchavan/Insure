@echo off
echo 🚀 InsureEase Deployment Script
echo ================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% LSS 18 (
    echo ❌ Node.js version 18+ is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚠️  .env.local not found. Creating from env.example...
    if exist "env.example" (
        copy env.example .env.local >nul
        echo ✅ Created .env.local from env.example
        echo ⚠️  Please update .env.local with your actual values before deploying
    ) else (
        echo ❌ env.example not found. Please create .env.local manually
    )
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Build the project
echo 🔨 Building the project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix the errors before deploying
    pause
    exit /b 1
)

echo ✅ Build successful!

REM Check for common issues
echo 🔍 Checking for common issues...

REM Check if environment variables are set
if exist ".env.local" (
    echo ✅ .env.local found
) else (
    echo ⚠️  .env.local not found - make sure to set environment variables in your hosting platform
)

REM Check for TypeScript errors
echo 🔍 Checking TypeScript...
call npx tsc --noEmit

if %errorlevel% equ 0 (
    echo ✅ No TypeScript errors found
) else (
    echo ⚠️  TypeScript errors found. Please fix them before deploying
)

echo.
echo 🎉 Deployment preparation complete!
echo.
echo Next steps:
echo 1. Set up your hosting platform (Vercel, Netlify, Railway, etc.)
echo 2. Configure environment variables in your hosting platform
echo 3. Connect your repository or upload the built files
echo 4. Deploy!
echo.
echo For detailed instructions, see DEPLOYMENT.md
pause 