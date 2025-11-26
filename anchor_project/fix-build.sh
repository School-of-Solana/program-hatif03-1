#!/bin/bash

# Fix build issues for Anchor 0.30.1
# This script updates Rust toolchain and installs required components

set -e

echo "🔧 Fixing Anchor build environment..."

# Check if rustup is installed
if ! command -v rustup &> /dev/null; then
    echo "❌ rustup not found. Installing rustup..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
fi

# Install/update Rust stable toolchain (required for Anchor 0.30.1)
echo "📦 Installing Rust stable toolchain..."
rustup install stable
rustup default stable

# Install Solana BPF toolchain (required for Solana programs)
echo "📦 Installing Solana BPF toolchain..."
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Install BPF toolchain for Anchor
echo "📦 Installing BPF toolchain for Anchor..."
anchor-install

# Update Rust components
echo "📦 Updating Rust components..."
rustup component add rust-src
rustup target add bpf-unknown-unknown

# Clean build artifacts
echo "🧹 Cleaning build artifacts..."
cd "$(dirname "$0")"
cargo clean
rm -rf target/

echo "✅ Build environment fixed!"
echo ""
echo "Now try running: anchor build"

