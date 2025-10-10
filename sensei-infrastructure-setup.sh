#!/bin/bash

# Sensei OP Stack Infrastructure Setup Script
# This script provisions Digital Ocean droplets for the Sensei chain

set -e

# Configuration
DO_API_TOKEN="${DO_API_TOKEN:-your_digitalocean_token_here}"
REGION="nyc3"  # Change as needed
SSH_KEY_NAME="sensei-ssh-key"  # You'll need to create this SSH key first
# DOMAIN configuration skipped for now

# Droplet configurations based on the hardware blueprint
# Format: name:size:vcpus:ram:disk
DROPLETS="
sequencer:s-8vcpu-32gb:8:32:1000
batcher:s-4vcpu-8gb:4:8:50
proposer:s-4vcpu-8gb:4:8:50
replica-1:s-8vcpu-32gb:8:32:1000
replica-2:s-8vcpu-32gb:8:32:1000
explorer:s-4vcpu-8gb:4:8:50
monitoring:s-2vcpu-4gb:2:4:50
"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if DO_API_TOKEN is set
if [ "$DO_API_TOKEN" = "your_digitalocean_token_here" ]; then
    print_error "DO_API_TOKEN environment variable is not set!"
    print_status "Please set your DigitalOcean API token:"
    print_status "export DO_API_TOKEN='your_actual_token_here'"
    exit 1
fi

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    print_error "doctl is not installed. Please install it first:"
    print_status "https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Authenticate with DigitalOcean
print_status "Authenticating with DigitalOcean..."
doctl auth init -t "$DO_API_TOKEN"

# Verify authentication
if ! doctl account get &> /dev/null; then
    print_error "Failed to authenticate with DigitalOcean. Please check your API token."
    exit 1
fi

print_success "Successfully authenticated with DigitalOcean"

# Check if SSH key exists
print_status "Checking for SSH key: $SSH_KEY_NAME"
if ! doctl compute ssh-key list | grep -q "$SSH_KEY_NAME"; then
    print_warning "SSH key '$SSH_KEY_NAME' not found in DigitalOcean"
    print_status "Please create and upload your SSH key first:"
    print_status "1. Generate SSH key: ssh-keygen -t ed25519 -C 'your_email@example.com'"
    print_status "2. Upload to DO: doctl compute ssh-key import $SSH_KEY_NAME --public-key-file ~/.ssh/id_ed25519.pub"
    exit 1
fi

print_success "SSH key found"

# Get SSH key fingerprint
SSH_KEY_FINGERPRINT=$(doctl compute ssh-key list --format FingerPrint,Name --no-header | grep "$SSH_KEY_NAME" | awk '{print $1}')
print_status "Using SSH key fingerprint: $SSH_KEY_FINGERPRINT"

# Function to create a droplet
create_droplet() {
    local name=$1
    local size=$2
    local vcpus=$3
    local ram=$4
    local disk=$5
    
    print_status "Creating droplet: $name (Size: $size, vCPUs: $vcpus, RAM: ${ram}GB, Disk: ${disk}GB)"
    
    # Create the droplet
    local droplet_id=$(doctl compute droplet create "$name" \
        --size "$size" \
        --image ubuntu-22-04-x64 \
        --region "$REGION" \
        --ssh-keys "$SSH_KEY_FINGERPRINT" \
        --format ID --no-header)
    
    if [ -z "$droplet_id" ]; then
        print_error "Failed to create droplet: $name"
        return 1
    fi
    
    print_success "Created droplet: $name (ID: $droplet_id)"
    
    # Wait for droplet to be active
    print_status "Waiting for droplet $name to be active..."
    while true; do
        local status=$(doctl compute droplet get "$droplet_id" --format Status --no-header)
        if [ "$status" = "active" ]; then
            break
        fi
        print_status "Droplet $name status: $status (waiting...)"
        sleep 10
    done
    
    # Get droplet IP
    local ip=$(doctl compute droplet get "$droplet_id" --format PublicIPv4 --no-header)
    print_success "Droplet $name is active with IP: $ip"
    
    # Save droplet info
    echo "$name:$droplet_id:$ip:$size:$vcpus:$ram:$disk" >> droplets.txt
    
    return 0
}

# Create droplets.txt file
> droplets.txt

print_status "Starting droplet creation process..."

# Parse and create droplets
echo "$DROPLETS" | grep -v '^$' | while IFS=':' read -r name size vcpus ram disk; do
    if [ -n "$name" ] && [ -n "$size" ]; then
        create_droplet "$name" "$size" "$vcpus" "$ram" "$disk"
        if [ $? -ne 0 ]; then
            print_error "Failed to create droplet: $name"
            exit 1
        fi
    fi
done

print_success "All droplets created successfully!"

# Display summary
print_status "Droplet Summary:"
echo "=================="
cat droplets.txt | while IFS=':' read -r name id ip size vcpus ram disk; do
    echo "Name: $name"
    echo "ID: $id"
    echo "IP: $ip"
    echo "Size: $size (${vcpus}vCPUs, ${ram}GB RAM, ${disk}GB Disk)"
    echo "---"
done

print_status "Next steps:"
print_status "1. Wait a few minutes for all droplets to fully initialize"
print_status "2. Run the deployment script: ./sensei-deployment.sh"
print_status "3. Configure your domain DNS to point to the sequencer IP"
print_status "4. Set up SSL certificates for your domain"

print_success "Infrastructure setup completed!"
