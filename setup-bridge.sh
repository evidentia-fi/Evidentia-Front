#!/bin/bash

# Bridge Application Setup Script
echo "🚀 Setting up Bridge Application..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Create .env.local file if it doesn't exist
ENV_FILE="apps/app/.env.local"
if [ ! -f "$ENV_FILE" ]; then
    echo "📝 Creating environment file..."
    cat > "$ENV_FILE" << EOF
# Environment Configuration for Testing
NEXT_PUBLIC_ENV=testnet
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
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
    echo "✅ Environment file created at $ENV_FILE"
    echo "⚠️  Please update the placeholder values in $ENV_FILE with your actual configuration"
else
    echo "✅ Environment file already exists at $ENV_FILE"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update the environment variables in $ENV_FILE with your actual values"
echo "2. Run: pnpm dev:app"
echo "3. Open http://localhost:3000 in your browser"
echo "4. Navigate to the bridge page to test the new functionality"
echo ""
echo "📖 For detailed instructions, see BRIDGE_SETUP.md"


