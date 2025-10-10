#!/bin/bash

# Sensei OP Stack Local Deployment Script
# This script can be run locally on each droplet to set up the OP Stack components

set -e

# Configuration
ROLE=${1:-"unknown"}  # sequencer, batcher, proposer, replica, explorer, monitoring
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

# Function to install Docker
install_docker() {
    log "Installing Docker..."
    
    # Update package index
    apt-get update
    
    # Install prerequisites
    apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        git \
        make \
        build-essential \
        jq \
        ufw \
        chrony
    
    # Add Docker's official GPG key
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Set up the repository
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    # Add current user to docker group
    usermod -aG docker $USER
    
    log "Docker installed successfully"
}

# Function to setup time synchronization
setup_time_sync() {
    log "Setting up time synchronization with chrony..."
    
    # Configure chrony for better time sync
    cat > /etc/chrony/chrony.conf << EOF
# Use Digital Ocean NTP servers
pool 0.pool.ntp.org iburst
pool 1.pool.ntp.org iburst
pool 2.pool.ntp.org iburst
pool 3.pool.ntp.org iburst

# Allow chrony to step the clock if needed
makestep 1.0 3

# Enable kernel synchronization
rtcsync

# Log directory
logdir /var/log/chrony
EOF
    
    systemctl restart chronyd
    systemctl enable chronyd
    
    log "Time synchronization configured"
}

# Function to create directory structure
setup_directories() {
    log "Creating directory structure..."
    
    mkdir -p /opt/sensei-chain/{configs,data,jwt,logs,scripts,monitoring,nginx}
    mkdir -p /opt/sensei-chain/data/{geth-sequencer,geth-replica-1,geth-replica-2}
    
    # Set proper permissions
    chown -R $USER:$USER /opt/sensei-chain
    chmod -R 755 /opt/sensei-chain
    
    log "Directory structure created"
}

# Function to generate JWT secret
generate_jwt_secret() {
    log "Generating JWT secret..."
    
    openssl rand -hex 32 | tr -d "\n" > /opt/sensei-chain/jwt/l2.jwt
    chmod 600 /opt/sensei-chain/jwt/l2.jwt
    
    log "JWT secret generated"
}

# Function to setup firewall
setup_firewall() {
    log "Setting up UFW firewall..."
    
    # Reset UFW
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH
    ufw allow 22/tcp
    
    # Role-specific firewall rules
    case $ROLE in
        "sequencer")
            ufw allow from 10.0.0.0/8 to any port 8545  # HTTP RPC (private)
            ufw allow from 10.0.0.0/8 to any port 8551  # Engine API (private)
            ufw allow from 10.0.0.0/8 to any port 9545  # Rollup RPC (private)
            ufw allow from 10.0.0.0/8 to any port 6060  # Metrics (private)
            ufw allow from 10.0.0.0/8 to any port 7300  # Node metrics (private)
            ;;
        "replica")
            ufw allow 8545/tcp  # HTTP RPC (public)
            ufw allow 8546/tcp  # WebSocket RPC (public)
            ufw allow from 10.0.0.0/8 to any port 6060  # Metrics (private)
            ufw allow from 10.0.0.0/8 to any port 7300  # Node metrics (private)
            ;;
        "batcher"|"proposer")
            ufw allow from 10.0.0.0/8 to any port 7301  # Batcher metrics (private)
            ufw allow from 10.0.0.0/8 to any port 7302  # Proposer metrics (private)
            ;;
        "explorer")
            ufw allow 80/tcp   # HTTP
            ufw allow 443/tcp  # HTTPS
            ufw allow 4000/tcp # Blockscout
            ;;
        "monitoring")
            ufw allow 3000/tcp  # Grafana
            ufw allow 9090/tcp  # Prometheus
            ufw allow 3100/tcp  # Loki
            ;;
    esac
    
    # Enable firewall
    ufw --force enable
    
    log "Firewall configured for role: $ROLE"
}

# Function to create environment file
create_env_file() {
    log "Creating environment file for role: $ROLE"
    
    case $ROLE in
        "sequencer")
            cat > /opt/sensei-chain/.env << EOF
