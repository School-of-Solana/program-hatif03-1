#!/bin/bash

# Fix Program ID Mismatch
# This script fixes the DeclaredProgramIdMismatch error

set -e

echo "🔧 Fixing Program ID Mismatch..."

# Get the current program ID from Anchor.toml
PROGRAM_ID=$(grep -A 1 "\[programs.devnet\]" Anchor.toml | grep "votee" | cut -d '"' -f 2)

if [ -z "$PROGRAM_ID" ]; then
    echo "❌ Could not find program ID in Anchor.toml"
    exit 1
fi

echo "📋 Current Program ID: $PROGRAM_ID"

# Check if keypair exists
KEYPAIR_PATH="target/deploy/votee-keypair.json"

if [ ! -f "$KEYPAIR_PATH" ]; then
    echo "❌ Keypair file not found at $KEYPAIR_PATH"
    exit 1
fi

# Get the public key from the keypair
KEYPAIR_PUBKEY=$(solana-keygen pubkey "$KEYPAIR_PATH" 2>/dev/null || echo "")

if [ -z "$KEYPAIR_PUBKEY" ]; then
    echo "⚠️  Could not read keypair public key. Generating new keypair..."
    
    # Generate new keypair
    solana-keygen new --outfile "$KEYPAIR_PATH" --force --no-bip39-passphrase
    
    # Get the new public key
    KEYPAIR_PUBKEY=$(solana-keygen pubkey "$KEYPAIR_PATH")
    
    echo "✅ Generated new keypair with public key: $KEYPAIR_PUBKEY"
    
    # Update Anchor.toml
    sed -i "s/votee = \".*\"/votee = \"$KEYPAIR_PUBKEY\"/" Anchor.toml
    
    # Update lib.rs
    sed -i "s/declare_id!(\".*\")/declare_id!(\"$KEYPAIR_PUBKEY\")/" programs/votee/src/lib.rs
    
    echo "✅ Updated Anchor.toml and lib.rs with new program ID"
else
    echo "📋 Keypair public key: $KEYPAIR_PUBKEY"
    
    if [ "$KEYPAIR_PUBKEY" != "$PROGRAM_ID" ]; then
        echo "⚠️  Mismatch detected! Keypair ($KEYPAIR_PUBKEY) != Program ID ($PROGRAM_ID)"
        echo "🔄 Updating Anchor.toml and lib.rs to match keypair..."
        
        # Update Anchor.toml to match keypair
        sed -i "s/votee = \".*\"/votee = \"$KEYPAIR_PUBKEY\"/" Anchor.toml
        
        # Update lib.rs to match keypair
        sed -i "s/declare_id!(\".*\")/declare_id!(\"$KEYPAIR_PUBKEY\")/" programs/votee/src/lib.rs
        
        echo "✅ Updated program ID to match keypair: $KEYPAIR_PUBKEY"
    else
        echo "✅ Program ID matches keypair!"
    fi
fi

echo ""
echo "🔨 Rebuilding program..."
anchor build

echo ""
echo "✅ Fix complete! You can now deploy with: anchor deploy"

