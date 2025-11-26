#!/bin/bash

# Quick fix for proc-macro2 SourceFile error
# This updates Rust to 1.78.0+ which has SourceFile support

set -e

echo "🔧 Fixing Rust toolchain for Anchor IDL build..."

cd "$(dirname "$0")"

# Update Rust to 1.78.0 (has SourceFile support)
echo "📦 Installing Rust 1.78.0..."
rustup install 1.78.0
rustup default 1.78.0

# Clean build artifacts
echo "🧹 Cleaning build artifacts..."
cargo clean
rm -rf target/

# Rebuild
echo "🔨 Rebuilding Anchor program..."
anchor build

echo "✅ Build complete!"

