#!/bin/bash

# RUN THIS SCRIPT TO FIX THE BUILD ERROR
# Copy and paste this entire script into your WSL terminal

set -e

cd /mnt/c/Users/mdhat/Desktop/program-hatif03-1/anchor_project

echo "=========================================="
echo "  Fixing Anchor Build Error"
echo "=========================================="
echo ""

echo "Step 1: Updating Rust to latest stable..."
rustup update stable
rustup default stable

echo ""
echo "Step 2: Verifying Rust version..."
rustc --version

echo ""
echo "Step 3: Cleaning build artifacts..."
cargo clean
rm -rf target/ .anchor/idl/ .anchor/test-ledger/ 2>/dev/null || true

echo ""
echo "Step 4: Building Anchor program..."
echo "This may take a few minutes..."
anchor build

echo ""
echo "=========================================="
echo "  ✅ BUILD SUCCESSFUL!"
echo "=========================================="
echo ""
echo "Your program is ready to deploy!"
echo "Next step: anchor deploy --provider.cluster devnet"

