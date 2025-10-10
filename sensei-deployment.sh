#!/bin/bash

# Sensei OP Stack Deployment Script
# This script sets up the OP Stack components on each droplet

set -e

# Configuration
ROLE=${1:-"unknown"}  # sequencer, batcher, proposer, replica, explorer, monitoring
CHAIN_NAME="Sensei"
L2_CHAIN_ID="22222"
L1_CHAIN_ID="11155111"
DOMAIN="yourdomain.com"  # Replace with your actual domain

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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
    
    mkdir -p /opt/sensei-chain/{configs,data,jwt,logs,scripts}
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

# Function to create systemd service for Docker Compose
create_systemd_service() {
    local service_name=$1
    local compose_file=$2
    
    cat > /etc/systemd/system/$service_name.service << EOF
[Unit]
Description=$service_name Docker Compose Service
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/sensei-chain
ExecStart=/usr/bin/docker compose -f $compose_file up -d
ExecStop=/usr/bin/docker compose -f $compose_file down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF
    
    systemctl daemon-reload
    systemctl enable $service_name
    
    log "Systemd service $service_name created and enabled"
}

# Function to setup log rotation
setup_log_rotation() {
    log "Setting up log rotation..."
    
    cat > /etc/logrotate.d/sensei-chain << EOF
/opt/sensei-chain/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        /usr/bin/docker compose -f /opt/sensei-chain/docker-compose.yml restart > /dev/null 2>&1 || true
    endscript
}
EOF
    
    log "Log rotation configured"
}

# Function to create monitoring script
create_monitoring_script() {
    log "Creating monitoring script..."
    
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

check_metrics() {
    log "Checking metrics endpoints..."
    
    case $ROLE in
        "sequencer"|"replica")
            curl -s http://localhost:6060/metrics > /dev/null && log "Geth metrics OK" || log "WARNING: Geth metrics not accessible"
            curl -s http://localhost:7300/metrics > /dev/null && log "Node metrics OK" || log "WARNING: Node metrics not accessible"
            ;;
        "batcher")
            curl -s http://localhost:7301/metrics > /dev/null && log "Batcher metrics OK" || log "WARNING: Batcher metrics not accessible"
            ;;
        "proposer")
            curl -s http://localhost:7302/metrics > /dev/null && log "Proposer metrics OK" || log "WARNING: Proposer metrics not accessible"
            ;;
    esac
}

# Main health check
main() {
    log "Starting health check for role: $ROLE"
    
    check_docker_services || exit 1
    check_rpc_endpoint || exit 1
    check_metrics
    
    log "Health check completed successfully"
}

main "$@"
EOF
    
    chmod +x /opt/sensei-chain/scripts/health-check.sh
    
    # Add to crontab for regular health checks
    (crontab -l 2>/dev/null; echo "*/5 * * * * /opt/sensei-chain/scripts/health-check.sh $ROLE") | crontab -
    
    log "Monitoring script created and scheduled"
}

# Main deployment function
main() {
    log "Starting Sensei OP Stack deployment for role: $ROLE"
    
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
    
    # Setup log rotation
    setup_log_rotation
    
    # Create monitoring script
    create_monitoring_script
    
    log "Base system setup completed for role: $ROLE"
    log "Next steps:"
    log "1. Copy the appropriate Docker Compose file for this role"
    log "2. Configure environment variables"
    log "3. Start the services with: docker compose up -d"
    
    # Create a completion marker
    touch /opt/sensei-chain/.deployment-complete-$ROLE
    
    log "Deployment script completed successfully!"
}

# Run main function
main "$@"
