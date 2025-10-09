#!/bin/bash

# Evidentia Frontend Setup Script
echo "🚀 Setting up Evidentia Frontend..."

# Check if .env.local exists
if [ ! -f "apps/app/.env.local" ]; then
    echo "📝 Creating environment file..."
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
    echo "✅ Environment file created at apps/app/.env.local"
    echo "✅ Your Reown Project ID is already configured: 77de8a873af707573cd5ffeff64568a7"
else
    echo "✅ Environment file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'pnpm dev:app' to start the development server"
echo "2. Navigate to http://localhost:3000/bridge to test the bridge functionality"
echo "3. Your Reown Project ID is already configured!"
echo ""
echo "For detailed instructions, see SETUP_INSTRUCTIONS.md"


