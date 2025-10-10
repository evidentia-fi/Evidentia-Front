#!/bin/bash

# Minimal setup script for OPchain Sepolia + Blockscout
set -e

echo "Starting minimal OPchain setup at $(date)"

# Update system
apt update && apt upgrade -y

# Install basic dependencies
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

echo "Minimal setup completed at $(date)"
echo "Ready for manual configuration"
