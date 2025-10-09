# 🧪 Local Testing Guide

## Step-by-Step Guide to Run Frontend Application Locally

This guide will walk you through running the frontend application locally to test all the implemented features.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js**: Version 18+ (recommended: 20+)
- **pnpm**: Package manager
- **Git**: Version control

### Check Installation
```bash
# Check Node.js version
node --version
# Should show: v18.x.x or higher

# Check pnpm version  
pnpm --version
# Should show: 8.x.x or higher

# Check Git version
git --version
```

## 🚀 Step-by-Step Setup

### Step 1: Navigate to Project Directory
```bash
cd /Users/tech/Downloads/front-dev
```

### Step 2: Verify Project Structure
```bash
# Check if you're in the right directory
ls -la
# You should see: package.json, turbo.json, apps/, packages/

# Check the apps directory
ls apps/
# You should see: app, app-sol, mint, web
```

### Step 3: Install Dependencies
```bash
# Install all dependencies
pnpm install

# This will install dependencies for all packages and apps
# Wait for completion (may take 2-3 minutes)
```

### Step 4: Verify Environment Configuration
```bash
# Check if environment files exist
ls apps/*/.env.local

# You should see:
# apps/app/.env.local
# apps/mint/.env.local
```

### Step 5: Check Environment Variables
```bash
# Verify the main app environment
cat apps/app/.env.local

# You should see:
# NEXT_PUBLIC_ENV=testnet
# NEXT_PUBLIC_REOWN_PROJECT_ID=77de8a873af707573cd5ffeff64568a7
# NEXT_PUBLIC_TRON_ADDRESS=TK69h36Z5gjvLbkyfUW9aNjSPRL17jXy2W
# NEXT_PUBLIC_BASE_ADDRESS=0xcb352448236F4A9E2bC56fa8f59851c6a5a34256
```

## 🏃‍♂️ Running Applications

### Option 1: Run All Applications (Recommended)

```bash
# Start all applications in development mode
pnpm dev
```

This will start:
- **Main App**: http://localhost:3000 (Bridge, Staking, Governance)
- **Web App**: http://localhost:3001 (Landing page)
- **Mint App**: http://localhost:3002 (NFT Minting)
- **App-Sol**: http://localhost:3003 (Solana - may have issues)

### Option 2: Run Individual Applications

#### Main App (Bridge Functionality)
```bash
# Navigate to main app
cd apps/app

# Start development server
pnpm dev

# Open in browser: http://localhost:3000
```

#### Web App (Landing Page)
```bash
# Navigate to web app
cd apps/web

# Start development server
pnpm dev

# Open in browser: http://localhost:3001
```

#### Mint App (NFT Minting)
```bash
# Navigate to mint app
cd apps/mint

# Start development server
pnpm dev

# Open in browser: http://localhost:3002
```

## 🧪 Testing Features

### 1. Test Main App (http://localhost:3000)

#### Bridge Functionality
1. **Navigate to Bridge Page**
   - Go to http://localhost:3000/bridge
   - You should see the bridge interface

2. **Test Network Selection**
   - **From Network**: Select Ethereum, Tron, or Base
   - **To Network**: Select different destination network
   - **Verify Icons**: Check that Base network shows the blue icon

3. **Test Wallet Connection**
   - Click "Connect Wallet" button
   - Test with MetaMask (Ethereum/Base) or TronLink (Tron)
   - Verify connection status

4. **Test Address Validation**
   - **Ethereum to Tron**: Enter Tron address (starts with 'T')
   - **Ethereum to Base**: Should auto-populate your address
   - **Tron to Ethereum**: Enter Ethereum address (starts with '0x')

5. **Test Bridge Flow**
   - Enter amount to bridge
   - Verify "Bridge" button appears when wallet is connected
   - Check form validation

#### Staking Functionality
1. **Navigate to Staking Page**
   - Go to http://localhost:3000/staking
   - You should see staking interface

2. **Test Charts**
   - Check that charts show proper dates (Jun 01, Jun 15, etc.)
   - Verify no repeated month names

3. **Test Staking Form**
   - Enter amount to stake
   - Test wallet connection
   - Verify form validation

#### Dashboard
1. **Navigate to Dashboard**
   - Go to http://localhost:3000/
   - You should see the main dashboard

2. **Test Charts**
   - Verify Supply Chart shows proper dates
   - Verify Staking APY Chart shows proper dates
   - Check that no repeated month names appear

