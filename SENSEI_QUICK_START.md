# Sensei OP Stack Quick Start Guide

This guide provides a simplified setup for the Sensei OP Stack deployment without domain configuration.

## Prerequisites

- Digital Ocean account with API token
- `doctl` CLI tool installed
- SSH key configured in Digital Ocean
- Basic understanding of OP Stack architecture

## Quick Deployment Steps

### 1. Infrastructure Setup

```bash
# Make scripts executable
chmod +x *.sh

# Provision Digital Ocean droplets
./sensei-infrastructure-setup.sh
```

This creates:
- 1x Sequencer (8 vCPU, 32 GB RAM, 1 TB NVMe)
- 1x Batcher (4 vCPU, 8 GB RAM, 50 GB)
- 1x Proposer (4 vCPU, 8 GB RAM, 50 GB)
- 2x Replicas (8 vCPU, 32 GB RAM, 1 TB NVMe each)
- 1x Explorer (8 vCPU, 32 GB RAM, 1 TB NVMe)
- 1x Monitoring (4 vCPU, 8 GB RAM, 200 GB)

### 2. Wallet Generation

```bash
# Generate required EOA keys
./sensei-wallet-setup.sh
```

This creates three wallets:
- **Sequencer**: For block sequencing
- **Batcher**: For posting batches to L1 (needs funding)
- **Proposer**: For posting outputs to L1 (needs funding)

**Important**: Fund the batcher and proposer wallets with at least 0.1 ETH each on Sepolia.

### 3. L1 Contract Deployment

```bash
# Set your deployer private key
export SENSEI_DEPLOYER_KEY="your_deployer_private_key"

# Deploy L1 contracts to Sepolia
./sensei-l1-deployment.sh
```

This deploys the L1 contracts and generates:
- `genesis.json` - L2 genesis configuration
- `rollup.json` - Rollup configuration
- Contract addresses and deployment artifacts

### 4. Component Deployment

```bash
# Deploy all components
./sensei-deploy-orchestrator.sh
```

This deploys:
- Sequencer with op-geth and op-node
- Batcher service
- Proposer service
- Replica nodes for public RPC
- Blockscout explorer
- Monitoring stack (Prometheus, Grafana, Loki)

### 5. Test Deployment

```bash
# Test the deployed chain
./test-sensei-deployment.sh
```

This verifies:
- RPC endpoints are responding
- Chain ID is correct (22222)
- Block production is working
- Explorer is accessible
- Monitoring is working

## Access Points

After deployment, you can access:

- **RPC HTTP**: `http://<replica-ip>:8545`
- **RPC WebSocket**: `ws://<replica-ip>:8546`
- **Explorer**: `http://<explorer-ip>:4000`
- **Grafana**: `http://<monitoring-ip>:3000` (admin/admin123)
- **Prometheus**: `http://<monitoring-ip>:9090`

## Configuration Details

### Chain Configuration
- **Chain Name**: Sensei
- **L1**: Ethereum Sepolia (Chain ID: 11155111)
- **L2 Chain ID**: 22222
- **Currency**: SEN (L2 native)
- **Block Time**: 2-2.5 seconds
- **Data Availability**: On L1
- **Fault Proofs**: Enabled

### Public RPCs Used
- **L1 RPC**: `https://sepolia.gateway.tenderly.co`
- **L2 RPC**: Internal communication between components

### Default Passwords
- **Grafana**: admin123
- **PostgreSQL**: sensei123
- **Secret Key**: sensei_secret_key_base_12345

## Health Checks

### RPC Endpoint Test
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  http://<replica-ip>:8545
```

Expected response: `{"jsonrpc":"2.0","result":"0x56ce","id":1}` (22222 in hex)

### Block Production Test
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://<replica-ip>:8545
```

### Explorer Test
```bash
curl http://<explorer-ip>:4000/api/v1/health
```

## Monitoring

### Key Metrics to Watch
- **Block Production**: Blocks per second, block time
- **Batch Submission**: Batcher success rate, batch size
- **Output Submission**: Proposer success rate, output frequency
- **RPC Performance**: Response times, error rates
- **System Resources**: CPU, memory, disk usage

### Grafana Dashboards
Access Grafana at `http://<monitoring-ip>:3000` to view:
- OP Stack component metrics
- System resource usage
- RPC performance metrics
- Error rates and alerts

## Troubleshooting

### Common Issues

1. **RPC Not Responding**
   ```bash
   # Check if op-geth is running
   ssh root@<droplet-ip> "docker ps | grep op-geth"
   
   # Check logs
   ssh root@<droplet-ip> "docker logs sensei-op-geth-sequencer"
   ```

2. **Batch Submission Failures**
   ```bash
   # Check batcher logs
   ssh root@<batcher-ip> "docker logs sensei-op-batcher"
   
   # Verify wallet balance
   cast balance <batcher-address> --rpc-url https://sepolia.gateway.tenderly.co
   ```

3. **Explorer Not Indexing**
   ```bash
   # Check Blockscout logs
   ssh root@<explorer-ip> "docker logs sensei-blockscout"
   
   # Check database connectivity
   ssh root@<explorer-ip> "docker exec sensei-postgres pg_isready"
   ```

### Useful Commands

```bash
# Check service status
ssh root@<droplet-ip> "cd /opt/sensei-chain && docker compose ps"

# View logs
ssh root@<droplet-ip> "cd /opt/sensei-chain && docker compose logs -f"

# Restart services
ssh root@<droplet-ip> "cd /opt/sensei-chain && docker compose restart"

# Check disk usage
ssh root@<droplet-ip> "df -h"

# Check memory usage
ssh root@<droplet-ip> "free -h"
```

## Security Notes

- Change default passwords in production
- Monitor wallet balances regularly
- Set up proper firewall rules
- Regular security updates
- Backup configuration and data

## Next Steps

1. **Test Transactions**: Send test transactions on the L2
2. **Monitor Performance**: Watch metrics and adjust as needed
3. **Set Up Alerts**: Configure monitoring alerts
4. **Backup Strategy**: Implement regular backups
5. **Scale Out**: Add more replica nodes if needed

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review component logs
3. Consult OP Stack documentation
4. Check monitoring dashboards

The deployment is now ready for testing and development!
