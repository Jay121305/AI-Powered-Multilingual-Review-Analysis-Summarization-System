@echo off
echo Installing dependencies for AI Product Analyzer...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo npm is not available. Please install npm.
    pause
    exit /b 1
)

echo Node.js and npm are installed. Installing project dependencies...
echo.

REM Install dependencies
npm install

if errorlevel 1 (
    echo Failed to install dependencies. Please check your internet connection.
    pause
    exit /b 1
)

echo.
echo ✅ Setup completed successfully!
echo.
echo To run the project:
echo   npm run dev
echo.
echo The app will be available at: http://localhost:3000
echo.
pause