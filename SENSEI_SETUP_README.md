# Sensei OP Stack Setup Guide

This guide provides step-by-step instructions for deploying the Sensei OP Stack fork on Digital Ocean servers.

## Overview

The Sensei chain is an OP Stack rollup deployed on Ethereum Sepolia with the following specifications:
- **Chain Name**: Sensei
- **L1 Network**: Ethereum Sepolia (Chain ID: 11155111)
- **L2 Chain ID**: 22222
- **Currency Symbol**: SEN (L2 native)
- **Block Time**: 2-2.5 seconds
- **Data Availability**: On L1 (standard OP Stack rollup mode)
- **Fault Proofs**: Enabled with challenger infrastructure

## Architecture

The deployment consists of the following components:

### Infrastructure Components
- **Sequencer**: 8 vCPU, 32 GB RAM, 1 TB NVMe (Private)
- **Batcher**: 4 vCPU, 8 GB RAM, 50 GB (Private)
- **Proposer**: 4 vCPU, 8 GB RAM, 50 GB (Private)
- **Replica Nodes**: 2x (8 vCPU, 32 GB RAM, 1 TB NVMe each) (Public RPC)
- **Explorer**: 8 vCPU, 32 GB RAM, 1 TB NVMe (Public)
- **Monitoring**: 4 vCPU, 8 GB RAM, 200 GB (Private)

### Software Components
- **op-geth**: L2 execution client
- **op-node**: L2 consensus client
- **op-batcher**: Posts L2 batches to L1
- **op-proposer**: Posts L2 outputs to L1
- **op-challenger**: Dispute resolution (optional)
- **Blockscout**: Blockchain explorer
- **Prometheus/Grafana**: Monitoring
- **Loki**: Log aggregation
- **Nginx**: Reverse proxy and load balancing

## Prerequisites

### Required Tools
- `doctl` (Digital Ocean CLI)
- `git`
- `make`
- `jq`
- `curl`
- `ssh` client
- `scp` client

### Required Accounts
- Digital Ocean account with API token
- Ethereum Sepolia RPC access (Infura, Alchemy, or self-hosted)
- Domain name for DNS configuration

### Required Information
- Digital Ocean API token
- Sepolia RPC URL
- Domain name
- SSH key for server access

## Step-by-Step Setup

### 1. Infrastructure Provisioning

Run the infrastructure setup script to create all required droplets:

```bash
chmod +x sensei-infrastructure-setup.sh
./sensei-infrastructure-setup.sh
```

This script will:
- Create all required droplets with proper sizing
- Configure firewall rules
- Set up load balancer
- Generate a `droplets.txt` file with server information

### 2. Wallet Generation and Funding

Generate the required EOA keys and fund them:

```bash
chmod +x sensei-wallet-setup.sh
./sensei-wallet-setup.sh
```

This script will:
- Generate three EOA keys (sequencer, batcher, proposer)
- Store keys securely
- Provide funding instructions
- Create environment templates

**Important**: Fund the batcher and proposer wallets with at least 0.1 ETH each on Sepolia.

### 3. L1 Contract Deployment

Deploy the L1 contracts to Sepolia:

```bash
chmod +x sensei-l1-deployment.sh
export SENSEI_DEPLOYER_KEY="your_deployer_private_key"
./sensei-l1-deployment.sh
```

This script will:
- Clone the Optimism repository
- Create deployment configuration
- Deploy L1 contracts
- Generate `genesis.json` and `rollup.json`
- Create deployment summary

### 4. Component Deployment

Deploy all components to their respective droplets:

```bash
chmod +x sensei-deploy-orchestrator.sh
./sensei-deploy-orchestrator.sh
```

This script will:
- Deploy to each droplet in the correct order
- Copy configuration files
- Start all services
- Verify deployment
- Create deployment summary

### 5. DNS Configuration

Configure DNS records to point to your infrastructure:

```
rpc.sensei.yourdomain.com → Load Balancer IP
explorer.sensei.yourdomain.com → Explorer droplet IP
ws.sensei.yourdomain.com → Load Balancer IP
```

### 6. SSL Certificate Setup

Set up SSL certificates using Let's Encrypt:

```bash
# On each droplet with public endpoints
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d rpc.sensei.yourdomain.com
sudo certbot --nginx -d explorer.sensei.yourdomain.com
```

## Configuration Files

