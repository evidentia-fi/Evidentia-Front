#!/bin/bash

# Mock Sensei OP Stack L1 Contract Deployment Script
# This script creates mock deployment artifacts for testing

set -e

# Configuration
CHAIN_NAME="Sensei"
L2_CHAIN_ID="22222"
L1_CHAIN_ID="11155111"

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

# Function to create mock deployment artifacts
create_mock_artifacts() {
    log "Creating mock deployment artifacts..."
    
    # Create configs directory
    mkdir -p ./sensei-chain/configs
    
    # Read wallet addresses
    local sequencer_addr=$(cat ./sensei-chain/keys/sequencer_address)
    local batcher_addr=$(cat ./sensei-chain/keys/batcher_address)
    local proposer_addr=$(cat ./sensei-chain/keys/proposer_address)
    local system_owner=$sequencer_addr
    
    log "Using addresses:"
    log "  Sequencer: $sequencer_addr"
    log "  Batcher: $batcher_addr"
    log "  Proposer: $proposer_addr"
    log "  System Owner: $system_owner"
    
    # Create mock contract addresses
    local l2_output_oracle="0x1234567890123456789012345678901234567890"
    local system_config="0x2345678901234567890123456789012345678901"
    local optimism_portal="0x3456789012345678901234567890123456789012"
    local l1_standard_bridge="0x4567890123456789012345678901234567890123"
    
    # Save contract addresses
    cat > ./sensei-chain/configs/contract-addresses.txt << EOF
L2OutputOracleProxy=$l2_output_oracle
SystemConfigProxy=$system_config
OptimismPortalProxy=$optimism_portal
L1StandardBridgeProxy=$l1_standard_bridge
EOF
    
    log "Contract addresses saved to: ./sensei-chain/configs/contract-addresses.txt"
}

