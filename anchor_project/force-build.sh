#!/bin/bash

# Force build with all fixes applied
set -e

cd "$(dirname "$0")"

echo "🔍 Checking Rust version..."
CURRENT_RUST=$(rustc --version | cut -d' ' -f2)
echo "Current Rust: $CURRENT_RUST"

# Check if Rust version is 1.78.0 or later
RUST_MAJOR=$(echo $CURRENT_RUST | cut -d'.' -f1)
RUST_MINOR=$(echo $CURRENT_RUST | cut -d'.' -f2)

if [ "$RUST_MAJOR" -lt 1 ] || ([ "$RUST_MAJOR" -eq 1 ] && [ "$RUST_MINOR" -lt 78 ]); then
    echo "⚠️  Rust version is too old. Updating to latest stable..."
    rustup update stable
    rustup default stable
    echo "✅ Updated to: $(rustc --version)"
else
    echo "✅ Rust version is compatible"
fi

echo ""
echo "🧹 Cleaning all build artifacts..."
cargo clean
rm -rf target/ .anchor/idl/ .anchor/test-ledger/

echo ""
echo "🔨 Building Anchor program..."
anchor build

echo ""
echo "✅ Build successful!"
echo ""
echo "Program compiled successfully. You can now deploy with:"
echo "  anchor deploy --provider.cluster devnet"

