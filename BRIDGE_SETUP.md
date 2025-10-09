# Bridge Application Setup Instructions

## Environment Variables Required

To run the bridge application, you need to create a `.env.local` file in the `apps/app/` directory with the following variables:

```bash
# Environment Configuration
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
```

## Setup Steps

1. **Create the environment file:**
   ```bash
   cd apps/app
   cp .env.example .env.local  # if .env.example exists
   # OR create .env.local manually with the variables above
   ```

2. **Install dependencies:**
   ```bash
   cd /path/to/front-dev
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   pnpm dev:app
   ```

4. **Access the application:**
   - Open http://localhost:3000 in your browser
   - Navigate to the bridge page to test the new functionality

## Changes Made

### 1. Updated Tron Smart Contract Address
- Changed from environment variable to hardcoded: `TK69h36Z5gjvLbkyfUW9aNjSPRL17jXy2W`

### 2. Added Base Network Support
- Added Base network (0xcb352448236F4A9E2bC56fa8f59851c6a5a34256) to bridge options
- Added Base network configuration in wagmi connectors
- Added Base network chain IDs (30184 for mainnet, 40184 for testnet)

### 3. Enhanced Bridge Logic
- **Ethereum to Tron**: Shows "Connect Wallet" only if EVM wallet not connected, otherwise shows "Bridge"
- **Tron to Ethereum**: Requires Tron wallet connection, shows "Bridge" after connection
- **Ethereum to Base**: Auto-populates destination address (same as source), allows editing
- **Base to Ethereum**: Auto-populates destination address (same as source), allows editing
- **Tron to Base**: Same rules as Ethereum to Tron (requires destination address input)
- **Base to Tron**: Same rules as Ethereum to Tron (requires destination address input)

### 4. Address Validation
- Required field validation for non-EVM-to-EVM bridges
- Address format validation (Tron addresses start with 'T', EVM addresses start with '0x')
- Auto-population for EVM-to-EVM bridges with edit capability

### 5. UI Improvements
- Added Base network icon (using 'base' symbol from @web3icons/react)
- Enhanced form validation with proper error messages
- Added required field indicators (*) for mandatory address fields
- Improved placeholder text for auto-populated fields

## Testing the Bridge

1. **Test Ethereum to Tron Bridge:**
   - Connect EVM wallet
   - Select Ethereum as source, Tron as destination
   - Enter Tron address (starts with 'T')
   - Enter amount and click Bridge

2. **Test Tron to Ethereum Bridge:**
   - Connect Tron wallet
   - Select Tron as source, Ethereum as destination
   - Enter Ethereum address (starts with '0x')
   - Enter amount and click Bridge

3. **Test Ethereum to Base Bridge:**
   - Connect EVM wallet
   - Select Ethereum as source, Base as destination
   - Address should auto-populate (can be edited)
   - Enter amount and click Bridge

4. **Test Base to Ethereum Bridge:**
   - Connect EVM wallet
   - Select Base as source, Ethereum as destination
   - Address should auto-populate (can be edited)
   - Enter amount and click Bridge

5. **Test Tron to Base Bridge:**
   - Connect Tron wallet
   - Select Tron as source, Base as destination
   - Enter Base address (starts with '0x')
   - Enter amount and click Bridge

6. **Test Base to Tron Bridge:**
   - Connect EVM wallet
   - Select Base as source, Tron as destination
   - Enter Tron address (starts with 'T')
   - Enter amount and click Bridge

## Notes

- The application uses LayerZero for cross-chain bridging
- All bridge operations require proper wallet connections for the source chain
- Address validation ensures correct format for each network
- Auto-population only works for EVM-to-EVM bridges (Ethereum ↔ Base)
- All other bridges require manual destination address input