# Function to generate mock genesis.json
generate_mock_genesis() {
    log "Generating mock genesis.json..."
    
    local sequencer_addr=$(cat ./sensei-chain/keys/sequencer_address)
    local system_owner=$sequencer_addr
    
    cat > ./sensei-chain/configs/genesis.json << EOF
{
  "config": {
    "chainId": $L2_CHAIN_ID,
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
    "arrowGlacierBlock": 0,
    "grayGlacierBlock": 0,
    "mergeNetsplitBlock": 0,
    "shanghaiTime": 0,
    "cancunTime": 0,
    "terminalTotalDifficulty": "0x0",
    "terminalTotalDifficultyPassed": true,
    "optimism": {
      "eip1559Elasticity": 10,
      "eip1559Denominator": 50,
      "gasPriceOracleOverhead": 2100,
      "gasPriceOracleScalar": 1000000,
      "baseFeeRecipient": "$system_owner",
      "l1FeeRecipient": "$system_owner",
      "sequencerFeeVaultRecipient": "$system_owner"
    }
  },
  "nonce": "0x0",
  "timestamp": "0x0",
  "extraData": "0x",
  "gasLimit": "0x1c9c380",
  "difficulty": "0x0",
  "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "$sequencer_addr",
  "alloc": {
    "$sequencer_addr": {
      "balance": "0x200000000000000000000000000000000000000000000000000000000000000"
    },
    "$system_owner": {
      "balance": "0x200000000000000000000000000000000000000000000000000000000000000"
    }
  },
  "number": "0x0",
  "gasUsed": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
EOF
    
    log "Mock genesis.json generated: ./sensei-chain/configs/genesis.json"
}

# Function to generate mock rollup.json
generate_mock_rollup() {
    log "Generating mock rollup.json..."
    
    local sequencer_addr=$(cat ./sensei-chain/keys/sequencer_address)
    local batcher_addr=$(cat ./sensei-chain/keys/batcher_address)
    local proposer_addr=$(cat ./sensei-chain/keys/proposer_address)
    
    # Read mock contract addresses
    local l2_output_oracle=$(grep "L2OutputOracleProxy" ./sensei-chain/configs/contract-addresses.txt | cut -d= -f2)
    local system_config=$(grep "SystemConfigProxy" ./sensei-chain/configs/contract-addresses.txt | cut -d= -f2)
    local optimism_portal=$(grep "OptimismPortalProxy" ./sensei-chain/configs/contract-addresses.txt | cut -d= -f2)
    local l1_standard_bridge=$(grep "L1StandardBridgeProxy" ./sensei-chain/configs/contract-addresses.txt | cut -d= -f2)
    
    cat > ./sensei-chain/configs/rollup.json << EOF
{
  "genesis": {
    "l1": {
      "hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "number": 0,
      "timestamp": 0,
      "l1head": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "chain_id": $L1_CHAIN_ID
    },
    "l2": {
      "hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "number": 0,
      "timestamp": 0,
      "l1origin": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "sequence_number": 0,
      "chain_id": $L2_CHAIN_ID
    },
    "l2_time": 0,
    "system_config": {
      "batcher_addr": "$batcher_addr",
      "overhead": "0x834",
      "scalar": "0xf4240",
      "gas_limit": 30000000,
      "unsafe_block_signer": "$sequencer_addr"
    }
  },
  "block_time": 2,
  "max_sequencer_drift": 600,
  "seq_window_size": 3600,
  "channel_timeout": 300,
  "l1_chain_id": $L1_CHAIN_ID,
  "l2_chain_id": $L2_CHAIN_ID,
  "regolith_time": 0,
  "canyon_time": 0,
  "delta_time": 0,
  "ecotone_time": 0,
  "fjord_time": 0,
  "interop_time": 0,
  "batch_inbox_address": "$optimism_portal",
  "deposit_contract_address": "$optimism_portal",
  "l1_system_config_address": "$system_config",
  "l1_erc721_bridge": "$l1_standard_bridge",
  "l1_standard_bridge": "$l1_standard_bridge",
  "l1_cross_domain_messenger": "$optimism_portal",
  "l1_output_oracle": "$l2_output_oracle",
  "l1_portal": "$optimism_portal",
  "l2_output_oracle": "0x4200000000000000000000000000000000000010",
  "l2_to_l1_message_passer": "0x4200000000000000000000000000000000000016",
  "l2_cross_domain_messenger": "0x4200000000000000000000000000000000000007",
  "l2_standard_bridge": "0x4200000000000000000000000000000000000010",
  "l2_erc721_bridge": "0x4200000000000000000000000000000000000014",
  "l2_system_config": "0x4200000000000000000000000000000000000012",
  "l2_portal": "0x4200000000000000000000000000000000000016"
}
EOF
    
    log "Mock rollup.json generated: ./sensei-chain/configs/rollup.json"
}

# Function to create deployment summary
create_deployment_summary() {
    log "Creating deployment summary..."
    
    local summary_file="./sensei-chain/MOCK_DEPLOYMENT_SUMMARY.md"
    
    cat > "$summary_file" << EOF
# Sensei Chain Mock L1 Deployment Summary

## Deployment Information
- **Chain Name**: $CHAIN_NAME
- **L1 Chain ID**: $L1_CHAIN_ID (Ethereum Sepolia)
- **L2 Chain ID**: $L2_CHAIN_ID
- **Deployment Date**: $(date)
- **Deployer**: $(cat ./sensei-chain/keys/sequencer_address)

## Contract Addresses (Mock)
EOF
    
    # Add contract addresses
    if [ -f "./sensei-chain/configs/contract-addresses.txt" ]; then
        cat ./sensei-chain/configs/contract-addresses.txt >> "$summary_file"
    fi
    
    cat >> "$summary_file" << EOF

## Configuration Files
- **genesis.json**: ./sensei-chain/configs/genesis.json
- **rollup.json**: ./sensei-chain/configs/rollup.json

## Wallet Addresses
- **Sequencer**: $(cat ./sensei-chain/keys/sequencer_address)
- **Batcher**: $(cat ./sensei-chain/keys/batcher_address)
- **Proposer**: $(cat ./sensei-chain/keys/proposer_address)

## Next Steps
1. Copy configs to all droplets
2. Start OP Stack components
3. Verify chain is producing blocks

## Verification Commands
\`\`\`bash
# Verify genesis block
jq '.number' ./sensei-chain/configs/genesis.json

# Check rollup config
jq '.genesis.l2.chain_id' ./sensei-chain/configs/rollup.json
\`\`\`

## Security Notes
- This is a mock deployment for testing
- Store private keys securely
- Monitor contract interactions
- Set up monitoring and alerting
- Regular security audits recommended

EOF
    
    log "Deployment summary created: $summary_file"
}

# Main function
main() {
    log "Starting Sensei OP Stack mock L1 contract deployment..."
    
    # Create mock deployment artifacts
    create_mock_artifacts
    
    # Generate mock genesis and rollup configs
    generate_mock_genesis
    generate_mock_rollup
    
    # Create deployment summary
    create_deployment_summary
    
    log "Mock L1 contract deployment completed successfully!"
    log "Next steps:"
    log "1. Copy configs to all droplets"
    log "2. Start OP Stack components"
    log "3. Verify chain operation"
}

# Run main function
main "$@"
