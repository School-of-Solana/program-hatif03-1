#!/bin/bash

# Fix Program ID Mismatch by cleaning and rebuilding

set -e

echo "🔧 Fixing Program ID Mismatch..."

# Get the program ID from Anchor.toml
PROGRAM_ID=$(grep -A 1 "\[programs.devnet\]" Anchor.toml | grep "votee" | cut -d '"' -f 2)

echo "📋 Program ID from Anchor.toml: $PROGRAM_ID"

# Check lib.rs
LIB_RS_ID=$(grep "declare_id!" programs/votee/src/lib.rs | cut -d '"' -f 2)
echo "📋 Program ID from lib.rs: $LIB_RS_ID"

if [ "$PROGRAM_ID" != "$LIB_RS_ID" ]; then
    echo "⚠️  Mismatch between Anchor.toml and lib.rs!"
    echo "🔄 Updating lib.rs to match Anchor.toml..."
    sed -i "s/declare_id!(\".*\")/declare_id!(\"$PROGRAM_ID\")/" programs/votee/src/lib.rs
    echo "✅ Updated lib.rs"
fi

echo ""
echo "🧹 Cleaning build artifacts..."
rm -rf target/deploy/votee.so
rm -rf target/idl/votee.json

echo ""
echo "🔨 Rebuilding program..."
anchor build

echo ""
echo "✅ Build complete! Program ID should now be synced."
echo "🚀 You can now deploy with: anchor deploy"

