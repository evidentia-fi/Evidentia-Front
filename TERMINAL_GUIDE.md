# Terminal Guide: Running Evidentia Frontend Locally

## Prerequisites
- Node.js (version 20 or higher)
- pnpm package manager
- Git (if cloning the repository)

## Step-by-Step Terminal Commands

### Step 1: Navigate to Project Directory
```bash
cd /Users/tech/Downloads/front-dev
```

### Step 2: Install Dependencies
```bash
pnpm install
```
*This will install all required packages for the monorepo*

### Step 3: Create Environment File
```bash
# Create the environment file
cat > apps/app/.env.local << 'EOF'
# Environment Configuration
NEXT_PUBLIC_ENV=testnet

# WalletConnect/Reown Project ID (REQUIRED - Get from https://cloud.reown.com/)
NEXT_PUBLIC_REOWN_PROJECT_ID=77de8a873af707573cd5ffeff64568a7

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.evidentia.fi

# Contract Addresses (Replace with actual addresses)
NEXT_PUBLIC_STABLES_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_NFT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_NFT_STAKING_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_STABLES_STAKING_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_OFT_ADAPTER=0x1234567890123456789012345678901234567890

# Tron Configuration (Updated as requested)
NEXT_PUBLIC_TRON_ADDRESS=TK69h36Z5gjvLbkyfUW9aNjSPRL17jXy2W

# Base Network Configuration (Added as requested)
NEXT_PUBLIC_BASE_ADDRESS=0xcb352448236F4A9E2bC56fa8f59851c6a5a34256

# Other Configuration
NEXT_PUBLIC_UNISWAP_POOL_ID_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_GRAPHQL_KEY=your_graphql_key_here
EOF
```

### Step 4: Environment File is Ready
✅ **Your Reown Project ID is already configured**: `77de8a873af707573cd5ffeff64568a7`

*No additional configuration needed - the environment file is ready to use!*

### Step 5: Verify Environment File
```bash
# Check that the environment file was created correctly
cat apps/app/.env.local
```

### Step 6: Start Development Server
```bash
# Start the app in development mode
pnpm dev:app
```

### Step 7: Access the Application
```bash
# Open the application in your default browser
open http://localhost:3000
```

## Alternative: Using the Setup Script

If you prefer an automated approach:

```bash
# Make the setup script executable
chmod +x setup.sh

# Run the setup script
./setup.sh

# Environment file is already configured with your Project ID
```

## Testing the Bridge Functionality

### Step 1: Navigate to Bridge Page
```bash
# Open the bridge page directly
open http://localhost:3000/bridge
```

### Step 2: Test Bridge Scenarios
1. **Ethereum → Tron**: Connect EVM wallet, enter Tron address
2. **Tron → Ethereum**: Connect Tron wallet, enter Ethereum address  
3. **Ethereum → Base**: Connect EVM wallet, address auto-populates
4. **Base → Ethereum**: Connect EVM wallet, address auto-populates
5. **Tron → Base**: Connect Tron wallet, enter Base address
6. **Base → Tron**: Connect EVM wallet, enter Tron address

## Troubleshooting Commands

### Check if Server is Running
```bash
# Check if the development server is running
ps aux | grep "next dev" | grep -v grep
```

### Check Server Status
```bash
# Test if the server is responding
curl -s -I http://localhost:3000 | head -1
```

### Stop the Development Server
```bash
# Kill the development server process
pkill -f "next dev"
```

### Check for Build Errors
```bash
# Run a production build to check for errors
pnpm build
```

### Check Dependencies
```bash
# Verify all dependencies are installed
pnpm list --depth=0
```

### Clear Cache and Reinstall
```bash
# If you encounter issues, clear cache and reinstall
rm -rf node_modules
rm -rf apps/app/node_modules
rm -rf apps/app/.next
pnpm install
```

## Production Build Commands

### Build for Production
```bash
# Create a production build
pnpm build
```

### Start Production Server
```bash
# Start the production server
pnpm start
```

### Build Specific App
```bash
# Build only the main app
pnpm --filter app build
```

## Useful Development Commands

### Run Linting
```bash
# Check code quality
pnpm lint
```

### Run Type Checking
```bash
# Check TypeScript types
pnpm typecheck
```

### Format Code
```bash
# Format code with Prettier
pnpm format
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_ENV` | Environment (testnet/mainnet) | Yes |
| `NEXT_PUBLIC_REOWN_PROJECT_ID` | WalletConnect Project ID | Yes |
| `NEXT_PUBLIC_API_BASE_URL` | API endpoint | Yes |
| `NEXT_PUBLIC_TRON_ADDRESS` | Tron contract address | Yes |
| `NEXT_PUBLIC_BASE_ADDRESS` | Base contract address | Yes |
| `NEXT_PUBLIC_STABLES_ADDRESS` | Stables contract address | Yes |
| `NEXT_PUBLIC_OFT_ADAPTER` | OFT Adapter contract address | Yes |

## Quick Commands Summary

```bash
# Complete setup in one go
cd /Users/tech/Downloads/front-dev && \
pnpm install && \
cat > apps/app/.env.local << 'EOF'
NEXT_PUBLIC_ENV=testnet
NEXT_PUBLIC_REOWN_PROJECT_ID=77de8a873af707573cd5ffeff64568a7
NEXT_PUBLIC_API_BASE_URL=https://api.evidentia.fi
NEXT_PUBLIC_STABLES_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_NFT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_NFT_STAKING_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_STABLES_STAKING_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_OFT_ADAPTER=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_TRON_ADDRESS=TK69h36Z5gjvLbkyfUW9aNjSPRL17jXy2W
NEXT_PUBLIC_BASE_ADDRESS=0xcb352448236F4A9E2bC56fa8f59851c6a5a34256
NEXT_PUBLIC_UNISWAP_POOL_ID_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_GRAPHQL_KEY=your_graphql_key_here
EOF
echo "✅ Setup complete! Your Project ID is already configured. Run: pnpm dev:app"
```

## Expected Output

When everything is working correctly, you should see:

```bash
$ pnpm dev:app
> turbo dev --filter app
turbo 2.5.3
• Packages in scope: app
• Running dev in 1 packages
app:dev: 
app:dev: > app@0.0.1 dev /Users/tech/Downloads/front-dev/apps/app
app:dev: > next dev --turbopack --port 3000
app:dev: 
app:dev:    ▲ Next.js 15.3.3 (Turbopack)
app:dev:    - Local:        http://localhost:3000
app:dev:    - Network:      http://192.168.1.75:3000
app:dev: 
app:dev:  ✓ Ready in 3.1s
```

Then open http://localhost:3000/bridge to test the bridge functionality!
