#!/bin/bash

# OPchain Sepolia Testnet + Blockscout Auto-Setup Script
# This script runs automatically when the droplet boots

set -e

# Log everything
exec > >(tee /var/log/user-data.log) 2>&1
echo "Starting OPchain Sepolia testnet and Blockscout setup at $(date)"

# Update system
apt update && apt upgrade -y

# Install dependencies
apt install -y curl wget git build-essential software-properties-common \
    ca-certificates gnupg lsb-release nginx postgresql postgresql-contrib \
    redis-server nodejs npm python3 python3-pip supervisor jq

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Install Go
wget https://go.dev/dl/go1.21.5.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile
export PATH=$PATH:/usr/local/go/bin

# Create opchain user
useradd -m -s /bin/bash opchain
usermod -aG docker opchain

# Setup PostgreSQL
sudo -u postgres psql -c "CREATE USER blockscout WITH PASSWORD 'blockscout_password';"
sudo -u postgres psql -c "CREATE DATABASE blockscout OWNER blockscout;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE blockscout TO blockscout;"

# Configure Redis
systemctl enable redis-server
systemctl start redis-server

# Create directories
mkdir -p /opt/opchain
mkdir -p /opt/blockscout
chown -R opchain:opchain /opt/opchain
chown -R opchain:opchain /opt/blockscout

# Install OPchain node (using Optimism's op-node)
cd /opt/opchain
sudo -u opchain git clone https://github.com/ethereum-optimism/optimism.git
cd optimism
sudo -u opchain make op-node
sudo -u opchain make op-batcher
sudo -u opchain make op-proposer

# Create OPchain configuration
sudo -u opchain mkdir -p /opt/opchain/config
sudo -u opchain mkdir -p /opt/opchain/data

# Create OPchain Sepolia config
cat > /opt/opchain/config/op-node-config.yaml << 'EOF'
# OPchain Sepolia Testnet Configuration
network: sepolia
l1-rpc-url: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
l2-rpc-url: http://localhost:8545
l2-engine-url: http://localhost:8551
jwt-secret: /opt/opchain/config/jwt-secret
sequencer-p2p: /ip4/0.0.0.0/tcp/9222
sequencer-rpc: http://0.0.0.0:8547
sequencer-l1-confs: 3
proposer-rpc: http://0.0.0.0:8560
proposer-l1-confs: 3
batcher-rpc: http://0.0.0.0:8548
batcher-l1-confs: 3
EOF

# Generate JWT secret
openssl rand -hex 32 > /opt/opchain/config/jwt-secret
chown opchain:opchain /opt/opchain/config/jwt-secret
chmod 600 /opt/opchain/config/jwt-secret

# Create systemd service for OPchain node
cat > /etc/systemd/system/op-node.service << 'EOF'
[Unit]
Description=OPchain Node
After=network.target

[Service]
Type=simple
User=opchain
WorkingDirectory=/opt/opchain
ExecStart=/opt/opchain/optimism/op-node/bin/op-node --config=/opt/opchain/config/op-node-config.yaml
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Install Blockscout
cd /opt/blockscout
sudo -u opchain git clone https://github.com/blockscout/blockscout.git
cd blockscout

# Create Blockscout environment file
cat > /opt/blockscout/blockscout/.env << 'EOF'
# Database
DATABASE_URL=postgresql://blockscout:blockscout_password@localhost:5432/blockscout
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blockscout
DB_USER=blockscout
DB_PASS=blockscout_password

# Ethereum
ETHEREUM_JSONRPC_HTTP_URL=http://localhost:8545
ETHEREUM_JSONRPC_WS_URL=ws://localhost:8546
ETHEREUM_JSONRPC_TRACE_URL=http://localhost:8545

# Network
NETWORK=OPchain Sepolia
SUBNETWORK=Testnet
NETWORK_ICON=/images/optimism.svg
NETWORK_DISPLAY_NAME=OPchain Sepolia
NETWORK_PATH=/
NETWORK_SHORT_NAME=OP-Sepolia
NETWORK_ID=11155420

# Explorer
EXPLORER_TITLE=OPchain Sepolia Explorer
EXPLORER_SUB_TITLE=Testnet Explorer
EXPLORER_DESCRIPTION=Block explorer for OPchain Sepolia testnet

# API
API_V1_ENABLED=true
API_V2_ENABLED=true

# Cache
REDIS_URL=redis://localhost:6379

# Other
COIN=ETH
COIN_NAME=Ethereum
COIN_SYMBOL=ETH
COIN_DECIMALS=18
COIN_BALANCE_CACHE_PERIOD=10
COIN_PRICE_CACHE_PERIOD=60
COIN_PRICE_PROVIDER=coin_gecko
COIN_PRICE_COINGECKO_COIN_ID=ethereum

# Security
SECRET_KEY_BASE=your_secret_key_base_here
SOCKET_ROOT=ws://localhost:4000/socket

