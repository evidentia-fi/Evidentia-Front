# Sensei OP Stack Manual Deployment Guide

This guide provides step-by-step instructions for manually deploying the Sensei OP Stack to Digital Ocean droplets.

## Prerequisites

- 3 Digital Ocean droplets (we'll use existing ones)
- SSH access to each droplet
- Basic understanding of OP Stack architecture

## Droplet Information

Based on the existing droplets:

| Role | Droplet Name | IP Address | ID |
|------|-------------|------------|-----|
| Sequencer | Sensei-RPC | 46.101.152.146 | 521006452 |
| Batcher/Replica-1 | opchain-final | 159.65.227.204 | 523460777 |
| Proposer/Replica-2/Explorer | opchain-deployment | 157.230.86.209 | 523607907 |

## Deployment Steps

### Step 1: Prepare Local Files

First, ensure you have all the required files locally:

```bash
# Check that all files exist
ls -la sensei-chain/
ls -la docker-compose-*.yml
ls -la monitoring-configs/
ls -la nginx-configs/
```

### Step 2: Deploy to Sequencer (46.101.152.146)

```bash
# SSH to sequencer droplet
ssh root@46.101.152.146

# Run the local deployment script
curl -o sensei-local-deployment.sh https://raw.githubusercontent.com/your-repo/sensei-local-deployment.sh
chmod +x sensei-local-deployment.sh
./sensei-local-deployment.sh sequencer

# Copy configuration files
scp -r ./sensei-chain/configs/ root@46.101.152.146:/opt/sensei-chain/
scp -r ./sensei-chain/keys/ root@46.101.152.146:/opt/sensei-chain/
scp docker-compose-sequencer.yml root@46.101.152.146:/opt/sensei-chain/docker-compose.yml
scp -r monitoring-configs/ root@46.101.152.146:/opt/sensei-chain/monitoring/

# Update environment variables
ssh root@46.101.152.146 "cd /opt/sensei-chain && \
  sed -i 's/placeholder/$(cat keys/sequencer_private_key)/g' .env && \
  sed -i 's/placeholder/$(cat keys/batcher_private_key)/g' .env && \
  sed -i 's/placeholder/$(cat keys/proposer_private_key)/g' .env && \
  sed -i 's/placeholder/$(cat keys/sequencer_address)/g' .env"

# Start services
ssh root@46.101.152.146 "cd /opt/sensei-chain && docker compose up -d"
```

### Step 3: Deploy to Batcher (159.65.227.204)

```bash
# SSH to batcher droplet
ssh root@159.65.227.204

# Run the local deployment script
curl -o sensei-local-deployment.sh https://raw.githubusercontent.com/your-repo/sensei-local-deployment.sh
chmod +x sensei-local-deployment.sh
./sensei-local-deployment.sh batcher

# Copy configuration files
scp -r ./sensei-chain/configs/ root@159.65.227.204:/opt/sensei-chain/
scp -r ./sensei-chain/keys/ root@159.65.227.204:/opt/sensei-chain/
scp docker-compose-batcher.yml root@159.65.227.204:/opt/sensei-chain/docker-compose.yml
scp -r monitoring-configs/ root@159.65.227.204:/opt/sensei-chain/monitoring/

# Update environment variables
ssh root@159.65.227.204 "cd /opt/sensei-chain && \
  sed -i 's/placeholder/$(cat keys/batcher_private_key)/g' .env && \
  sed -i 's|http://localhost:8545|http://46.101.152.146:8545|g' .env && \
  sed -i 's|http://localhost:9545|http://46.101.152.146:9545|g' .env"

# Start services
ssh root@159.65.227.204 "cd /opt/sensei-chain && docker compose up -d"
```

### Step 4: Deploy to Proposer (157.230.86.209)

```bash
# SSH to proposer droplet
ssh root@157.230.86.209

# Run the local deployment script
curl -o sensei-local-deployment.sh https://raw.githubusercontent.com/your-repo/sensei-local-deployment.sh
chmod +x sensei-local-deployment.sh
./sensei-local-deployment.sh proposer

# Copy configuration files
scp -r ./sensei-chain/configs/ root@157.230.86.209:/opt/sensei-chain/
scp -r ./sensei-chain/keys/ root@157.230.86.209:/opt/sensei-chain/
scp docker-compose-proposer.yml root@157.230.86.209:/opt/sensei-chain/docker-compose.yml
scp -r monitoring-configs/ root@157.230.86.209:/opt/sensei-chain/monitoring/

# Update environment variables
ssh root@157.230.86.209 "cd /opt/sensei-chain && \
  sed -i 's/placeholder/$(cat keys/proposer_private_key)/g' .env && \
  sed -i 's|http://localhost:8545|http://46.101.152.146:8545|g' .env && \
  sed -i 's|http://localhost:9545|http://46.101.152.146:9545|g' .env"

# Start services
ssh root@157.230.86.209 "cd /opt/sensei-chain && docker compose up -d"
```

### Step 5: Deploy Replica to Batcher Droplet (159.65.227.204)

```bash
# SSH to batcher droplet (we'll also run a replica here)
ssh root@159.65.227.204

# Copy replica configuration
scp docker-compose-replica.yml root@159.65.227.204:/opt/sensei-chain/docker-compose-replica.yml
scp -r nginx-configs/ root@159.65.227.204:/opt/sensei-chain/nginx/

# Update replica environment
ssh root@159.65.227.204 "cd /opt/sensei-chain && \
  sed -i 's|/ip4/46.101.152.146/tcp/9222/p2p/SEQUENCER_PEER_ID|/ip4/46.101.152.146/tcp/9222/p2p/SEQUENCER_PEER_ID|g' .env"

# Start replica services
ssh root@159.65.227.204 "cd /opt/sensei-chain && docker compose -f docker-compose-replica.yml up -d"
```

### Step 6: Deploy Explorer to Proposer Droplet (157.230.86.209)

```bash
# SSH to proposer droplet (we'll also run explorer here)
ssh root@157.230.86.209

# Copy explorer configuration
scp docker-compose-explorer.yml root@157.230.86.209:/opt/sensei-chain/docker-compose-explorer.yml
scp -r nginx-configs/ root@157.230.86.209:/opt/sensei-chain/nginx/

# Update explorer environment
ssh root@157.230.86.209 "cd /opt/sensei-chain && \
  sed -i 's|http://46.101.152.146:8545|http://159.65.227.204:8545|g' .env && \
  sed -i 's|ws://46.101.152.146:8546|ws://159.65.227.204:8546|g' .env"

# Start explorer services
ssh root@157.230.86.209 "cd /opt/sensei-chain && docker compose -f docker-compose-explorer.yml up -d"
```

## Verification

### Check Sequencer
```bash
ssh root@46.101.152.146 "cd /opt/sensei-chain && docker compose ps"
ssh root@46.101.152.146 "cd /opt/sensei-chain && docker compose logs -f op-geth-sequencer"
```

### Check Batcher
```bash
ssh root@159.65.227.204 "cd /opt/sensei-chain && docker compose ps"
ssh root@159.65.227.204 "cd /opt/sensei-chain && docker compose logs -f op-batcher"
```

### Check Proposer
```bash
ssh root@157.230.86.209 "cd /opt/sensei-chain && docker compose ps"
ssh root@157.230.86.209 "cd /opt/sensei-chain && docker compose logs -f op-proposer"
```

### Test RPC Endpoint
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  http://159.65.227.204:8545
```

Expected response: `{"jsonrpc":"2.0","result":"0x56ce","id":1}` (22222 in hex)

### Test Explorer
```bash
curl http://157.230.86.209:4000/api/v1/health
```

## Service Endpoints

After deployment, you can access:

- **RPC HTTP**: `http://159.65.227.204:8545`
- **RPC WebSocket**: `ws://159.65.227.204:8546`
- **Explorer**: `http://157.230.86.209:4000`
- **Grafana**: `http://46.101.152.146:3000` (admin/admin123)
- **Prometheus**: `http://46.101.152.146:9090`

## Troubleshooting

### Common Issues

1. **Services not starting**
   ```bash
   # Check logs
   docker compose logs -f
   
   # Check environment variables
   cat .env
   
   # Restart services
   docker compose restart
   ```

2. **RPC not responding**
   ```bash
   # Check if op-geth is running
   docker ps | grep op-geth
   
   # Check firewall
   ufw status
   
   # Check logs
   docker logs sensei-op-geth-sequencer
   ```

3. **Explorer not indexing**
   ```bash
   # Check database
   docker exec sensei-postgres pg_isready
   
   # Check Blockscout logs
   docker logs sensei-blockscout
   ```

### Useful Commands

```bash
# Check service status
docker compose ps

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Check disk usage
df -h

# Check memory usage
free -h

# Check network connectivity
ping <target_ip>
```

## Next Steps

1. **Monitor the chain**: Watch for block production and batch submissions
2. **Set up alerts**: Configure monitoring alerts for failures
3. **Test transactions**: Send test transactions on the L2
4. **Backup configuration**: Save all configuration files
5. **Document endpoints**: Share RPC endpoints with users

## Security Notes

- Change default passwords in production
- Monitor wallet balances regularly
- Set up proper firewall rules
- Regular security updates
- Backup configuration and data

The deployment is now complete and ready for testing!
