# Frontend Application Deployment Guide

## 🚀 Production Build & Deployment

This guide provides comprehensive instructions for building and deploying the frontend application with all the latest updates.

## 📋 Prerequisites

- **Node.js**: Version 18+ (recommended: 20+)
- **pnpm**: Package manager
- **Environment Variables**: Reown Project ID and contract addresses

## 🛠️ Quick Build

### Option 1: Automated Build Script
```bash
# Run the automated build script
./build-production.sh
```

### Option 2: Manual Build
```bash
# Install dependencies
pnpm install

# Build shared packages
pnpm build --filter=@workspace/eslint-config
pnpm build --filter=@workspace/i18n
pnpm build --filter=@workspace/types
pnpm build --filter=@workspace/typescript-config
pnpm build --filter=@workspace/ui
pnpm build --filter=@workspace/utils

# Build applications
pnpm build --filter=app      # Main app with bridge
pnpm build --filter=web      # Web app
pnpm build --filter=mint     # Mint app
```

## 📦 Built Applications

### 1. Main App (`app`)
- **Location**: `apps/app/.next`
- **Features**: Bridge functionality, staking, governance
- **Networks**: Ethereum, Tron, Base
- **Port**: 3000 (default)

### 2. Web App (`web`)
- **Location**: `apps/web/.next`
- **Features**: Landing page, contact form
- **Port**: 3001 (default)

### 3. Mint App (`mint`)
- **Location**: `apps/mint/.next`
- **Features**: NFT minting functionality
- **Port**: 3002 (default)

## 🌐 Environment Configuration

### Required Environment Variables
```bash
# Environment
NEXT_PUBLIC_ENV=testnet

# WalletConnect/Reown Project ID
NEXT_PUBLIC_REOWN_PROJECT_ID=77de8a873af707573cd5ffeff64568a7

# Contract Addresses
NEXT_PUBLIC_TRON_ADDRESS=TK69h36Z5gjvLbkyfUW9aNjSPRL17jXy2W
NEXT_PUBLIC_BASE_ADDRESS=0xcb352448236F4A9E2bC56fa8f59851c6a5a34256

# GraphQL Endpoint
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.thegraph.com/subgraphs/name/your-subgraph
```

### Environment Files
Each app should have its own `.env.local` file:
- `apps/app/.env.local`
- `apps/web/.env.local`
- `apps/mint/.env.local`

## 🚀 Deployment Options

### 1. Local Development
```bash
# Start individual apps
cd apps/app && pnpm dev      # Port 3000
cd apps/web && pnpm dev      # Port 3001
cd apps/mint && pnpm dev     # Port 3002

# Or start all apps
pnpm dev
```

### 2. Production Local
```bash
# Build first
pnpm build

# Start production servers
cd apps/app && pnpm start    # Port 3000
cd apps/web && pnpm start    # Port 3001
cd apps/mint && pnpm start   # Port 3002
```

### 3. Docker Deployment
```bash
# Build Docker images
docker build -t frontend-app ./apps/app
docker build -t frontend-web ./apps/web
docker build -t frontend-mint ./apps/mint

# Run containers
docker run -p 3000:3000 frontend-app
docker run -p 3001:3001 frontend-web
docker run -p 3002:3002 frontend-mint
```

### 4. Cloud Deployment

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy each app
cd apps/app && vercel --prod
cd apps/web && vercel --prod
cd apps/mint && vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy each app
cd apps/app && netlify deploy --prod --dir=.next
cd apps/web && netlify deploy --prod --dir=.next
cd apps/mint && netlify deploy --prod --dir=.next
```

## 🔧 Configuration

### Network Configuration
The application supports three networks:

1. **Ethereum**
   - Mainnet: Chain ID 1
   - Sepolia: Chain ID 11155111

2. **Tron**
   - Mainnet: Chain ID 728
   - Shasta: Chain ID 2494104990

3. **Base**
   - Mainnet: Chain ID 8453
   - Sepolia: Chain ID 84532

### Bridge Configuration
- **Ethereum ↔ Tron**: Direct bridge
- **Ethereum ↔ Base**: EVM-to-EVM bridge
- **Tron ↔ Base**: Cross-chain bridge

## 📊 Features Included

### ✅ Bridge Functionality
- Multi-network support (Ethereum, Tron, Base)
- Smart contract integration
- Wallet connection (MetaMask, WalletConnect, TronLink)
- Address validation and auto-population
- Transaction status tracking

### ✅ UI/UX Improvements
- Base network icon integration
- Fixed chart date formatting
- Responsive design
- Internationalization (English/Ukrainian)

### ✅ Chart Updates
- Proper date display (Jun 01, Jun 15, etc.)
- Real-time data visualization
- Interactive tooltips

### ✅ Wallet Integration
- Multi-wallet support
- Network switching
- Balance display
- Transaction history

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clean and rebuild
   rm -rf node_modules apps/*/.next .turbo
   pnpm install
   pnpm build
   ```

2. **Environment Variables**
   ```bash
   # Check environment files
   ls -la apps/*/.env.local
   ```

3. **Port Conflicts**
   ```bash
   # Check running processes
   lsof -i :3000
   lsof -i :3001
   lsof -i :3002
   ```

4. **Dependency Issues**
   ```bash
   # Update dependencies
   pnpm update
   pnpm install
   ```

### Performance Optimization

1. **Bundle Analysis**
   ```bash
   # Analyze bundle size
   cd apps/app && pnpm build && pnpm analyze
   ```

2. **Image Optimization**
   - Use Next.js Image component
   - Optimize SVG icons
   - Compress assets

## 📈 Monitoring

### Health Checks
- Application status endpoints
- Database connectivity
- External API availability

### Logging
- Application logs
- Error tracking
- Performance metrics

## 🔒 Security

### Environment Variables
- Never commit `.env.local` files
- Use secure environment variable management
- Rotate API keys regularly

### Network Security
- HTTPS in production
- CORS configuration
- Rate limiting

## 📞 Support

For deployment issues or questions:
1. Check the build logs
2. Verify environment configuration
3. Review the troubleshooting section
4. Contact the development team

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Build Status**: ✅ Production Ready