# Sensei OP Stack Environment - Sequencer
L1_RPC_URL=https://sepolia.gateway.tenderly.co
L1_CHAIN_ID=11155111
L2_CHAIN_ID=22222
L2_BLOCK_TIME=2

# Wallet Keys (will be copied from local)
SENSEI_SEQUENCER_KEY=placeholder
SENSEI_BATCHER_KEY=placeholder
SENSEI_PROPOSER_KEY=placeholder

# System Configuration
FINAL_SYSTEM_OWNER=placeholder
BASE_FEE_VAULT_RECIPIENT=placeholder
L1_FEE_VAULT_RECIPIENT=placeholder
SEQUENCER_FEE_VAULT_RECIPIENT=placeholder

# Monitoring
GRAFANA_ADMIN_PASSWORD=admin123
EOF
            ;;
        "batcher")
            cat > /opt/sensei-chain/.env << EOF
# Sensei OP Stack Environment - Batcher
L1_RPC_URL=https://sepolia.gateway.tenderly.co
L2_RPC_URL=http://localhost:8545
ROLLUP_RPC_URL=http://localhost:9545

# Wallet Keys
SENSEI_BATCHER_KEY=placeholder

# Monitoring
GRAFANA_ADMIN_PASSWORD=admin123
EOF
            ;;
        "proposer")
            cat > /opt/sensei-chain/.env << EOF
# Sensei OP Stack Environment - Proposer
L1_RPC_URL=https://sepolia.gateway.tenderly.co
L2_RPC_URL=http://localhost:8545
ROLLUP_RPC_URL=http://localhost:9545

# Wallet Keys
SENSEI_PROPOSER_KEY=placeholder

# Monitoring
GRAFANA_ADMIN_PASSWORD=admin123
EOF
            ;;
        "replica")
            cat > /opt/sensei-chain/.env << EOF
# Sensei OP Stack Environment - Replica
L1_RPC_URL=https://sepolia.gateway.tenderly.co
L2_RPC_URL=http://localhost:8545
L2_WS_URL=ws://localhost:8546
SEQUENCER_PEER_ADDR=/ip4/46.101.152.146/tcp/9222/p2p/SEQUENCER_PEER_ID

# Monitoring
GRAFANA_ADMIN_PASSWORD=admin123
EOF
            ;;
        "explorer")
            cat > /opt/sensei-chain/.env << EOF
# Sensei OP Stack Environment - Explorer
L1_RPC_URL=https://sepolia.gateway.tenderly.co
L2_RPC_URL=http://46.101.152.146:8545
L2_WS_URL=ws://46.101.152.146:8546
L2_CHAIN_ID=22222

# Database Configuration
POSTGRES_USER=sensei
POSTGRES_PASSWORD=sensei123
POSTGRES_DB=sensei_explorer

# Security
SECRET_KEY_BASE=sensei_secret_key_base_12345

# Monitoring
GRAFANA_ADMIN_PASSWORD=admin123
EOF
            ;;
        "monitoring")
            cat > /opt/sensei-chain/.env << EOF
# Sensei OP Stack Environment - Monitoring
GRAFANA_ADMIN_PASSWORD=admin123
EOF
            ;;
    esac
    
    log "Environment file created for role: $ROLE"
}

