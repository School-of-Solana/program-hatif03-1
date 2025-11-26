#!/bin/bash
# Update only the IDL without redeploying the program
# Use this if the program is already deployed but IDL update failed

echo "Updating IDL for program: 8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee"
echo ""

# First, make sure the IDL file exists
if [ ! -f "target/idl/votee.json" ]; then
    echo "IDL file not found. Building first..."
    anchor build
fi

echo "Initializing/updating IDL account..."
anchor idl init --filepath target/idl/votee.json 8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee --provider.cluster devnet

echo ""
echo "If that fails, try with a custom RPC:"
echo "export ANCHOR_PROVIDER_URL='https://your-custom-rpc-url'"
echo "anchor idl init --filepath target/idl/votee.json 8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee --provider.cluster devnet"

