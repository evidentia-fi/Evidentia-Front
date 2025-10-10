#!/bin/bash

# Sensei OP Stack Deployment Test Script
# This script tests the deployed chain to ensure it's working correctly

set -e

# Configuration
DROPLETS_FILE="droplets.txt"
L2_CHAIN_ID="22222"
L1_CHAIN_ID="11155111"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Function to get droplet IP by name
get_droplet_ip() {
    local name=$1
    local ip=$(grep "^$name:" "$DROPLETS_FILE" | cut -d: -f3)
    if [ -z "$ip" ]; then
        error "Droplet IP not found for: $name"
    fi
    echo "$ip"
}

# Function to test RPC endpoint
test_rpc_endpoint() {
    local name=$1
    local ip=$2
    local port=${3:-8545}
    
    log "Testing RPC endpoint: $name ($ip:$port)"
    
    # Test basic connectivity
    if ! curl -s --connect-timeout 10 "http://$ip:$port" > /dev/null; then
        warn "✗ $name RPC endpoint not reachable"
        return 1
    fi
    
    # Test chain ID
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
        "http://$ip:$port" 2>/dev/null)
    
    if echo "$response" | jq -e '.result' > /dev/null 2>&1; then
        local chain_id=$(echo "$response" | jq -r '.result')
        local chain_id_decimal=$((16#${chain_id#0x}))
        
        if [ "$chain_id_decimal" = "$L2_CHAIN_ID" ]; then
            log "✓ $name RPC endpoint working, chain ID: $chain_id_decimal"
            return 0
        else
            warn "✗ $name wrong chain ID: $chain_id_decimal (expected: $L2_CHAIN_ID)"
            return 1
        fi
    else
        warn "✗ $name RPC endpoint not responding correctly"
        return 1
    fi
}

# Function to test block production
test_block_production() {
    local name=$1
    local ip=$2
    
    log "Testing block production: $name ($ip)"
    
    # Get current block number
    local response1=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        "http://$ip:8545" 2>/dev/null)
    
    if ! echo "$response1" | jq -e '.result' > /dev/null 2>&1; then
        warn "✗ $name cannot get block number"
        return 1
    fi
    
    local block1=$(echo "$response1" | jq -r '.result')
    local block1_decimal=$((16#${block1#0x}))
    
    log "Current block number: $block1_decimal"
    
    # Wait for next block
    log "Waiting for next block..."
    sleep 5
    
    # Get new block number
    local response2=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        "http://$ip:8545" 2>/dev/null)
    
    if ! echo "$response2" | jq -e '.result' > /dev/null 2>&1; then
        warn "✗ $name cannot get updated block number"
        return 1
    fi
    
    local block2=$(echo "$response2" | jq -r '.result')
    local block2_decimal=$((16#${block2#0x}))
    
    if [ "$block2_decimal" -gt "$block1_decimal" ]; then
        log "✓ $name block production working, new block: $block2_decimal"
        return 0
    else
        warn "✗ $name block production not working, block number unchanged: $block2_decimal"
        return 1
    fi
}

# Function to test explorer
test_explorer() {
    local name=$1
    local ip=$2
    
    log "Testing explorer: $name ($ip)"
    
    # Test basic connectivity
    if ! curl -s --connect-timeout 10 "http://$ip:4000" > /dev/null; then
        warn "✗ $name explorer not reachable"
        return 1
    fi
    
    # Test API endpoint
    if curl -s -f "http://$ip:4000/api/v1/health" > /dev/null; then
        log "✓ $name explorer API responding"
        return 0
    else
        warn "✗ $name explorer API not responding"
        return 1
    fi
}

# Function to test monitoring
test_monitoring() {
    local name=$1
    local ip=$2
    
    log "Testing monitoring: $name ($ip)"
    
    # Test Grafana
    if curl -s --connect-timeout 10 "http://$ip:3000" > /dev/null; then
        log "✓ $name Grafana accessible"
    else
        warn "✗ $name Grafana not accessible"
    fi
    
    # Test Prometheus
    if curl -s --connect-timeout 10 "http://$ip:9090" > /dev/null; then
        log "✓ $name Prometheus accessible"
    else
        warn "✗ $name Prometheus not accessible"
    fi
}

# Function to test transaction
test_transaction() {
    local name=$1
    local ip=$2
    
    log "Testing transaction capability: $name ($ip)"
    
    # Get gas price
    local gas_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}' \
        "http://$ip:8545" 2>/dev/null)
    
    if echo "$gas_response" | jq -e '.result' > /dev/null 2>&1; then
        local gas_price=$(echo "$gas_response" | jq -r '.result')
        log "✓ $name gas price: $gas_price"
        return 0
    else
        warn "✗ $name cannot get gas price"
        return 1
    fi
}

# Main test function
main() {
    log "Starting Sensei OP Stack deployment tests..."
    
    # Check if droplets file exists
    if [ ! -f "$DROPLETS_FILE" ]; then
        error "Droplets file not found: $DROPLETS_FILE"
    fi
    
    local total_tests=0
    local passed_tests=0
    
    # Test sequencer
    if [ -n "$(get_droplet_ip "sequencer" 2>/dev/null)" ]; then
        local sequencer_ip=$(get_droplet_ip "sequencer")
        log "Testing sequencer at $sequencer_ip..."
        
        total_tests=$((total_tests + 1))
        if test_rpc_endpoint "sequencer" "$sequencer_ip" "8545"; then
            passed_tests=$((passed_tests + 1))
        fi
        
        total_tests=$((total_tests + 1))
        if test_transaction "sequencer" "$sequencer_ip"; then
            passed_tests=$((passed_tests + 1))
        fi
    fi
    
    # Test replicas
    for replica in replica-1 replica-2; do
        if [ -n "$(get_droplet_ip "$replica" 2>/dev/null)" ]; then
            local replica_ip=$(get_droplet_ip "$replica")
            log "Testing $replica at $replica_ip..."
            
            total_tests=$((total_tests + 1))
            if test_rpc_endpoint "$replica" "$replica_ip" "8545"; then
                passed_tests=$((passed_tests + 1))
            fi
            
            total_tests=$((total_tests + 1))
            if test_transaction "$replica" "$replica_ip"; then
                passed_tests=$((passed_tests + 1))
            fi
        fi
    done
    
    # Test block production on first replica
    if [ -n "$(get_droplet_ip "replica-1" 2>/dev/null)" ]; then
        local replica_ip=$(get_droplet_ip "replica-1")
        total_tests=$((total_tests + 1))
        if test_block_production "replica-1" "$replica_ip"; then
            passed_tests=$((passed_tests + 1))
        fi
    fi
    
    # Test explorer
    if [ -n "$(get_droplet_ip "explorer" 2>/dev/null)" ]; then
        local explorer_ip=$(get_droplet_ip "explorer")
        log "Testing explorer at $explorer_ip..."
        
        total_tests=$((total_tests + 1))
        if test_explorer "explorer" "$explorer_ip"; then
            passed_tests=$((passed_tests + 1))
        fi
    fi
    
    # Test monitoring
    if [ -n "$(get_droplet_ip "monitoring" 2>/dev/null)" ]; then
        local monitoring_ip=$(get_droplet_ip "monitoring")
        log "Testing monitoring at $monitoring_ip..."
        
        total_tests=$((total_tests + 1))
        if test_monitoring "monitoring" "$monitoring_ip"; then
            passed_tests=$((passed_tests + 1))
        fi
    fi
    
    # Summary
    echo ""
    log "=== TEST SUMMARY ==="
    log "Total tests: $total_tests"
    log "Passed tests: $passed_tests"
    log "Failed tests: $((total_tests - passed_tests))"
    
    if [ "$passed_tests" -eq "$total_tests" ]; then
        log "🎉 All tests passed! Sensei chain is working correctly."
        return 0
    else
        warn "⚠️  Some tests failed. Please check the deployment."
        return 1
    fi
}

# Run main function
main "$@"
