#!/bin/bash
# Update the IDL for the already-deployed program

echo "Program is already deployed! Updating IDL..."
echo "Program ID: 8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee"
echo ""

# Make sure we have the latest build
echo "Building to ensure IDL is up to date..."
anchor build

echo ""
echo "Updating IDL account..."
anchor idl init --filepath target/idl/votee.json 8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee --provider.cluster devnet

echo ""
echo "Done! Your program is fully deployed and IDL is updated."
echo "View on Solana Explorer: https://explorer.solana.com/address/8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee?cluster=devnet"

