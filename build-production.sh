#!/bin/bash

# Frontend Application Production Build Script
# This script builds all working applications in the monorepo

set -e  # Exit on any error

echo "🚀 Starting Frontend Application Production Build"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install pnpm first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "pnpm version: $(pnpm --version)"

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf apps/*/.next
rm -rf .turbo
print_success "Build cache cleaned"

# Install dependencies
print_status "Installing dependencies..."
pnpm install
print_success "Dependencies installed"

# Build packages first
print_status "Building shared packages..."
pnpm build --filter=@workspace/eslint-config
pnpm build --filter=@workspace/i18n
pnpm build --filter=@workspace/types
pnpm build --filter=@workspace/typescript-config
pnpm build --filter=@workspace/ui
pnpm build --filter=@workspace/utils
print_success "Shared packages built"

# Build applications
print_status "Building applications..."

# Build main app (with bridge functionality)
print_status "Building main app (app)..."
if pnpm build --filter=app; then
    print_success "Main app built successfully"
else
    print_error "Failed to build main app"
    exit 1
fi

# Build web app
print_status "Building web app..."
if pnpm build --filter=web; then
    print_success "Web app built successfully"
else
    print_error "Failed to build web app"
    exit 1
fi

# Build mint app
print_status "Building mint app..."
if pnpm build --filter=mint; then
    print_success "Mint app built successfully"
else
    print_error "Failed to build mint app"
    exit 1
fi

# Skip app-sol due to TypeScript issues
print_warning "Skipping app-sol due to TypeScript compatibility issues"

# Create build summary
print_status "Creating build summary..."

BUILD_DIR="build-production-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BUILD_DIR"

# Copy built applications
cp -r apps/app/.next "$BUILD_DIR/app"
cp -r apps/web/.next "$BUILD_DIR/web"
cp -r apps/mint/.next "$BUILD_DIR/mint"

# Copy package.json files for reference
cp apps/app/package.json "$BUILD_DIR/app/"
cp apps/web/package.json "$BUILD_DIR/web/"
cp apps/mint/package.json "$BUILD_DIR/mint/"

# Create build info
cat > "$BUILD_DIR/build-info.txt" << EOF
Frontend Application Production Build
====================================

Build Date: $(date)
Node.js Version: $(node --version)
pnpm Version: $(pnpm --version)

Built Applications:
- app: Main application with bridge functionality
- web: Web application
- mint: Mint application

Skipped Applications:
- app-sol: TypeScript compatibility issues

Build Features:
✅ Base network integration
✅ Updated Tron contract address
✅ Fixed chart date formatting
✅ Base network icon support
✅ Bridge functionality (Ethereum ↔ Tron ↔ Base)
✅ Wallet connection improvements
✅ Address validation and auto-population

Environment Configuration:
- NEXT_PUBLIC_ENV=testnet
- NEXT_PUBLIC_REOWN_PROJECT_ID=77de8a873af707573cd5ffeff64568a7
- NEXT_PUBLIC_TRON_ADDRESS=TK69h36Z5gjvLbkyfUW9aNjSPRL17jXy2W
- NEXT_PUBLIC_BASE_ADDRESS=0xcb352448236F4A9E2bC56fa8f59851c6a5a34256

Deployment Instructions:
1. Each app can be deployed independently
2. Use 'pnpm start' in each app directory to run locally
3. For production deployment, use the .next folders
4. Ensure environment variables are set in production

EOF

# Create deployment script
cat > "$BUILD_DIR/deploy.sh" << 'EOF'
#!/bin/bash

# Deployment script for built applications
# Usage: ./deploy.sh [app-name]

APP_NAME=${1:-"app"}

if [ ! -d "$APP_NAME" ]; then
    echo "Error: App directory '$APP_NAME' not found"
    echo "Available apps: app, web, mint"
    exit 1
fi

echo "Deploying $APP_NAME..."

cd "$APP_NAME"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found in $APP_NAME"
    exit 1
fi

# Install production dependencies
echo "Installing production dependencies..."
npm install --production

# Start the application
echo "Starting $APP_NAME..."
npm start

EOF

chmod +x "$BUILD_DIR/deploy.sh"

print_success "Build completed successfully!"
print_status "Build artifacts saved to: $BUILD_DIR"
print_status ""
print_status "To deploy an application:"
print_status "  cd $BUILD_DIR"
print_status "  ./deploy.sh [app-name]"
print_status ""
print_status "Available applications:"
print_status "  - app (main application with bridge)"
print_status "  - web (web application)"
print_status "  - mint (mint application)"
print_status ""
print_status "Build summary saved to: $BUILD_DIR/build-info.txt"

echo ""
echo "🎉 Frontend Application Build Complete!"
echo "======================================"
