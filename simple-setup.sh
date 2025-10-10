#!/bin/bash

# Simplified OPchain Sepolia + Blockscout Setup
set -e

echo "Starting simplified OPchain Sepolia setup..."

# Update system
apt update && apt upgrade -y

# Install essential dependencies
apt install -y curl wget git build-essential nginx postgresql postgresql-contrib \
    redis-server nodejs npm python3 python3-pip supervisor

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Setup PostgreSQL
sudo -u postgres psql -c "CREATE USER blockscout WITH PASSWORD 'blockscout123';"
sudo -u postgres psql -c "CREATE DATABASE blockscout OWNER blockscout;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE blockscout TO blockscout;"

# Start services
systemctl start postgresql
systemctl start redis-server
systemctl enable postgresql
systemctl enable redis-server

# Configure firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8545/tcp
ufw --force enable

# Create opchain user
useradd -m -s /bin/bash opchain
usermod -aG docker opchain

# Create directories
mkdir -p /opt/opchain
mkdir -p /opt/blockscout
chown -R opchain:opchain /opt/opchain
chown -R opchain:opchain /opt/blockscout

# Install OPchain using Docker (simpler approach)
cd /opt/opchain
sudo -u opchain git clone https://github.com/ethereum-optimism/optimism.git
cd optimism

# Create simple OPchain config
sudo -u opchain mkdir -p /opt/opchain/config
cat > /opt/opchain/config/op-node-config.yaml << 'EOF'
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

# Install Blockscout using Docker
cd /opt/blockscout
sudo -u opchain git clone https://github.com/blockscout/blockscout.git
cd blockscout

# Create simple Blockscout environment
cat > /opt/blockscout/blockscout/.env << 'EOF'
DATABASE_URL=postgresql://blockscout:blockscout123@localhost:5432/blockscout
ETHEREUM_JSONRPC_HTTP_URL=http://localhost:8545
ETHEREUM_JSONRPC_WS_URL=ws://localhost:8546
NETWORK=OPchain Sepolia
SUBNETWORK=Testnet
NETWORK_DISPLAY_NAME=OPchain Sepolia
NETWORK_ID=11155420
COIN=ETH
COIN_NAME=Ethereum
COIN_SYMBOL=ETH
REDIS_URL=redis://localhost:6379
SECRET_KEY_BASE=your_secret_key_base_here
EOF

chown opchain:opchain /opt/blockscout/blockscout/.env

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
    }
}
EOF

ln -sf /etc/nginx/sites-available/blockscout /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
systemctl enable nginx
systemctl start nginx

echo "Basic setup completed!"
echo "Next steps:"
echo "1. Configure Infura key in /opt/opchain/config/op-node-config.yaml"
echo "2. Start OPchain node"
echo "3. Start Blockscout"
echo "4. Access at http://$(curl -s ifconfig.me)"
