#!/bin/bash

# OPchain Sepolia Testnet + Blockscout Setup Script
# Server IP: 134.209.221.167

set -e

echo "Starting OPchain Sepolia testnet and Blockscout setup..."

# Update system
apt update && apt upgrade -y

# Install dependencies
apt install -y curl wget git build-essential software-properties-common \
    ca-certificates gnupg lsb-release nginx postgresql postgresql-contrib \
    redis-server nodejs npm python3 python3-pip supervisor

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

echo "Basic system setup completed. Next: OPchain node installation..."
