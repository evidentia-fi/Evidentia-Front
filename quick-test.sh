#!/bin/bash

# Quick Local Testing Script
# This script helps you quickly start the frontend application for testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🧪 Frontend Application Quick Test Setup"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Check prerequisites
print_status "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install pnpm first."
    exit 1
fi

print_success "Prerequisites check passed"
print_status "Node.js version: $(node --version)"
print_status "pnpm version: $(pnpm --version)"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    pnpm install
    print_success "Dependencies installed"
else
    print_success "Dependencies already installed"
fi

# Check environment files
print_status "Checking environment configuration..."

if [ ! -f "apps/app/.env.local" ]; then
    print_warning "Environment file missing for app. Creating..."
    cat > apps/app/.env.local << 'EOF'
# Environment Configuration
NEXT_PUBLIC_ENV=testnet

# WalletConnect/Reown Project ID (REQUIRED - Get from https://cloud.reown.com/)
NEXT_PUBLIC_REOWN_PROJECT_ID=77de8a873af707573cd5ffeff64568a7

# Contract Addresses
NEXT_PUBLIC_TRON_ADDRESS=TK69h36Z5gjvLbkyfUW9aNjSPRL17jXy2W
NEXT_PUBLIC_BASE_ADDRESS=0xcb352448236F4A9E2bC56fa8f59851c6a5a34256

# GraphQL Endpoint
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.thegraph.com/subgraphs/name/your-subgraph

# Other Configuration
NEXT_PUBLIC_APP_NAME=Frontend App
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF
    print_success "Environment file created for app"
fi

if [ ! -f "apps/mint/.env.local" ]; then
    print_warning "Environment file missing for mint. Creating..."
    cp apps/app/.env.local apps/mint/.env.local
    print_success "Environment file created for mint"
fi

# Ask user what they want to do
echo ""
echo "What would you like to do?"
echo "1. Start all applications (recommended for testing)"
echo "2. Start only the main app (bridge functionality)"
echo "3. Start only the web app (landing page)"
echo "4. Start only the mint app (NFT minting)"
echo "5. Just check the setup (don't start anything)"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        print_status "Starting all applications..."
        print_status "This will start:"
        print_status "  - Main App: http://localhost:3000 (Bridge, Staking, Governance)"
        print_status "  - Web App: http://localhost:3001 (Landing page)"
        print_status "  - Mint App: http://localhost:3002 (NFT Minting)"
        print_status ""
        print_status "Press Ctrl+C to stop all applications"
        echo ""
        pnpm dev
        ;;
    2)
        print_status "Starting main app..."
        print_status "Main App will be available at: http://localhost:3000"
        print_status "Features: Bridge, Staking, Governance"
        print_status ""
        print_status "Press Ctrl+C to stop the application"
        echo ""
        cd apps/app && pnpm dev
        ;;
    3)
        print_status "Starting web app..."
        print_status "Web App will be available at: http://localhost:3001"
        print_status "Features: Landing page, Contact form"
        print_status ""
        print_status "Press Ctrl+C to stop the application"
        echo ""
        cd apps/web && pnpm dev
        ;;
    4)
        print_status "Starting mint app..."
        print_status "Mint App will be available at: http://localhost:3002"
        print_status "Features: NFT Minting"
        print_status ""
        print_status "Press Ctrl+C to stop the application"
        echo ""
        cd apps/mint && pnpm dev
        ;;
    5)
        print_success "Setup check complete!"
        print_status "Environment files: ✅"
        print_status "Dependencies: ✅"
        print_status "Configuration: ✅"
        echo ""
        print_status "To start applications manually:"
        print_status "  - All apps: pnpm dev"
        print_status "  - Main app: cd apps/app && pnpm dev"
        print_status "  - Web app: cd apps/web && pnpm dev"
        print_status "  - Mint app: cd apps/mint && pnpm dev"
        ;;
    *)
        print_error "Invalid choice. Please run the script again and choose 1-5."
        exit 1
        ;;
esac