# Performance
HEART_BEAT_TIMEOUT=30
HEART_COMMAND=systemctl status op-node
HEART_ENABLED=true
HEART_INTERVAL=60
HEART_MINIMUM_BLOCK_NUMBER=1
HEART_RESTART_COMMAND=systemctl restart op-node
HEART_RESTART_EXIT_CODE=1
HEART_RESTART_RETRIES=3
HEART_RESTART_TIMEOUT=30

# Indexer
BLOCKSCOUT_VERSION=5.0.0
INDEXER_DISABLE_PENDING_TRANSACTIONS_FETCHER=true
INDEXER_DISABLE_INTERNAL_TRANSACTIONS_FETCHER=true
INDEXER_DISABLE_BLOCK_REWARD_FETCHER=true
INDEXER_DISABLE_EMPTY_BLOCK_SANITIZER=true
INDEXER_DISABLE_CSV_EXPORT=true
INDEXER_DISABLE_KNOWN_TOKENS=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_STARTUP=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_SHUTDOWN=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RESTART=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_ERROR=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_TIMEOUT=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_INTERRUPT=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_TERMINATE=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_KILL=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_QUIT=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_HUP=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_USR1=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_USR2=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_WINCH=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_PIPE=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_ALRM=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_TERM=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_CHLD=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_CONT=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_STOP=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_TSTP=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_TTIN=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_TTOU=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_URG=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_XCPU=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_XFSZ=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_VTALRM=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_PROF=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_WAITPIPE=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_LOST=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_POLL=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_PWR=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_SYS=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTBG=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMIN=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-1=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-2=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-3=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-4=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-5=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-6=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-7=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-8=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-9=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-10=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-11=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-12=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-13=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-14=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-15=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-16=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-17=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-18=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-19=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-20=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-21=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-22=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-23=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-24=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-25=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-26=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-27=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-28=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-29=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-30=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-31=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-32=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-33=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-34=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-35=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-36=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-37=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-38=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-39=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-40=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-41=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-42=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-43=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-44=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-45=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-46=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-47=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-48=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-49=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-50=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-51=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-52=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-53=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-54=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-55=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-56=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-57=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-58=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-59=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-60=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-61=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-62=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-63=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-64=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-65=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-66=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-67=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-68=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-69=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-70=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-71=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-72=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-73=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-74=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-75=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-76=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-77=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-78=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-79=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-80=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-81=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-82=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-83=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-84=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-85=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-86=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-87=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-88=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-89=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-90=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-91=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-92=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-93=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-94=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-95=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-96=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-97=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-98=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-99=true
INDEXER_DISABLE_KNOWN_TOKENS_UPDATE_ON_RTMAX-100=true
EOF

chown opchain:opchain /opt/blockscout/blockscout/.env

# Install Blockscout dependencies
cd /opt/blockscout/blockscout
sudo -u opchain mix deps.get
sudo -u opchain mix deps.compile

# Create Blockscout systemd service
cat > /etc/systemd/system/blockscout.service << 'EOF'
[Unit]
Description=Blockscout Explorer
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=opchain
WorkingDirectory=/opt/blockscout/blockscout
ExecStart=/usr/bin/mix phx.server
Restart=always
RestartSec=10
Environment=MIX_ENV=prod

[Install]
WantedBy=multi-user.target
EOF

# Configure Nginx
cat > /etc/nginx/sites-available/blockscout << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/blockscout /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Configure firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8545/tcp
ufw allow 8546/tcp
ufw allow 8547/tcp
ufw allow 8548/tcp
ufw allow 8551/tcp
ufw allow 8560/tcp
ufw allow 9222/tcp
ufw --force enable

# Enable and start services
systemctl daemon-reload
systemctl enable op-node
systemctl enable blockscout
systemctl enable nginx
systemctl enable postgresql
systemctl enable redis-server

# Start services
systemctl start postgresql
systemctl start redis-server
systemctl start nginx

# Create a simple startup script
cat > /opt/start-services.sh << 'EOF'
#!/bin/bash
echo "Starting OPchain and Blockscout services..."

# Start OPchain node
systemctl start op-node
sleep 30

# Initialize Blockscout database
cd /opt/blockscout/blockscout
sudo -u opchain mix ecto.create
sudo -u opchain mix ecto.migrate

# Start Blockscout
systemctl start blockscout

echo "Services started. Check status with:"
echo "systemctl status op-node"
echo "systemctl status blockscout"
echo "systemctl status nginx"
EOF

chmod +x /opt/start-services.sh

echo "Setup completed at $(date)"
echo "To start services, run: /opt/start-services.sh"
echo "OPchain RPC will be available at: http://$(curl -s ifconfig.me):8545"
echo "Blockscout Explorer will be available at: http://$(curl -s ifconfig.me)"
