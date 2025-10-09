#!/bin/bash

# Git Push Script for Evidentia-Front v2
# This script automates pushing changes to the Evidentia-Front repository

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

echo "🚀 Evidentia-Front v2 Git Push Script"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Repository configuration
REPO_URL="https://github.com/evidentia-fi/Evidentia-Front.git"
BRANCH_NAME="v2"

print_status "Repository: $REPO_URL"
print_status "Branch: $BRANCH_NAME"

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    print_status "Initializing git repository..."
    git init
    print_success "Git repository initialized"
else
    print_success "Git repository already initialized"
fi

# Add remote origin
print_status "Setting up remote repository..."
if git remote get-url origin &> /dev/null; then
    CURRENT_URL=$(git remote get-url origin)
    if [ "$CURRENT_URL" != "$REPO_URL" ]; then
        print_warning "Remote origin already exists with different URL: $CURRENT_URL"
        read -p "Do you want to update it to $REPO_URL? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git remote set-url origin "$REPO_URL"
            print_success "Remote origin updated"
        else
            print_error "Please update remote origin manually or use a different approach"
            exit 1
        fi
    else
        print_success "Remote origin already configured correctly"
    fi
else
    git remote add origin "$REPO_URL"
    print_success "Remote origin added"
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")

# Create and switch to v2 branch
if [ "$CURRENT_BRANCH" != "$BRANCH_NAME" ]; then
    print_status "Creating and switching to $BRANCH_NAME branch..."
    git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"
    print_success "Switched to $BRANCH_NAME branch"
else
    print_success "Already on $BRANCH_NAME branch"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_status "Staging all changes..."
    git add .
    print_success "All changes staged"
    
    # Create commit
    print_status "Creating commit..."
    git commit -m "feat: Implement v2 frontend with Base network integration

- Add Base network support with proper icon integration
- Update Tron contract address to TK69h36Z5gjvLbkyfUW9aNjSPRL17jXy2W
- Fix chart date formatting (Jun 01, Jun 15 instead of Jun, Jun, Jun)
- Implement comprehensive bridge functionality (Ethereum ↔ Tron ↔ Base)
- Add wallet connection improvements with address validation
- Implement auto-population for EVM-to-EVM bridges
- Add Base network icon with fallback support
- Update environment configuration with Reown Project ID
- Add comprehensive build and deployment scripts
- Include detailed testing and deployment guides

Features:
✅ Multi-network bridge support
✅ Fixed chart date display
✅ Base network icon integration
✅ Wallet connection improvements
✅ Address validation and auto-population
✅ Production-ready builds
✅ Comprehensive documentation"
    
    print_success "Commit created successfully"
else
    print_warning "No changes to commit"
fi

# Check if we can push
print_status "Checking repository access..."
if git ls-remote origin &> /dev/null; then
    print_success "Repository access confirmed"
else
    print_error "Cannot access repository. Please check:"
    print_error "1. Repository URL is correct"
    print_error "2. You have access to the repository"
    print_error "3. Your GitHub authentication is set up"
    exit 1
fi

# Push to remote repository
print_status "Pushing to remote repository..."
if git push -u origin "$BRANCH_NAME"; then
    print_success "Successfully pushed to $REPO_URL on branch $BRANCH_NAME"
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
    print_status "1. Check your GitHub authentication: gh auth status"
    print_status "2. Try using SSH instead of HTTPS"
    print_status "3. Check if you have write access to the repository"
    print_status "4. Verify the repository URL is correct"
    exit 1
fi
