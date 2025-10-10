#!/bin/bash

# Sensei OP Stack Deployment Orchestrator
# This script coordinates the deployment of all components across droplets

set -e

# Configuration
DROPLETS_FILE="droplets.txt"
CHAIN_NAME="Sensei"
L2_CHAIN_ID="22222"
L1_CHAIN_ID="11155111"
# DOMAIN configuration skipped for now

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

# Function to check if droplets file exists
check_droplets_file() {
    if [ ! -f "$DROPLETS_FILE" ]; then
        error "Droplets file not found: $DROPLETS_FILE"
        error "Please run the infrastructure setup script first"
    fi
    
    log "Found droplets file: $DROPLETS_FILE"
}

# Function to get droplet IP by name
get_droplet_ip() {
    local name=$1
    local ip=$(grep "^$name:" "$DROPLETS_FILE" | cut -d: -f3)
    if [ -z "$ip" ]; then
        error "Droplet IP not found for: $name"
    fi
    echo "$ip"
}

# Function to execute command on remote droplet
execute_remote() {
    local droplet_name=$1
    local command=$2
    local ip=$(get_droplet_ip "$droplet_name")
    
    log "Executing on $droplet_name ($ip): $command"
    
    ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
        root@"$ip" "$command"
}

# Function to copy files to remote droplet
copy_to_remote() {
    local droplet_name=$1
    local local_path=$2
    local remote_path=$3
    local ip=$(get_droplet_ip "$droplet_name")
    
    log "Copying to $droplet_name ($ip): $local_path -> $remote_path"
    
    scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
        -r "$local_path" root@"$ip":"$remote_path"
}

# Function to setup environment file
setup_env_file() {
    local droplet_name=$1
    local role=$2
    local ip=$(get_droplet_ip "$droplet_name")
    
    log "Setting up environment file for $droplet_name ($role)"
    
    # Create environment file based on role
    local env_content=""
    
    case $role in
        "sequencer")
            env_content="
# Sensei OP Stack Environment - Sequencer
L1_RPC_URL=https://sepolia.gateway.tenderly.co
L1_CHAIN_ID=11155111
L2_CHAIN_ID=22222
L2_BLOCK_TIME=2

# Wallet Keys
SENSEI_SEQUENCER_KEY=\$(cat /opt/sensei-chain/keys/sequencer_private_key)
SENSEI_BATCHER_KEY=\$(cat /opt/sensei-chain/keys/batcher_private_key)
SENSEI_PROPOSER_KEY=\$(cat /opt/sensei-chain/keys/proposer_private_key)

# System Configuration
FINAL_SYSTEM_OWNER=\$(cat /opt/sensei-chain/keys/sequencer_address)
BASE_FEE_VAULT_RECIPIENT=\$(cat /opt/sensei-chain/keys/sequencer_address)
L1_FEE_VAULT_RECIPIENT=\$(cat /opt/sensei-chain/keys/sequencer_address)
SEQUENCER_FEE_VAULT_RECIPIENT=\$(cat /opt/sensei-chain/keys/sequencer_address)

# Monitoring
GRAFANA_ADMIN_PASSWORD=admin123
"
            ;;
        "batcher")
            env_content="
# Sensei OP Stack Environment - Batcher
L1_RPC_URL=https://sepolia.gateway.tenderly.co
L2_RPC_URL=http://$(get_droplet_ip "sensei-sequencer"):8545
ROLLUP_RPC_URL=http://$(get_droplet_ip "sensei-sequencer"):9545

# Wallet Keys
SENSEI_BATCHER_KEY=\$(cat /opt/sensei-chain/keys/batcher_private_key)

# Monitoring
GRAFANA_ADMIN_PASSWORD=admin123
"
            ;;
        "proposer")
            env_content="
