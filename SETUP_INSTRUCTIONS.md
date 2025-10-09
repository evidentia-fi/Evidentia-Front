# Evidentia Frontend Setup Instructions

## Overview
This frontend application has been updated with the following features:

1. ✅ Updated Tron smart contract address to `TK69h36Z5gjvLbkyfUW9aNjSPRL17jXy2W`
2. ✅ Added Base network support with contract address `0xcb352448236F4A9E2bC56fa8f59851c6a5a34256`
3. ✅ Added Base network icon (using @web3icons/react)
4. ✅ Fixed wallet connection logic for all bridge scenarios
5. ✅ Implemented auto-population of destination addresses for EVM-to-EVM bridges
6. ✅ Added proper validation and error handling

## Environment Setup

Before running the application, you need to create an environment file with the following variables:

### 1. Create Environment File
Create a file at `apps/app/.env.local` with the following content:

```bash
# Environment Configuration
NEXT_PUBLIC_ENV=testnet

# WalletConnect/Reown Project ID (REQUIRED - Get from https://cloud.reown.com/)
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id_here

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
```

### 2. Get Reown Project ID
1. Go to https://cloud.reown.com/
2. Create an account or sign in
3. Create a new project
4. Copy the Project ID and replace `your_reown_project_id_here` in the environment file

## Running the Application

### Development Mode
```bash
# Install dependencies
pnpm install

# Run the app in development mode
pnpm dev:app
```

### Production Build
```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## Bridge Features Implemented

### 1. Network Support
- ✅ Ethereum
- ✅ Tron (with updated contract address)
- ✅ Base (newly added)

### 2. Bridge Scenarios
- ✅ Ethereum → Tron: Requires EVM wallet connection + Tron destination address
- ✅ Tron → Ethereum: Requires Tron wallet connection + Ethereum destination address
- ✅ Ethereum → Base: Auto-populates destination address (same as source)
- ✅ Base → Ethereum: Auto-populates destination address (same as source)
- ✅ Tron → Base: Requires Tron wallet connection + Base destination address
- ✅ Base → Tron: Requires EVM wallet connection + Tron destination address

### 3. Wallet Connection Logic
- Shows "Connect Wallet" button only when source chain wallet is not connected
- Shows "Bridge" button when wallet is connected
- Validates destination address format based on target network
- Highlights required fields with proper error messages

### 4. Address Validation
- Tron addresses must start with 'T'
- EVM addresses (Ethereum/Base) must start with '0x'
- Required field validation with "This field is required" message
- Auto-population for EVM-to-EVM bridges with editable destination

## Testing the Bridge

1. Navigate to `/bridge` page
2. Select source and destination networks
3. Connect the appropriate wallet for the source network
4. Enter destination address (auto-populated for EVM-to-EVM)
5. Enter amount to bridge
6. Click "Bridge" button

## Troubleshooting

### Common Issues
1. **"Project ID is not defined" error**: Make sure you've set `NEXT_PUBLIC_REOWN_PROJECT_ID` in your `.env.local` file
2. **Wallet connection issues**: Ensure you have the correct wallet extensions installed (MetaMask, TronLink)
3. **Build errors**: Run `pnpm install` to ensure all dependencies are installed

### Network Configuration
The application supports both testnet and mainnet configurations. Set `NEXT_PUBLIC_ENV=testnet` for testing or `NEXT_PUBLIC_ENV=mainnet` for production.

## Files Modified

### Core Bridge Logic
- `apps/app/providers/bridge-provider.tsx` - Added Base network support and new bridge functions
- `apps/app/providers/tron-token-provider.tsx` - Updated to support Base network bridging
- `packages/ui/src/modules/Forms/native-bridge.tsx` - Updated form logic for all bridge scenarios

### Configuration
- `packages/utils/src/config/connectors.ts` - Added Base network configuration
- `packages/utils/src/config/env.ts` - Added Base contract address and updated Tron address
- `packages/utils/src/constants/format.ts` - Added Base network destination mapping

### Types
- `packages/types/src/stores.types.ts` - Updated bridge store interface

### Translations
- `packages/i18n/locales/en.json` - Added new translation keys
- `packages/i18n/locales/uk.json` - Added new translation keys


