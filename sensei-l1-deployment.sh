#!/bin/bash

# Sensei OP Stack L1 Contract Deployment Script
# This script deploys the L1 contracts to Sepolia and generates the required configs

set -e

# Configuration
CHAIN_NAME="Sensei"
L2_CHAIN_ID="22222"
L1_CHAIN_ID="11155111"
SEPOLIA_RPC_URL="https://sepolia.gateway.tenderly.co"  # Public RPC
DEPLOYER_KEY=""  # Will be set from environment or prompt

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

# Function to check dependencies
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v git &> /dev/null; then
        error "git is not installed"
    fi
    
    if ! command -v make &> /dev/null; then
        error "make is not installed"
    fi
    
    if ! command -v cast &> /dev/null; then
        error "Foundry (cast) is not installed. Please install it first:"
        echo "  curl -L https://foundry.paradigm.xyz | bash"
        echo "  foundryup"
    fi
    
    if ! command -v jq &> /dev/null; then
        error "jq is not installed"
    fi
    
    log "All dependencies are installed"
}

# Function to clone and setup optimism repo
setup_optimism_repo() {
    log "Setting up Optimism repository..."
    
    local repo_dir="/opt/sensei-chain/optimism"
    
    if [ -d "$repo_dir" ]; then
        log "Optimism repository already exists, updating..."
        cd "$repo_dir"
        git pull origin main
    else
        log "Cloning Optimism repository..."
        git clone https://github.com/ethereum-optimism/optimism.git "$repo_dir"
        cd "$repo_dir"
    fi
    
    # Checkout a stable release (adjust as needed)
    local latest_tag=$(git describe --tags --abbrev=0)
    log "Checking out latest stable release: $latest_tag"
    git checkout "$latest_tag"
    
    # Install dependencies
    log "Installing dependencies..."
    make install
    
    log "Optimism repository setup complete"
}

# Function to create deploy configuration
create_deploy_config() {
    log "Creating deployment configuration..."
    
    local config_file="/opt/sensei-chain/optimism/packages/contracts-bedrock/deploy-config/sensei-sepolia.json"
    
    # Read wallet addresses
    local sequencer_addr=$(cat /opt/sensei-chain/keys/sequencer_address)
    local batcher_addr=$(cat /opt/sensei-chain/keys/batcher_address)
    local proposer_addr=$(cat /opt/sensei-chain/keys/proposer_address)
    local system_owner=${FINAL_SYSTEM_OWNER:-$sequencer_addr}
    
    log "Using addresses:"
    log "  Sequencer: $sequencer_addr"
    log "  Batcher: $batcher_addr"
    log "  Proposer: $proposer_addr"
    log "  System Owner: $system_owner"
    
    # Create deploy config
    cat > "$config_file" << EOF
{
  "l1ChainID": $L1_CHAIN_ID,
  "l2ChainID": $L2_CHAIN_ID,
  "l2BlockTime": 2,
  "l2GenesisBlockGasLimit": "30000000",
  "p2pSequencerAddress": "$sequencer_addr",
  "batchSenderAddress": "$batcher_addr",
  "finalSystemOwner": "$system_owner",
  "baseFeeVaultRecipient": "$system_owner",
  "l1FeeVaultRecipient": "$system_owner",
  "sequencerFeeVaultRecipient": "$system_owner",
  "l2GenesisTokenOwner": "$system_owner",
  "gasPriceOracleOverhead": 2100,
  "gasPriceOracleScalar": 1000000,
  "useFaultProofs": true,
  "deploymentWaitConfirmations": 3,
  "eip1559Elasticity": 10,
  "eip1559Denominator": 50,
  "finalizationPeriodSeconds": 604800,
  "fundDevAccounts": false,
  "homesteadBlock": 0,
  "eip150Block": 0,
  "eip155Block": 0,
  "eip158Block": 0,
  "byzantiumBlock": 0,
  "constantinopleBlock": 0,
  "petersburgBlock": 0,
  "istanbulBlock": 0,
  "muirGlacierBlock": 0,
  "berlinBlock": 0,
  "londonBlock": 0,
  "parisBlock": 0
}
EOF
    
    log "Deployment configuration created: $config_file"
}

