#!/bin/bash

# Simple push script for Evidentia-Front v2
# This script will help you push with proper authentication

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

echo "🚀 Simple Push to Evidentia-Front v2"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
print_status "Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "v2" ]; then
    print_error "You're not on the v2 branch. Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Set up HTTPS remote
print_status "Setting up HTTPS remote..."
git remote set-url origin https://github.com/evidentia-fi/Evidentia-Front.git

# Configure credential helper
print_status "Configuring credential helper..."
git config --global credential.helper osxkeychain

print_status "Ready to push to: https://github.com/evidentia-fi/Evidentia-Front"
print_status "Branch: v2"
echo ""

print_warning "You'll be prompted for GitHub credentials:"
print_status "Username: Your GitHub username"
print_status "Password: Your GitHub Personal Access Token (NOT your password)"
echo ""

print_status "If you don't have a Personal Access Token:"
print_status "1. Go to: https://github.com/settings/tokens"
print_status "2. Click 'Generate new token' → 'Generate new token (classic)'"
print_status "3. Select 'repo' scope"
print_status "4. Copy the token and use it as your password"
echo ""

read -p "Press Enter to continue with the push..."
echo ""

# Attempt to push
print_status "Pushing to repository..."
if git push -u origin v2; then
    print_success "🎉 Successfully pushed to Evidentia-Front v2 branch!"
    echo ""
    print_status "Next steps:"
    print_status "1. Visit: https://github.com/evidentia-fi/Evidentia-Front"
    print_status "2. Check the v2 branch"
    print_status "3. Create a pull request if needed"
    print_status "4. Notify your team about the changes"
    echo ""
    print_success "Your v2 frontend with Base network integration is now live!"
else
    print_error "Push failed. This might be due to:"
    print_error "1. Incorrect credentials"
    print_error "2. No access to the repository"
    print_error "3. Network issues"
    echo ""
    print_status "Troubleshooting:"
    print_status "1. Make sure you're using a Personal Access Token as password"
    print_status "2. Verify you have access to evidentia-fi/Evidentia-Front"
    print_status "3. Check your internet connection"
    print_status "4. Try again with: git push -u origin v2"
    exit 1
fi
