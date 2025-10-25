#!/bin/bash
# =========================================
# Node Runner Setup Script
# Installs WireGuard + dependencies
# =========================================

set -e

echo "🚀 Starting VPN Node setup..."

# --- Update system ---
sudo apt update -y && sudo apt upgrade -y

# --- Install dependencies ---
echo "📦 Installing required packages..."
sudo apt install -y wireguard curl jq ufw

# --- Enable IP forwarding ---
echo "⚙️  Enabling IP forwarding..."
sudo sysctl -w net.ipv4.ip_forward=1
sudo sysctl -p

# --- Configure UFW (basic firewall rules) ---
echo "🛡️  Configuring UFW..."
sudo ufw allow 51820/udp
sudo ufw allow ssh
sudo ufw enable

# --- Create WireGuard directory ---
WG_DIR="/etc/wireguard"
sudo mkdir -p $WG_DIR
cd $WG_DIR

# --- Generate server private & public keys ---
if [ ! -f server_private.key ]; then
  echo "🔑 Generating WireGuard keys..."
  umask 077
  wg genkey | tee server_private.key | wg pubkey > server_public.key
fi

# --- Create basic wg0.conf if missing ---
if [ ! -f wg0.conf ]; then
cat <<EOF | sudo tee wg0.conf > /dev/null
[Interface]
PrivateKey = $(cat server_private.key)
Address = 10.0.0.1/24
ListenPort = 51820

# Peers will be added dynamically by node-runner
EOF
  echo "✅ Basic WireGuard config created at /etc/wireguard/wg0.conf"
fi

echo "🎉 Setup complete!"
echo "You can now start your node using: sudo wg-quick up wg0"
