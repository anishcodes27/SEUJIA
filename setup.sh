#!/bin/bash

# Seujia Honey - Local Development Setup Script
# This script sets up the project for local development

set -e  # Exit on error

echo "🍯 Seujia Honey - Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✓ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✓ Dependencies installed successfully"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and add your actual credentials:"
    echo "   - Supabase URL and keys"
    echo "   - Stripe keys"
    echo "   - Razorpay keys (optional)"
    echo "   - Admin password"
    echo ""
    echo "   See README.md for detailed setup instructions."
    echo ""
else
    echo "✓ .env.local already exists"
    echo ""
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p public/images
echo "✓ Directories created"
echo ""

echo "================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your credentials"
echo "2. Set up Supabase database (see docs/SUPABASE_SETUP.md)"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Visit http://localhost:3000"
echo ""
echo "For detailed instructions, see:"
echo "- README.md - Complete guide"
echo "- docs/SUPABASE_SETUP.md - Database setup"
echo "- DEPLOYMENT.md - Production deployment"
echo ""
echo "Happy coding! 🚀"
