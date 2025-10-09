#!/bin/bash

# Bridge Application Test Script
echo "🧪 Testing Bridge Application Build..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if environment file exists
ENV_FILE="apps/app/.env.local"
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: Environment file not found at $ENV_FILE"
    echo "Please run ./setup-bridge.sh first"
    exit 1
fi

# Build the application
echo "🔨 Building the application..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 To start the development server:"
    echo "   pnpm dev:app"
    echo ""
    echo "🌐 Then open http://localhost:3000 in your browser"
    echo "📖 Navigate to /bridge to test the new functionality"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi


