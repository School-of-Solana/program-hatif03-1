#!/bin/bash
# Deploy using a custom RPC endpoint to avoid timeouts

# Option 1: Use Helius (free tier available)
# Get your API key from https://www.helius.dev/
# HELIUS_RPC="https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY"

# Option 2: Use QuickNode (free tier available)
# Get your endpoint from https://www.quicknode.com/
# QUICKNODE_RPC="https://your-endpoint.solana-devnet.quiknode.pro/YOUR_TOKEN/"

# Option 3: Use Alchemy (free tier available)
# Get your API key from https://www.alchemy.com/
# ALCHEMY_RPC="https://solana-devnet.g.alchemy.com/v2/YOUR_API_KEY"

# For now, let's try with a public RPC that might be faster
# Or you can set your custom RPC here:
CUSTOM_RPC="${HELIUS_RPC:-https://api.devnet.solana.com}"

echo "Deploying with RPC: $CUSTOM_RPC"
echo ""

# Set the RPC URL temporarily
export ANCHOR_PROVIDER_URL="$CUSTOM_RPC"

# Deploy
anchor deploy --provider.cluster devnet --provider.url "$CUSTOM_RPC"

echo ""
echo "If this still times out, try:"
echo "1. Get a free RPC endpoint from Helius, QuickNode, or Alchemy"
echo "2. Update the CUSTOM_RPC variable in this script"
echo "3. Or manually deploy the IDL: anchor idl init --filepath target/idl/votee.json 8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee --provider.cluster devnet"