# Sensei OP Stack Environment - Proposer
L1_RPC_URL=https://sepolia.gateway.tenderly.co
L2_RPC_URL=http://$(get_droplet_ip "sensei-sequencer"):8545
ROLLUP_RPC_URL=http://$(get_droplet_ip "sensei-sequencer"):9545

# Wallet Keys
SENSEI_PROPOSER_KEY=\$(cat /opt/sensei-chain/keys/proposer_private_key)

# Monitoring
GRAFANA_ADMIN_PASSWORD=admin123
"
            ;;
        "replica")
            env_content="
# Sensei OP Stack Environment - Replica
L1_RPC_URL=https://sepolia.gateway.tenderly.co
L2_RPC_URL=http://localhost:8545
L2_WS_URL=ws://localhost:8546
SEQUENCER_PEER_ADDR=/ip4/$(get_droplet_ip "sensei-sequencer")/tcp/9222/p2p/SEQUENCER_PEER_ID

# Monitoring
GRAFANA_ADMIN_PASSWORD=admin123
"
            ;;
        "explorer")
            env_content="
# Sensei OP Stack Environment - Explorer
L1_RPC_URL=https://sepolia.gateway.tenderly.co
L2_RPC_URL=http://$(get_droplet_ip "sensei-replica-1"):8545
L2_WS_URL=ws://$(get_droplet_ip "sensei-replica-1"):8546
L2_CHAIN_ID=22222

# Database Configuration
POSTGRES_USER=sensei
POSTGRES_PASSWORD=sensei123
POSTGRES_DB=sensei_explorer

# Security
SECRET_KEY_BASE=sensei_secret_key_base_12345

# Monitoring
GRAFANA_ADMIN_PASSWORD=admin123
"
            ;;
    esac
    
    # Write environment file
    echo "$env_content" > "/tmp/sensei-$role.env"
    
    # Copy to remote droplet
    copy_to_remote "$droplet_name" "/tmp/sensei-$role.env" "/opt/sensei-chain/.env"
    
    # Clean up local file
    rm -f "/tmp/sensei-$role.env"
}

# Function to deploy to a specific droplet
deploy_to_droplet() {
    local droplet_name=$1
    local role=$2
    local ip=$(get_droplet_ip "$droplet_name")
    
    log "Deploying to $droplet_name ($role) at $ip"
    
    # Copy deployment script
    copy_to_remote "$droplet_name" "sensei-deployment.sh" "/tmp/"
    
    # Run deployment script
    execute_remote "$droplet_name" "chmod +x /tmp/sensei-deployment.sh && /tmp/sensei-deployment.sh $role"
    
    # Copy configuration files
    copy_to_remote "$droplet_name" "configs/" "/opt/sensei-chain/"
    copy_to_remote "$droplet_name" "keys/" "/opt/sensei-chain/"
    
    # Copy Docker Compose file
    copy_to_remote "$droplet_name" "docker-compose-$role.yml" "/opt/sensei-chain/docker-compose.yml"
    
    # Copy monitoring configs
    copy_to_remote "$droplet_name" "monitoring-configs/" "/opt/sensei-chain/monitoring/"
    
    # Copy Nginx configs
    copy_to_remote "$droplet_name" "nginx-configs/" "/opt/sensei-chain/nginx/"
    
    # Setup environment file
    setup_env_file "$droplet_name" "$role"
    
    # Start services
    execute_remote "$droplet_name" "cd /opt/sensei-chain && docker compose up -d"
    
    log "Deployment completed for $droplet_name"
}

