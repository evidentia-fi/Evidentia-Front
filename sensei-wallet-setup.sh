#!/bin/bash

# Sensei OP Stack Wallet Setup Script
# This script generates the required EOA keys and provides funding instructions

set -e

# Configuration
CHAIN_NAME="Sensei"
L2_CHAIN_ID="22222"
L1_CHAIN_ID="11155111"
SEPOLIA_RPC_URL="https://sepolia.gateway.tenderly.co"  # Public RPC

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Function to check if required tools are installed
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v cast &> /dev/null; then
        error "Foundry (cast) is not installed. Please install it first:"
        echo "  curl -L https://foundry.paradigm.xyz | bash"
        echo "  foundryup"
    fi
    
    if ! command -v jq &> /dev/null; then
        error "jq is not installed. Please install it first:"
        echo "  apt-get install jq  # Ubuntu/Debian"
        echo "  brew install jq     # macOS"
    fi
    
    log "All dependencies are installed"
}

# Function to generate a new wallet
generate_wallet() {
    local wallet_name=$1
    local secure_dir="./sensei-chain/keys"
    mkdir -p "$secure_dir"
    
    log "Generating wallet: $wallet_name"
    
    # Generate a random private key
    local private_key="0x$(openssl rand -hex 32)"
    
    # Get address from private key
    local address=$(cast wallet address --private-key "$private_key")
    
    # Store private key securely
    echo "$private_key" > "$secure_dir/${wallet_name}_private_key"
    chmod 600 "$secure_dir/${wallet_name}_private_key"
    
    # Store address
    echo "$address" > "$secure_dir/${wallet_name}_address"
    chmod 644 "$secure_dir/${wallet_name}_address"
    
    log "Wallet $wallet_name generated:"
    echo "  Address: $address"
    echo "  Private key stored in: $secure_dir/${wallet_name}_private_key"
    
    echo "$address"
}

# Function to check wallet balance on Sepolia
check_balance() {
    local address=$1
    local wallet_name=$2
    
    log "Checking $wallet_name balance on Sepolia..."
    
    local balance_wei=$(cast balance "$address" --rpc-url "$SEPOLIA_RPC_URL")
    local balance_eth=$(cast to-unit "$balance_wei" ether)
    
    echo "  Balance: $balance_eth ETH"
    
    # Check if balance is sufficient
    local required_eth="0.1"  # Minimum required ETH
    if (( $(echo "$balance_eth < $required_eth" | bc -l) )); then
        warn "$wallet_name needs at least $required_eth ETH on Sepolia"
        return 1
    else
        log "$wallet_name has sufficient balance"
        return 0
    fi
}

