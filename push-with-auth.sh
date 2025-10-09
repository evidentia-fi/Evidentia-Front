#!/bin/bash

# Simple push script with authentication prompt
# This script will help you push to GitHub with proper authentication

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

echo "🚀 GitHub Push with Authentication"
echo "================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Check git status
print_status "Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Please commit them first."
    git status
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
print_status "Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "v2" ]; then
    print_warning "You're not on the v2 branch. Current branch: $CURRENT_BRANCH"
    read -p "Do you want to switch to v2 branch? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout v2
        print_success "Switched to v2 branch"
    else
        print_error "Please switch to v2 branch manually"
        exit 1
    fi
fi

# Check remote configuration
print_status "Checking remote configuration..."
REMOTE_URL=$(git remote get-url origin)
print_status "Remote URL: $REMOTE_URL"

# Provide authentication options
echo ""
echo "Choose authentication method:"
echo "1. SSH (if you have SSH key added to GitHub)"
echo "2. HTTPS with Personal Access Token"
echo "3. HTTPS with Username/Password (not recommended)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        print_status "Using SSH authentication..."
        git remote set-url origin git@github.com:evidentia-fi/Evidentia-Front.git
        print_status "Testing SSH connection..."
        if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
            print_success "SSH authentication successful"
        else
            print_error "SSH authentication failed"
            print_status "Your SSH public key:"
            cat ~/.ssh/id_ed25519.pub
            print_status ""
            print_status "Please add this key to your GitHub account:"
            print_status "1. Go to https://github.com/settings/keys"
            print_status "2. Click 'New SSH key'"
            print_status "3. Paste the key above"
            print_status "4. Run this script again"
            exit 1
        fi
        ;;
    2)
        print_status "Using HTTPS with Personal Access Token..."
        git remote set-url origin https://github.com/evidentia-fi/Evidentia-Front.git
        print_status "You'll be prompted for credentials when pushing"
        print_status "Use your GitHub username and Personal Access Token as password"
        ;;
    3)
        print_status "Using HTTPS with Username/Password..."
        git remote set-url origin https://github.com/evidentia-fi/Evidentia-Front.git
        print_warning "Username/Password authentication is deprecated"
        print_status "You'll be prompted for credentials when pushing"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Attempt to push
print_status "Attempting to push to repository..."
if git push -u origin v2; then
    print_success "Successfully pushed to https://github.com/evidentia-fi/Evidentia-Front on branch v2"
    echo ""
    print_status "Next steps:"
    print_status "1. Visit: https://github.com/evidentia-fi/Evidentia-Front"
    print_status "2. Check the v2 branch"
    print_status "3. Create a pull request if needed"
    print_status "4. Notify your team about the changes"
    echo ""
    print_success "🎉 Push completed successfully!"
else
    print_error "Failed to push to repository"
    print_error "This might be due to:"
    print_error "1. Authentication issues"
    print_error "2. Repository access permissions"
    print_error "3. Network connectivity"
    print_error "4. Branch conflicts"
    echo ""
    print_status "Troubleshooting options:"
    print_status "1. Check your GitHub authentication"
    print_status "2. Verify you have write access to the repository"
    print_status "3. Check your internet connection"
    print_status "4. Try creating a Personal Access Token:"
    print_status "   - Go to https://github.com/settings/tokens"
    print_status "   - Generate new token with repo permissions"
    print_status "   - Use token as password when prompted"
    exit 1
fi