### Environment Variables

Each component requires specific environment variables. The deployment script creates appropriate `.env` files for each role.

### Docker Compose Files

- `docker-compose-sequencer.yml`: Sequencer stack
- `docker-compose-batcher.yml`: Batcher service
- `docker-compose-proposer.yml`: Proposer service
- `docker-compose-replica.yml`: Replica nodes
- `docker-compose-explorer.yml`: Explorer stack

### Monitoring Configuration

- `monitoring-configs/prometheus.yml`: Prometheus configuration
- `monitoring-configs/loki-config.yml`: Loki configuration
- `monitoring-configs/promtail-config.yml`: Log collection

### Nginx Configuration

- `nginx-configs/nginx.conf`: RPC endpoint configuration
- `nginx-configs/explorer-nginx.conf`: Explorer configuration

## Verification

### Health Checks

Verify that all components are running correctly:

```bash
# Check RPC endpoint
curl -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  http://rpc.sensei.yourdomain.com

# Check explorer
curl http://explorer.sensei.yourdomain.com/api/v1/health

# Check monitoring
curl http://monitoring-ip:3000  # Grafana
curl http://monitoring-ip:9090  # Prometheus
```

### Expected Responses

- **RPC**: Should return `{"jsonrpc":"2.0","result":"0x56ce","id":1}` (22222 in hex)
- **Explorer**: Should return health status
- **Monitoring**: Should show dashboards

## Monitoring and Alerting

### Grafana Dashboards

Access Grafana at `http://monitoring-ip:3000` with:
- Username: `admin`
- Password: Set in environment variables

### Key Metrics to Monitor

- **Block Production**: Blocks per second, block time
- **Batch Submission**: Batcher success rate, batch size
- **Output Submission**: Proposer success rate, output frequency
- **RPC Performance**: Response times, error rates
- **System Resources**: CPU, memory, disk usage

### Alerting Rules

Configure alerts for:
- Block production stopped
- Batch submission failures
- Output submission failures
- High error rates
- Resource exhaustion

## Security Considerations

### Network Security
- Sequencer and batcher/proposer are in private subnets
- Only replicas and explorer are publicly accessible
- Firewall rules restrict access appropriately

### Key Management
- Private keys are stored securely on each droplet
- Regular key rotation recommended
- Hardware wallet integration for production

### Monitoring
- All components have health checks
- Log aggregation for security analysis
- Regular security updates

## Troubleshooting

### Common Issues

1. **RPC Not Responding**
   - Check if op-geth is running
   - Verify firewall rules
   - Check logs for errors

2. **Batch Submission Failures**
   - Verify batcher wallet has sufficient ETH
   - Check L1 RPC connectivity
   - Review batch configuration

3. **Output Submission Failures**
   - Verify proposer wallet has sufficient ETH
   - Check L1 RPC connectivity
   - Review output configuration

4. **Explorer Not Indexing**
   - Check database connectivity
   - Verify RPC endpoint configuration
   - Review Blockscout logs

### Log Locations

- **Docker logs**: `docker logs <container_name>`
- **Application logs**: `/opt/sensei-chain/logs/`
- **Nginx logs**: `/var/log/nginx/`
- **System logs**: `/var/log/syslog`

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

## Maintenance

### Regular Tasks

1. **Monitor wallet balances** and top up as needed
2. **Update software** regularly
3. **Backup configuration** and data
4. **Review logs** for issues
5. **Test failover** procedures

### Backup Strategy

- **Database backups**: Daily automated backups
- **Configuration backups**: Version control
- **Key backups**: Encrypted offline storage
- **Snapshot backups**: Weekly droplet snapshots

## Support and Resources

### Documentation
- [OP Stack Documentation](https://docs.optimism.io)
- [Blockscout Documentation](https://docs.blockscout.com)
- [Digital Ocean Documentation](https://docs.digitalocean.com)

### Community
- [Optimism Discord](https://discord.gg/optimism)
- [OP Stack GitHub](https://github.com/ethereum-optimism/optimism)

### Emergency Contacts
- Keep contact information for key team members
- Document escalation procedures
- Maintain incident response plan

## Conclusion

This setup provides a production-ready OP Stack deployment with proper monitoring, security, and scalability. Regular maintenance and monitoring are essential for reliable operation.

For questions or issues, refer to the troubleshooting section or consult the OP Stack documentation.
