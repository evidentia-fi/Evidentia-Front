# 🚀 Git Push Guide - Evidentia Frontend v2

## Guide to Push Changes to Evidentia-Front Repository

This guide will help you push all the implemented changes to the [Evidentia-Front repository](https://github.com/evidentia-fi/Evidentia-Front) on a new branch called `v2`.

## 📋 Prerequisites

Before starting, ensure you have:

- **Git** installed and configured
- **GitHub account** with access to the repository
- **SSH key** or **Personal Access Token** set up
- **Repository access** to `evidentia-fi/Evidentia-Front`

## 🔧 Step-by-Step Process

### Step 1: Initialize Git Repository

```bash
# Navigate to your project directory
cd /Users/tech/Downloads/front-dev

# Initialize git repository (if not already initialized)
git init

# Check current git status
git status
```

### Step 2: Add Remote Repository

```bash
# Add the Evidentia-Front repository as remote origin
git remote add origin https://github.com/evidentia-fi/Evidentia-Front.git

# Verify remote is added
git remote -v
```

### Step 3: Create and Switch to v2 Branch

```bash
# Create and switch to v2 branch
git checkout -b v2

# Verify you're on the v2 branch
git branch
```

### Step 4: Add All Changes

```bash
# Add all files to staging
git add .

# Check what files are staged
git status
```

### Step 5: Create Initial Commit

```bash
# Create initial commit with descriptive message
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
```

### Step 6: Push to Remote Repository

```bash
# Push v2 branch to remote repository
git push -u origin v2

# If you get authentication error, you may need to use SSH or token
# For SSH (if you have SSH key set up):
git remote set-url origin git@github.com:evidentia-fi/Evidentia-Front.git
git push -u origin v2

# For HTTPS with token:
git remote set-url origin https://YOUR_TOKEN@github.com/evidentia-fi/Evidentia-Front.git
git push -u origin v2
```

## 🔐 Authentication Options

### Option 1: SSH Key (Recommended)

If you have SSH key set up:

```bash
# Set remote URL to SSH
git remote set-url origin git@github.com:evidentia-fi/Evidentia-Front.git

# Push to repository
git push -u origin v2
```

### Option 2: Personal Access Token

If using HTTPS with token:

```bash
# Set remote URL with token
git remote set-url origin https://YOUR_TOKEN@github.com/evidentia-fi/Evidentia-Front.git

# Push to repository
git push -u origin v2
```

### Option 3: GitHub CLI

If you have GitHub CLI installed:

```bash
# Authenticate with GitHub
gh auth login

# Push to repository
git push -u origin v2
```

## 📁 Files to Include in the Push

The following files and directories will be pushed:

### Core Application Files
```
apps/
├── app/                    # Main application with bridge functionality
├── web/                    # Web application (landing page)
├── mint/                   # Mint application (NFT minting)
└── app-sol/               # Solana application (may have issues)

packages/
├── ui/                     # UI components and modules
├── utils/                  # Utility functions and configuration
├── types/                  # TypeScript type definitions
├── i18n/                   # Internationalization files
├── eslint-config/          # ESLint configuration
└── typescript-config/      # TypeScript configuration
```

### Configuration Files
```
package.json                # Root package configuration
turbo.json                  # Turborepo configuration
pnpm-workspace.yaml         # PNPM workspace configuration
.env.local.example          # Environment variables example
```

### Build and Deployment Scripts
```
build-production.sh         # Production build script
quick-test.sh              # Quick local testing script
setup.sh                   # Setup script
test-bridge.sh             # Bridge testing script
```

### Documentation
```
README.md                  # Project documentation
DEPLOYMENT_GUIDE.md        # Deployment instructions
LOCAL_TESTING_GUIDE.md     # Local testing guide
QUICK_START.md             # Quick start guide
BUILD_SUMMARY.md           # Build summary
GIT_PUSH_GUIDE.md          # This guide
CHANGES_SUMMARY.md         # Summary of all changes
TERMINAL_GUIDE.md          # Terminal setup guide
```

### Assets
```
apps/app/public/icons/     # Custom icons (Base network icon)
```

## 🚨 Important Notes

### Files to Exclude

Make sure these files are in `.gitignore`:

```bash
# Check .gitignore file
cat .gitignore

# Should include:
node_modules/
.next/
.turbo/
.env.local
.env.production
dist/
build/
*.log
.DS_Store
```

### Environment Variables

**DO NOT** commit sensitive environment variables:

```bash
# These should NOT be committed:
# - .env.local files with actual API keys
# - Private keys
# - Database credentials
# - Production secrets

# Only commit:
# - .env.local.example
# - .env.example
```

## 🔍 Verification Steps

### Step 1: Check Repository Status

```bash
# Check git status
git status

# Check remote configuration
git remote -v

# Check current branch
git branch
```

### Step 2: Verify Files Are Staged

```bash
# Check staged files
git status

# Should show all your files as staged for commit
```

### Step 3: Review Commit

```bash
# Review what will be committed
git diff --cached

# Or check commit message
git log --oneline -1
```

## 🎯 After Successful Push

### Step 1: Verify on GitHub

1. Go to [Evidentia-Front repository](https://github.com/evidentia-fi/Evidentia-Front)
2. Check that `v2` branch exists
3. Verify all files are present
4. Check commit message and changes

### Step 2: Create Pull Request (Optional)

If you want to create a pull request:

1. Go to the repository on GitHub
2. Click "Compare & pull request" for the v2 branch
3. Add description of changes
4. Request review from team members

### Step 3: Notify Team

Share the following information with your team:

- **Branch**: `v2`
- **Repository**: `evidentia-fi/Evidentia-Front`
- **Key Features**: Base network integration, chart fixes, bridge functionality
- **Testing**: Use `LOCAL_TESTING_GUIDE.md` for testing instructions

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Authentication Failed

```bash
# Check your GitHub authentication
gh auth status

# Re-authenticate if needed
gh auth login
```

#### 2. Repository Not Found

```bash
# Verify repository URL
git remote -v

# Check if you have access to the repository
gh repo view evidentia-fi/Evidentia-Front
```

#### 3. Branch Already Exists

```bash
# If v2 branch already exists, switch to it
git checkout v2

# Pull latest changes
git pull origin v2

# Merge your changes
git merge main  # or whatever branch you're coming from
```

#### 4. Large File Issues

```bash
# Check for large files
find . -size +100M

# Add large files to .gitignore if needed
echo "large-file.zip" >> .gitignore
```

#### 5. Merge Conflicts

```bash
# If there are merge conflicts
git status

# Resolve conflicts in affected files
# Then add resolved files
git add .

# Complete the merge
git commit
```

## 📋 Pre-Push Checklist

Before pushing, ensure:

- [ ] All files are staged (`git add .`)
- [ ] Commit message is descriptive
- [ ] No sensitive data in commits
- [ ] `.gitignore` is properly configured
- [ ] Remote repository is correctly set
- [ ] You're on the `v2` branch
- [ ] All tests pass locally
- [ ] Documentation is complete

## 🚀 Quick Push Commands

For experienced users, here's the quick command sequence:

```bash
# Quick push sequence
cd /Users/tech/Downloads/front-dev
git init
git remote add origin https://github.com/evidentia-fi/Evidentia-Front.git
git checkout -b v2
git add .
git commit -m "feat: Implement v2 frontend with Base network integration and chart fixes"
git push -u origin v2
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your GitHub authentication
3. Ensure you have repository access
4. Check the repository URL is correct
5. Contact the development team for assistance

---

**Ready to push your v2 changes!** 🚀

This guide will help you successfully push all the implemented features to the Evidentia-Front repository on the v2 branch.