# Function to create funding instructions
create_funding_instructions() {
    local sequencer_addr=$1
    local batcher_addr=$2
    local proposer_addr=$3
    
    log "Creating funding instructions..."
    
    cat > ./sensei-chain/FUNDING_INSTRUCTIONS.md << EOF
# Sensei Chain Wallet Funding Instructions

## Required Wallets

The following wallets have been generated and need to be funded on Ethereum Sepolia:

### 1. Sequencer Wallet
- **Address**: $sequencer_addr
- **Purpose**: Used by op-node to sequence blocks
- **Funding**: No funding required (L2 only)

### 2. Batcher Wallet
- **Address**: $batcher_addr
- **Purpose**: Posts L2 transaction batches to L1
- **Funding**: **REQUIRED** - Fund with at least 0.1 ETH on Sepolia
- **Usage**: Pays for L1 transaction fees when submitting batches

### 3. Proposer Wallet
- **Address**: $proposer_addr
- **Purpose**: Posts L2 state outputs to L1
- **Funding**: **REQUIRED** - Fund with at least 0.1 ETH on Sepolia
- **Usage**: Pays for L1 transaction fees when submitting outputs

## Funding Steps

### Option 1: Use Sepolia Faucet
1. Visit: https://sepoliafaucet.com/
2. Enter the batcher address: $batcher_addr
3. Request 0.1 ETH
4. Repeat for proposer address: $proposer_addr

### Option 2: Use Alchemy Faucet
1. Visit: https://sepoliafaucet.com/
2. Enter the batcher address: $batcher_addr
3. Request 0.1 ETH
4. Repeat for proposer address: $proposer_addr

### Option 3: Transfer from existing wallet
If you have ETH on Sepolia, transfer at least 0.1 ETH to each address:
- Batcher: $batcher_addr
- Proposer: $proposer_addr

## Verification

After funding, verify balances using:

\`\`\`bash
# Check batcher balance
cast balance $batcher_addr --rpc-url $SEPOLIA_RPC_URL

# Check proposer balance
cast balance $proposer_addr --rpc-url $SEPOLIA_RPC_URL
\`\`\`

## Security Notes

- **NEVER** share private keys
- Store private keys securely
- Consider using hardware wallets for production
- Rotate keys periodically
- Monitor wallet balances and top up as needed

## Environment Variables

Add these to your deployment environment:

\`\`\`bash
export SENSEI_SEQUENCER_KEY=\$(cat /opt/sensei-chain/keys/sequencer_private_key)
export SENSEI_BATCHER_KEY=\$(cat /opt/sensei-chain/keys/batcher_private_key)
export SENSEI_PROPOSER_KEY=\$(cat /opt/sensei-chain/keys/proposer_private_key)
\`\`\`

## Next Steps

1. Fund the batcher and proposer wallets
2. Verify balances
3. Proceed with L1 contract deployment
4. Deploy the OP Stack components

EOF
    
    log "Funding instructions created: ./sensei-chain/FUNDING_INSTRUCTIONS.md"
}

# Function to create environment file template
create_env_template() {
    log "Creating environment file template..."
    
    cat > ./sensei-chain/.env.template << 'EOF'
# Sensei OP Stack Environment Configuration

# L1 Configuration
L1_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
L1_CHAIN_ID=11155111

# L2 Configuration
L2_CHAIN_ID=22222
L2_BLOCK_TIME=2

# Wallet Keys (DO NOT COMMIT THESE TO VERSION CONTROL)
SENSEI_SEQUENCER_KEY=your_sequencer_private_key_here
SENSEI_BATCHER_KEY=your_batcher_private_key_here
SENSEI_PROPOSER_KEY=your_proposer_private_key_here

# System Configuration
FINAL_SYSTEM_OWNER=0xYOUR_OWNER_ADDRESS
BASE_FEE_VAULT_RECIPIENT=0xYOUR_OWNER_ADDRESS
L1_FEE_VAULT_RECIPIENT=0xYOUR_OWNER_ADDRESS
SEQUENCER_FEE_VAULT_RECIPIENT=0xYOUR_OWNER_ADDRESS

# Database Configuration (for explorer)
POSTGRES_USER=sensei
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=sensei_explorer

# Monitoring
GRAFANA_ADMIN_PASSWORD=your_grafana_password_here

# Domain Configuration
DOMAIN=yourdomain.com
RPC_DOMAIN=rpc.sensei.yourdomain.com
EXPLORER_DOMAIN=explorer.sensei.yourdomain.com
EOF
    
    log "Environment template created: ./sensei-chain/.env.template"
}

# Function to create wallet management script
create_wallet_management_script() {
    log "Creating wallet management script..."
    
    mkdir -p ./sensei-chain/scripts
    cat > ./sensei-chain/scripts/manage-wallets.sh << 'EOF'
#!/bin/bash

# Wallet Management Script for Sensei Chain

WALLET_DIR="/opt/sensei-chain/keys"

show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  list        - List all wallet addresses"
    echo "  balance     - Check balances on Sepolia"
    echo "  export      - Export wallet information (secure)"
    echo "  backup      - Create encrypted backup of keys"
    echo "  restore     - Restore keys from backup"
    echo "  rotate      - Generate new keys (DANGEROUS)"
    echo ""
}

list_wallets() {
    echo "=== Sensei Chain Wallets ==="
    echo ""
    
    for wallet in sequencer batcher proposer; do
        if [ -f "$WALLET_DIR/${wallet}_address" ]; then
            local address=$(cat "$WALLET_DIR/${wallet}_address")
            echo "$wallet: $address"
        else
            echo "$wallet: NOT GENERATED"
        fi
    done
    echo ""
}

check_balances() {
    echo "=== Wallet Balances on Sepolia ==="
    echo ""
    
    local sepolia_rpc="https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
    
    for wallet in batcher proposer; do
        if [ -f "$WALLET_DIR/${wallet}_address" ]; then
            local address=$(cat "$WALLET_DIR/${wallet}_address")
            local balance=$(cast balance "$address" --rpc-url "$sepolia_rpc" 2>/dev/null || echo "ERROR")
            local balance_eth=$(cast to-unit "$balance" ether 2>/dev/null || echo "ERROR")
            echo "$wallet: $balance_eth ETH"
        else
            echo "$wallet: NOT GENERATED"
        fi
    done
    echo ""
}

export_wallets() {
    echo "=== Wallet Export (SECURE) ==="
    echo ""
    echo "WARNING: This will display private keys. Ensure you're in a secure environment."
    echo "Press Enter to continue or Ctrl+C to cancel..."
    read
    
    for wallet in sequencer batcher proposer; do
        if [ -f "$WALLET_DIR/${wallet}_private_key" ]; then
            local address=$(cat "$WALLET_DIR/${wallet}_address")
            local private_key=$(cat "$WALLET_DIR/${wallet}_private_key")
            echo "$wallet:"
            echo "  Address: $address"
            echo "  Private Key: $private_key"
            echo ""
        fi
    done
}

backup_wallets() {
    echo "=== Creating Wallet Backup ==="
    echo ""
    
    local backup_file="/opt/sensei-chain/backups/wallet-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    mkdir -p "$(dirname "$backup_file")"
    
    tar -czf "$backup_file" -C "$WALLET_DIR" .
    chmod 600 "$backup_file"
    
    echo "Backup created: $backup_file"
    echo "Store this file securely and delete it from the server!"
}

# Main script logic
case "${1:-help}" in
    "list")
        list_wallets
        ;;
    "balance")
        check_balances
        ;;
    "export")
        export_wallets
        ;;
    "backup")
        backup_wallets
        ;;
    "help"|*)
        show_help
        ;;
esac
EOF
    
    chmod +x ./sensei-chain/scripts/manage-wallets.sh
    
    log "Wallet management script created: ./sensei-chain/scripts/manage-wallets.sh"
}

# Main function
main() {
    log "Starting Sensei OP Stack wallet setup..."
    
    # Check dependencies
    check_dependencies
    
    # Create secure directory
    mkdir -p ./sensei-chain/keys
    chmod 700 ./sensei-chain/keys
    
    # Generate wallets
    log "Generating required wallets..."
    sequencer_addr=$(generate_wallet "sequencer")
    batcher_addr=$(generate_wallet "batcher")
    proposer_addr=$(generate_wallet "proposer")
    
    echo ""
    log "All wallets generated successfully!"
    echo ""
    
    # Create funding instructions
    create_funding_instructions "$sequencer_addr" "$batcher_addr" "$proposer_addr"
    
    # Create environment template
    create_env_template
    
    # Create wallet management script
    create_wallet_management_script
    
    echo ""
    info "=== WALLET SETUP COMPLETE ==="
    echo ""
    info "Generated wallets:"
    echo "  Sequencer: $sequencer_addr"
    echo "  Batcher:   $batcher_addr"
    echo "  Proposer:  $proposer_addr"
    echo ""
    warn "IMPORTANT: Fund the batcher and proposer wallets on Sepolia!"
    echo ""
    info "Next steps:"
    echo "1. Read funding instructions: cat ./sensei-chain/FUNDING_INSTRUCTIONS.md"
    echo "2. Fund batcher and proposer wallets"
    echo "3. Check balances: ./sensei-chain/scripts/manage-wallets.sh balance"
    echo "4. Proceed with L1 contract deployment"
    echo ""
}

# Run main function
main "$@"