# Function to check deployer balance
check_deployer_balance() {
    log "Checking deployer balance..."
    
    local deployer_addr=$(cast wallet address --private-key "$DEPLOYER_KEY")
    local balance_wei=$(cast balance "$deployer_addr" --rpc-url "$SEPOLIA_RPC_URL")
    local balance_eth=$(cast to-unit "$balance_wei" ether)
    
    log "Deployer address: $deployer_addr"
    log "Balance: $balance_eth ETH"
    
    # Check if balance is sufficient (need at least 0.5 ETH for deployment)
    local required_eth="0.5"
    if (( $(echo "$balance_eth < $required_eth" | bc -l) )); then
        error "Insufficient balance. Need at least $required_eth ETH, have $balance_eth ETH"
    fi
    
    log "Balance check passed"
}

# Function to deploy L1 contracts
deploy_l1_contracts() {
    log "Deploying L1 contracts to Sepolia..."
    
    cd /opt/sensei-chain/optimism/packages/contracts-bedrock
    
    # Set environment variables
    export PRIVATE_KEY="$DEPLOYER_KEY"
    export L1_RPC_URL="$SEPOLIA_RPC_URL"
    export DEPLOYMENT_CONTEXT="sensei-sepolia"
    
    # Run deployment
    log "Starting contract deployment..."
    make deploy
    
    log "L1 contract deployment completed"
}

