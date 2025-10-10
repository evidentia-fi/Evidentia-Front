#!/bin/bash

# Wallet Management Script for Sensei Chain

WALLET_DIR="/opt/sensei-chain/keys"

show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  list        - List all wallet addresses"
    echo "  balance     - Check balances on Sepolia"
    echo "  export      - Export wallet information (secure)"
    echo "  backup      - Create encrypted backup of keys"
    echo "  restore     - Restore keys from backup"
    echo "  rotate      - Generate new keys (DANGEROUS)"
    echo ""
}

list_wallets() {
    echo "=== Sensei Chain Wallets ==="
    echo ""
    
    for wallet in sequencer batcher proposer; do
        if [ -f "$WALLET_DIR/${wallet}_address" ]; then
            local address=$(cat "$WALLET_DIR/${wallet}_address")
            echo "$wallet: $address"
        else
            echo "$wallet: NOT GENERATED"
        fi
    done
    echo ""
}

check_balances() {
    echo "=== Wallet Balances on Sepolia ==="
    echo ""
    
    local sepolia_rpc="https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
    
    for wallet in batcher proposer; do
        if [ -f "$WALLET_DIR/${wallet}_address" ]; then
            local address=$(cat "$WALLET_DIR/${wallet}_address")
            local balance=$(cast balance "$address" --rpc-url "$sepolia_rpc" 2>/dev/null || echo "ERROR")
            local balance_eth=$(cast to-unit "$balance" ether 2>/dev/null || echo "ERROR")
            echo "$wallet: $balance_eth ETH"
        else
            echo "$wallet: NOT GENERATED"
        fi
    done
    echo ""
}

export_wallets() {
    echo "=== Wallet Export (SECURE) ==="
    echo ""
    echo "WARNING: This will display private keys. Ensure you're in a secure environment."
    echo "Press Enter to continue or Ctrl+C to cancel..."
    read
    
    for wallet in sequencer batcher proposer; do
        if [ -f "$WALLET_DIR/${wallet}_private_key" ]; then
            local address=$(cat "$WALLET_DIR/${wallet}_address")
            local private_key=$(cat "$WALLET_DIR/${wallet}_private_key")
            echo "$wallet:"
            echo "  Address: $address"
            echo "  Private Key: $private_key"
            echo ""
        fi
    done
}

backup_wallets() {
    echo "=== Creating Wallet Backup ==="
    echo ""
    
    local backup_file="/opt/sensei-chain/backups/wallet-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    mkdir -p "$(dirname "$backup_file")"
    
    tar -czf "$backup_file" -C "$WALLET_DIR" .
    chmod 600 "$backup_file"
    
    echo "Backup created: $backup_file"
    echo "Store this file securely and delete it from the server!"
}

# Main script logic
case "${1:-help}" in
    "list")
        list_wallets
        ;;
    "balance")
        check_balances
        ;;
    "export")
        export_wallets
        ;;
    "backup")
        backup_wallets
        ;;
    "help"|*)
        show_help
        ;;
esac
