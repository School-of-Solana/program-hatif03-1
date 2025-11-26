#!/bin/bash

# Force fix Rust version issue
set -e

echo "🔧 Checking current Rust version..."
rustc --version

echo ""
echo "📦 Installing latest stable Rust (has SourceFile support)..."
rustup update stable
rustup default stable

echo ""
echo "✅ Updated Rust version:"
rustc --version

echo ""
echo "🧹 Cleaning build artifacts..."
cd "$(dirname "$0")"
cargo clean
rm -rf target/ .anchor/idl/

echo ""
echo "🔨 Rebuilding..."
anchor build

echo ""
echo "✅ Build complete!"