### 2. Test Web App (http://localhost:3001)

1. **Landing Page**
   - Go to http://localhost:3001
   - Verify page loads correctly
   - Test navigation

2. **Contact Form**
   - Go to http://localhost:3001/contact-us
   - Test form submission
   - Verify form validation

### 3. Test Mint App (http://localhost:3002)

1. **Mint Interface**
   - Go to http://localhost:3002
   - Verify mint interface loads
   - Test wallet connection
   - Test minting functionality

## 🔍 Verification Checklist

### ✅ Bridge Features
- [ ] Base network icon displays correctly (blue icon)
- [ ] Network selection works (Ethereum, Tron, Base)
- [ ] Wallet connection works for all networks
- [ ] Address validation works correctly
- [ ] Auto-population works for EVM-to-EVM bridges
- [ ] Form validation shows required field errors
- [ ] Bridge button appears when wallet is connected

### ✅ Chart Features
- [ ] Charts show proper dates (Jun 01, Jun 15, Aug 01, etc.)
- [ ] No repeated month names (Jun, Jun, Jun, Jul, Jul, etc.)
- [ ] Charts are interactive and responsive
- [ ] Tooltips show correct information

### ✅ UI/UX Features
- [ ] All pages load without errors
- [ ] Responsive design works on different screen sizes
- [ ] Icons display correctly
- [ ] Forms validate input correctly
- [ ] Navigation works between pages

### ✅ Wallet Integration
- [ ] MetaMask connection works
- [ ] TronLink connection works (if available)
- [ ] WalletConnect works
- [ ] Network switching works
- [ ] Balance display works

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

#### 2. Dependencies Not Installed
```bash
# Clean and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
pnpm install
```

#### 3. Environment Variables Missing
```bash
# Copy environment file
cp apps/app/.env.local apps/mint/.env.local

# Or create manually
echo "NEXT_PUBLIC_REOWN_PROJECT_ID=77de8a873af707573cd5ffeff64568a7" > apps/mint/.env.local
```

#### 4. Build Errors
```bash
# Clean build cache
rm -rf apps/*/.next
rm -rf .turbo

# Rebuild
pnpm build
```

#### 5. Wallet Connection Issues
- **MetaMask**: Ensure it's installed and unlocked
- **TronLink**: Install TronLink extension
- **Network**: Ensure you're on the correct network (testnet)

### Browser Console Errors
1. **Open Developer Tools**: F12 or right-click → Inspect
2. **Check Console Tab**: Look for red error messages
3. **Check Network Tab**: Verify API calls are working
4. **Check Application Tab**: Verify local storage and cookies

## 📊 Performance Testing

### Load Time Testing
1. **Open Network Tab** in Developer Tools
2. **Refresh Page** and check load times
3. **Verify Bundle Sizes** are reasonable
4. **Check for 404 errors** in network requests

### Responsive Testing
1. **Test on Different Screen Sizes**:
   - Mobile (375px width)
   - Tablet (768px width)
   - Desktop (1920px width)
2. **Verify UI Adapts** correctly
3. **Test Touch Interactions** on mobile

## 🎯 Expected Results

### Successful Test Results
- ✅ All applications start without errors
- ✅ Bridge functionality works with all networks
- ✅ Charts display proper dates
- ✅ Base network icon shows correctly
- ✅ Wallet connections work
- ✅ Forms validate correctly
- ✅ Responsive design works

### Performance Expectations
- **Initial Load**: < 3 seconds
- **Page Navigation**: < 1 second
- **Chart Rendering**: < 2 seconds
- **Wallet Connection**: < 5 seconds

## 📝 Testing Notes

### Test Data
- **Test Amounts**: Use small amounts for testing (0.001, 0.01)
- **Test Addresses**: Use your own wallet addresses
- **Test Networks**: Start with testnet networks

### Browser Compatibility
- **Chrome**: Recommended for best compatibility
- **Firefox**: Should work with minor differences
- **Safari**: May have wallet connection limitations
- **Edge**: Should work similar to Chrome

## 🚀 Next Steps After Testing

Once local testing is complete:

1. **Document Issues**: Note any bugs or issues found
2. **Performance Notes**: Record any performance concerns
3. **Feature Feedback**: Provide feedback on new features
4. **Deployment**: Proceed with production deployment if tests pass

---

**Happy Testing!** 🧪✨

If you encounter any issues during testing, refer to the troubleshooting section or check the browser console for error messages.
