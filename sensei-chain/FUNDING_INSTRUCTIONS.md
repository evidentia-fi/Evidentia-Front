# Sensei Chain Wallet Funding Instructions

## Required Wallets

The following wallets have been generated and need to be funded on Ethereum Sepolia:

### 1. Sequencer Wallet
- **Address**: [0;32m[2025-10-10 14:30:09] Generating wallet: sequencer[0m
[0;32m[2025-10-10 14:30:09] Wallet sequencer generated:[0m
  Address: 0x92F9ECcb22c3EF3239bf7042A4a327A1C5a94bbe
  Private key stored in: ./sensei-chain/keys/sequencer_private_key
0x92F9ECcb22c3EF3239bf7042A4a327A1C5a94bbe
- **Purpose**: Used by op-node to sequence blocks
- **Funding**: No funding required (L2 only)

### 2. Batcher Wallet
- **Address**: [0;32m[2025-10-10 14:30:09] Generating wallet: batcher[0m
[0;32m[2025-10-10 14:30:09] Wallet batcher generated:[0m
  Address: 0xcc0dbc0CdF85fE61AF55f8129b642AeDd1a6bE6B
  Private key stored in: ./sensei-chain/keys/batcher_private_key
0xcc0dbc0CdF85fE61AF55f8129b642AeDd1a6bE6B
- **Purpose**: Posts L2 transaction batches to L1
- **Funding**: **REQUIRED** - Fund with at least 0.1 ETH on Sepolia
- **Usage**: Pays for L1 transaction fees when submitting batches

### 3. Proposer Wallet
- **Address**: [0;32m[2025-10-10 14:30:09] Generating wallet: proposer[0m
[0;32m[2025-10-10 14:30:09] Wallet proposer generated:[0m
  Address: 0xcB7Ef550cfa152b42e552FE1182D2a49a8CD7254
  Private key stored in: ./sensei-chain/keys/proposer_private_key
0xcB7Ef550cfa152b42e552FE1182D2a49a8CD7254
- **Purpose**: Posts L2 state outputs to L1
- **Funding**: **REQUIRED** - Fund with at least 0.1 ETH on Sepolia
- **Usage**: Pays for L1 transaction fees when submitting outputs

## Funding Steps

### Option 1: Use Sepolia Faucet
1. Visit: https://sepoliafaucet.com/
2. Enter the batcher address: [0;32m[2025-10-10 14:30:09] Generating wallet: batcher[0m
[0;32m[2025-10-10 14:30:09] Wallet batcher generated:[0m
  Address: 0xcc0dbc0CdF85fE61AF55f8129b642AeDd1a6bE6B
  Private key stored in: ./sensei-chain/keys/batcher_private_key
0xcc0dbc0CdF85fE61AF55f8129b642AeDd1a6bE6B
3. Request 0.1 ETH
4. Repeat for proposer address: [0;32m[2025-10-10 14:30:09] Generating wallet: proposer[0m
[0;32m[2025-10-10 14:30:09] Wallet proposer generated:[0m
  Address: 0xcB7Ef550cfa152b42e552FE1182D2a49a8CD7254
  Private key stored in: ./sensei-chain/keys/proposer_private_key
0xcB7Ef550cfa152b42e552FE1182D2a49a8CD7254

### Option 2: Use Alchemy Faucet
1. Visit: https://sepoliafaucet.com/
2. Enter the batcher address: [0;32m[2025-10-10 14:30:09] Generating wallet: batcher[0m
[0;32m[2025-10-10 14:30:09] Wallet batcher generated:[0m
  Address: 0xcc0dbc0CdF85fE61AF55f8129b642AeDd1a6bE6B
  Private key stored in: ./sensei-chain/keys/batcher_private_key
0xcc0dbc0CdF85fE61AF55f8129b642AeDd1a6bE6B
3. Request 0.1 ETH
4. Repeat for proposer address: [0;32m[2025-10-10 14:30:09] Generating wallet: proposer[0m
[0;32m[2025-10-10 14:30:09] Wallet proposer generated:[0m
  Address: 0xcB7Ef550cfa152b42e552FE1182D2a49a8CD7254
  Private key stored in: ./sensei-chain/keys/proposer_private_key
0xcB7Ef550cfa152b42e552FE1182D2a49a8CD7254

### Option 3: Transfer from existing wallet
If you have ETH on Sepolia, transfer at least 0.1 ETH to each address:
- Batcher: [0;32m[2025-10-10 14:30:09] Generating wallet: batcher[0m
[0;32m[2025-10-10 14:30:09] Wallet batcher generated:[0m
  Address: 0xcc0dbc0CdF85fE61AF55f8129b642AeDd1a6bE6B
  Private key stored in: ./sensei-chain/keys/batcher_private_key
0xcc0dbc0CdF85fE61AF55f8129b642AeDd1a6bE6B
- Proposer: [0;32m[2025-10-10 14:30:09] Generating wallet: proposer[0m
[0;32m[2025-10-10 14:30:09] Wallet proposer generated:[0m
  Address: 0xcB7Ef550cfa152b42e552FE1182D2a49a8CD7254
  Private key stored in: ./sensei-chain/keys/proposer_private_key
0xcB7Ef550cfa152b42e552FE1182D2a49a8CD7254

## Verification

After funding, verify balances using:

```bash
# Check batcher balance
cast balance [0;32m[2025-10-10 14:30:09] Generating wallet: batcher[0m
[0;32m[2025-10-10 14:30:09] Wallet batcher generated:[0m
  Address: 0xcc0dbc0CdF85fE61AF55f8129b642AeDd1a6bE6B
  Private key stored in: ./sensei-chain/keys/batcher_private_key
0xcc0dbc0CdF85fE61AF55f8129b642AeDd1a6bE6B --rpc-url https://sepolia.gateway.tenderly.co

# Check proposer balance
cast balance [0;32m[2025-10-10 14:30:09] Generating wallet: proposer[0m
[0;32m[2025-10-10 14:30:09] Wallet proposer generated:[0m
  Address: 0xcB7Ef550cfa152b42e552FE1182D2a49a8CD7254
  Private key stored in: ./sensei-chain/keys/proposer_private_key
0xcB7Ef550cfa152b42e552FE1182D2a49a8CD7254 --rpc-url https://sepolia.gateway.tenderly.co
```

## Security Notes

- **NEVER** share private keys
- Store private keys securely
- Consider using hardware wallets for production
- Rotate keys periodically
- Monitor wallet balances and top up as needed

## Environment Variables

Add these to your deployment environment:

```bash
export SENSEI_SEQUENCER_KEY=$(cat /opt/sensei-chain/keys/sequencer_private_key)
export SENSEI_BATCHER_KEY=$(cat /opt/sensei-chain/keys/batcher_private_key)
export SENSEI_PROPOSER_KEY=$(cat /opt/sensei-chain/keys/proposer_private_key)
```

## Next Steps

1. Fund the batcher and proposer wallets
2. Verify balances
3. Proceed with L1 contract deployment
4. Deploy the OP Stack components