# Function to verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Check sequencer
    local sequencer_ip=$(get_droplet_ip "sequencer")
    log "Checking sequencer at $sequencer_ip..."
    
    if curl -s -f "http://$sequencer_ip:8545" > /dev/null; then
        log "✓ Sequencer RPC is responding"
    else
        warn "✗ Sequencer RPC is not responding"
    fi
    
    # Check replicas
    for replica in replica-1 replica-2; do
        local replica_ip=$(get_droplet_ip "$replica")
        log "Checking $replica at $replica_ip..."
        
        if curl -s -f "http://$replica_ip:8545" > /dev/null; then
            log "✓ $replica RPC is responding"
        else
            warn "✗ $replica RPC is not responding"
        fi
    done
    
    # Check explorer
    local explorer_ip=$(get_droplet_ip "explorer")
    log "Checking explorer at $explorer_ip..."
    
    if curl -s -f "http://$explorer_ip:4000" > /dev/null; then
        log "✓ Explorer is responding"
    else
        warn "✗ Explorer is not responding"
    fi
    
    log "Deployment verification completed"
}

# Function to create deployment summary
create_deployment_summary() {
    log "Creating deployment summary..."
    
    local summary_file="DEPLOYMENT_SUMMARY.md"
    
    cat > "$summary_file" << EOF
# Sensei OP Stack Deployment Summary

## Deployment Information
- **Chain Name**: $CHAIN_NAME
- **L1 Chain ID**: $L1_CHAIN_ID (Ethereum Sepolia)
- **L2 Chain ID**: $L2_CHAIN_ID
- **Deployment Date**: $(date)
- **Domain**: $DOMAIN

## Droplet Information
EOF
    
    # Add droplet information
    while IFS=':' read -r name id ip; do
        echo "- **$name**: $ip (ID: $id)" >> "$summary_file"
    done < "$DROPLETS_FILE"
    
    cat >> "$summary_file" << EOF

## Service Endpoints
- **RPC HTTP**: http://$(get_droplet_ip "sensei-replica-1"):8545
- **RPC WebSocket**: ws://$(get_droplet_ip "sensei-replica-1"):8546
- **Explorer**: http://$(get_droplet_ip "sensei-explorer"):4000
- **Grafana**: http://$(get_droplet_ip "sensei-monitoring"):3000
- **Prometheus**: http://$(get_droplet_ip "sensei-monitoring"):9090

## Health Checks
\`\`\`bash
# Check RPC endpoint
curl -X POST -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \\
  http://$(get_droplet_ip "sensei-replica-1"):8545

# Check explorer
curl http://$(get_droplet_ip "sensei-explorer"):4000/api/v1/health
\`\`\`

## Next Steps
1. Test the chain with sample transactions
2. Configure monitoring alerts
3. Set up backup procedures
4. Monitor wallet balances and top up as needed

## Security Notes
- Change default passwords
- Configure firewall rules
- Set up monitoring alerts
- Regular security updates
- Monitor wallet balances

EOF
    
    log "Deployment summary created: $summary_file"
}

# Main deployment function
main() {
    log "Starting Sensei OP Stack deployment orchestration..."
    
    # Check prerequisites
    check_droplets_file
    
    # Deploy to each droplet in order
    log "Deploying to sequencer..."
    deploy_to_droplet "sensei-sequencer" "sequencer"
    
    log "Deploying to batcher..."
    deploy_to_droplet "sensei-batcher" "batcher"
    
    log "Deploying to proposer..."
    deploy_to_droplet "sensei-proposer" "proposer"
    
    log "Deploying to replica-1..."
    deploy_to_droplet "sensei-replica-1" "replica"
    
    log "Deploying to replica-2..."
    deploy_to_droplet "sensei-replica-2" "replica"
    
    log "Deploying to explorer..."
    deploy_to_droplet "sensei-explorer" "explorer"
    
    log "Deploying to monitoring..."
    deploy_to_droplet "sensei-monitoring" "monitoring"
    
    # Wait for services to start
    log "Waiting for services to start..."
    sleep 60
    
    # Verify deployment
    verify_deployment
    
    # Create deployment summary
    create_deployment_summary
    
    log "Sensei OP Stack deployment completed successfully!"
    log "Next steps:"
    log "1. Test the chain with sample transactions"
    log "2. Configure monitoring alerts"
    log "3. Monitor wallet balances"
    log "4. Set up backup procedures"
}

# Run main function
main "$@"