# Function to extract deployment artifacts
extract_deployment_artifacts() {
    log "Extracting deployment artifacts..."
    
    local artifacts_dir="/opt/sensei-chain/optimism/packages/contracts-bedrock/.deploy"
    local output_dir="/opt/sensei-chain/configs"
    
    if [ ! -d "$artifacts_dir" ]; then
        error "Deployment artifacts not found at $artifacts_dir"
    fi
    
    # Copy artifacts
    cp -r "$artifacts_dir"/* "$output_dir/"
    
    # Extract key addresses
    local l2_output_oracle=$(jq -r '.L2OutputOracleProxy' "$output_dir/sensei-sepolia.json")
    local system_config=$(jq -r '.SystemConfigProxy' "$output_dir/sensei-sepolia.json")
    local optimism_portal=$(jq -r '.OptimismPortalProxy' "$output_dir/sensei-sepolia.json")
    local l1_standard_bridge=$(jq -r '.L1StandardBridgeProxy' "$output_dir/sensei-sepolia.json")
    
    log "Key contract addresses:"
    log "  L2OutputOracle: $l2_output_oracle"
    log "  SystemConfig: $system_config"
    log "  OptimismPortal: $optimism_portal"
    log "  L1StandardBridge: $l1_standard_bridge"
    
    # Save addresses to file
    cat > "$output_dir/contract-addresses.txt" << EOF
L2OutputOracleProxy=$l2_output_oracle
SystemConfigProxy=$system_config
OptimismPortalProxy=$optimism_portal
L1StandardBridgeProxy=$l1_standard_bridge
EOF
    
    log "Contract addresses saved to: $output_dir/contract-addresses.txt"
}

# Function to generate genesis and rollup configs
generate_configs() {
    log "Generating genesis.json and rollup.json..."
    
    cd /opt/sensei-chain/optimism/packages/contracts-bedrock
    
    # Generate genesis.json
    log "Generating genesis.json..."
    make genesis
    
    # Generate rollup.json
    log "Generating rollup.json..."
    make rollup
    
    # Copy configs to output directory
    local output_dir="/opt/sensei-chain/configs"
    cp deploy-config/sensei-sepolia/genesis.json "$output_dir/"
    cp deploy-config/sensei-sepolia/rollup.json "$output_dir/"
    
    log "Configuration files generated:"
    log "  genesis.json: $output_dir/genesis.json"
    log "  rollup.json: $output_dir/rollup.json"
}

# Function to verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    local config_dir="/opt/sensei-chain/configs"
    
    # Check if files exist
    if [ ! -f "$config_dir/genesis.json" ]; then
        error "genesis.json not found"
    fi
    
    if [ ! -f "$config_dir/rollup.json" ]; then
        error "rollup.json not found"
    fi
    
    # Verify genesis.json
    local genesis_chain_id=$(jq -r '.config.chainId' "$config_dir/genesis.json")
    if [ "$genesis_chain_id" != "$L2_CHAIN_ID" ]; then
        error "Chain ID mismatch in genesis.json: expected $L2_CHAIN_ID, got $genesis_chain_id"
    fi
    
    # Verify rollup.json
    local rollup_chain_id=$(jq -r '.genesis.l2.chain_id' "$config_dir/rollup.json")
    if [ "$rollup_chain_id" != "$L2_CHAIN_ID" ]; then
        error "Chain ID mismatch in rollup.json: expected $L2_CHAIN_ID, got $rollup_chain_id"
    fi
    
    local rollup_l1_chain_id=$(jq -r '.genesis.l1.chain_id' "$config_dir/rollup.json")
    if [ "$rollup_l1_chain_id" != "$L1_CHAIN_ID" ]; then
        error "L1 Chain ID mismatch in rollup.json: expected $L1_CHAIN_ID, got $rollup_l1_chain_id"
    fi
    
    log "Deployment verification passed"
}

# Function to create deployment summary
create_deployment_summary() {
    log "Creating deployment summary..."
    
    local summary_file="/opt/sensei-chain/DEPLOYMENT_SUMMARY.md"
    
    cat > "$summary_file" << EOF
# Sensei Chain L1 Deployment Summary

## Deployment Information
- **Chain Name**: $CHAIN_NAME
- **L1 Chain ID**: $L1_CHAIN_ID (Ethereum Sepolia)
- **L2 Chain ID**: $L2_CHAIN_ID
- **Deployment Date**: $(date)
- **Deployer**: $(cast wallet address --private-key "$DEPLOYER_KEY")

## Contract Addresses
EOF
    
    # Add contract addresses
    if [ -f "/opt/sensei-chain/configs/contract-addresses.txt" ]; then
        cat /opt/sensei-chain/configs/contract-addresses.txt >> "$summary_file"
    fi
    
    cat >> "$summary_file" << EOF

## Configuration Files
- **genesis.json**: /opt/sensei-chain/configs/genesis.json
- **rollup.json**: /opt/sensei-chain/configs/rollup.json
- **Deploy Config**: /opt/sensei-chain/optimism/packages/contracts-bedrock/deploy-config/sensei-sepolia.json

## Wallet Addresses
- **Sequencer**: $(cat /opt/sensei-chain/keys/sequencer_address)
- **Batcher**: $(cat /opt/sensei-chain/keys/batcher_address)
- **Proposer**: $(cat /opt/sensei-chain/keys/proposer_address)

## Next Steps
1. Copy genesis.json and rollup.json to all droplets
2. Initialize op-geth with genesis.json
3. Start the OP Stack components
4. Verify chain is producing blocks

## Verification Commands
\`\`\`bash
# Check L1 contract deployment
cast call <L2OutputOracle> "CHAINID()" --rpc-url $SEPOLIA_RPC_URL

# Verify genesis block
jq '.number' /opt/sensei-chain/configs/genesis.json

# Check rollup config
jq '.genesis.l2.chain_id' /opt/sensei-chain/configs/rollup.json
\`\`\`

## Security Notes
- Store private keys securely
- Monitor contract interactions
- Set up monitoring and alerting
- Regular security audits recommended

EOF
    
    log "Deployment summary created: $summary_file"
}

# Function to get deployer key
get_deployer_key() {
    if [ -z "$DEPLOYER_KEY" ]; then
        if [ -n "$SENSEI_DEPLOYER_KEY" ]; then
            DEPLOYER_KEY="$SENSEI_DEPLOYER_KEY"
        else
            error "Deployer private key not provided. Set SENSEI_DEPLOYER_KEY environment variable or provide it interactively."
        fi
    fi
}

# Main function
main() {
    log "Starting Sensei OP Stack L1 contract deployment..."
    
    # Check dependencies
    check_dependencies
    
    # Get deployer key
    get_deployer_key
    
    # Check deployer balance
    check_deployer_balance
    
    # Setup optimism repository
    setup_optimism_repo
    
    # Create deploy configuration
    create_deploy_config
    
    # Deploy L1 contracts
    deploy_l1_contracts
    
    # Extract deployment artifacts
    extract_deployment_artifacts
    
    # Generate genesis and rollup configs
    generate_configs
    
    # Verify deployment
    verify_deployment
    
    # Create deployment summary
    create_deployment_summary
    
    log "L1 contract deployment completed successfully!"
    log "Next steps:"
    log "1. Copy configs to all droplets"
    log "2. Start OP Stack components"
    log "3. Verify chain operation"
}

# Run main function
main "$@"
