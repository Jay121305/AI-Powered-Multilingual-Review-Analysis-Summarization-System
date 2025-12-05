#!/bin/bash

# Setup script for AI Product Analyzer
echo "Installing dependencies for AI Product Analyzer..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "npm is not available. Please install npm."
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo

echo "Installing project dependencies..."
echo

# Install dependencies
npm install

if [ $? -ne 0 ]; then
    echo "Failed to install dependencies. Please check your internet connection."
    exit 1
fi

echo
echo "✅ Setup completed successfully!"
echo
echo "To run the project:"
echo "  npm run dev"
echo
echo "The app will be available at: http://localhost:3000"
echo