# Function to create monitoring configs
create_monitoring_configs() {
    log "Creating monitoring configurations..."
    
    # Prometheus config
    cat > /opt/sensei-chain/monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'op-geth'
    static_configs:
      - targets: ['localhost:6060']
    scrape_interval: 10s
    metrics_path: /debug/metrics/prometheus

  - job_name: 'op-node'
    static_configs:
      - targets: ['localhost:7300']
    scrape_interval: 10s
EOF

    # Loki config
    cat > /opt/sensei-chain/monitoring/loki-config.yml << EOF
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096

common:
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
  max_cache_freshness_per_query: 10m
  split_queries_by_interval: 15m
  max_query_parallelism: 32
  max_streams_per_user: 0
  max_line_size: 256000

chunk_store_config:
  max_look_back_period: 0s

table_manager:
  retention_deletes_enabled: true
  retention_period: 744h

compactor:
  working_directory: /loki
  shared_store: filesystem
  compaction_interval: 10m
  retention_enabled: true
  retention_delete_delay: 2h
  retention_delete_worker_count: 150

analytics:
  reporting_enabled: false
EOF

    # Promtail config
    cat > /opt/sensei-chain/monitoring/promtail-config.yml << EOF
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: sensei-chain-logs
    static_configs:
      - targets:
          - localhost
        labels:
          job: sensei-chain
          __path__: /var/log/sensei/*.log

    pipeline_stages:
      - json:
          expressions:
            timestamp: timestamp
            level: level
            msg: msg
            service: service
            component: component

      - timestamp:
          source: timestamp
          format: RFC3339

      - labels:
          level:
          service:
          component:

      - output:
          source: msg
EOF

    log "Monitoring configurations created"
}

# Function to create health check script
create_health_check_script() {
    log "Creating health check script..."
    
    cat > /opt/sensei-chain/scripts/health-check.sh << 'EOF'
#!/bin/bash

# Health check script for Sensei chain components

ROLE=${1:-"unknown"}
LOG_FILE="/opt/sensei-chain/logs/health-check.log"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

check_docker_services() {
    log "Checking Docker services..."
    
    if ! docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "Up"; then
        log "ERROR: No Docker services are running"
        return 1
    fi
    
    log "Docker services status:"
    docker ps --format "table {{.Names}}\t{{.Status}}" | tee -a $LOG_FILE
    return 0
}

check_rpc_endpoint() {
    if [ "$ROLE" = "sequencer" ] || [ "$ROLE" = "replica" ]; then
        log "Checking RPC endpoint..."
        
        local rpc_url="http://localhost:8545"
        local response=$(curl -s -X POST \
            -H "Content-Type: application/json" \
            -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
            $rpc_url 2>/dev/null)
        
        if echo "$response" | jq -e '.result' > /dev/null 2>&1; then
            local chain_id=$(echo "$response" | jq -r '.result')
            log "RPC endpoint healthy, chain ID: $chain_id"
            return 0
        else
            log "ERROR: RPC endpoint not responding"
            return 1
        fi
    fi
}

# Main health check
main() {
    log "Starting health check for role: $ROLE"
    
    check_docker_services || exit 1
    check_rpc_endpoint || exit 1
    
    log "Health check completed successfully"
}

main "$@"
EOF
    
    chmod +x /opt/sensei-chain/scripts/health-check.sh
    
    # Add to crontab for regular health checks
    (crontab -l 2>/dev/null; echo "*/5 * * * * /opt/sensei-chain/scripts/health-check.sh $ROLE") | crontab -
    
    log "Health check script created and scheduled"
}

# Main deployment function
main() {
    log "Starting Sensei OP Stack local deployment for role: $ROLE"
    
    # Validate role
    case $ROLE in
        "sequencer"|"batcher"|"proposer"|"replica"|"explorer"|"monitoring")
            log "Valid role: $ROLE"
            ;;
        *)
            error "Invalid role: $ROLE. Valid roles: sequencer, batcher, proposer, replica, explorer, monitoring"
            ;;
    esac
    
    # Run as root for system-level changes
    if [ "$EUID" -ne 0 ]; then
        error "This script must be run as root"
    fi
    
    # Install dependencies
    install_docker
    setup_time_sync
    setup_directories
    
    # Generate JWT secret (needed for all roles)
    generate_jwt_secret
    
    # Setup firewall
    setup_firewall
    
    # Create environment file
    create_env_file
    
    # Create monitoring configs
    create_monitoring_configs
    
    # Create health check script
    create_health_check_script
    
    log "Base system setup completed for role: $ROLE"
    log "Next steps:"
    log "1. Copy the appropriate Docker Compose file for this role"
    log "2. Copy configuration files (genesis.json, rollup.json, keys)"
    log "3. Update environment variables with actual values"
    log "4. Start the services with: docker compose up -d"
    
    # Create a completion marker
    touch /opt/sensei-chain/.deployment-complete-$ROLE
    
    log "Local deployment script completed successfully!"
}

# Run main function
main "$@"
