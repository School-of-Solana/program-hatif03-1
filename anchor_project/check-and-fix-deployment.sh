#!/bin/bash
# Check program status and fix deployment

echo "Checking if program is already deployed..."
solana program show 8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee --url devnet

echo ""
echo "If the program exists, we'll just update the IDL..."
echo "If it doesn't exist or times out, try using a custom RPC endpoint"

