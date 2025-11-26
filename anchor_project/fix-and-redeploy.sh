#!/bin/bash
# Fix program ID mismatch and redeploy

echo "Rebuilding program with correct program ID..."
anchor build

echo ""
echo "Redeploying to devnet..."
anchor deploy --provider.cluster devnet

echo ""
echo "Deployment complete! Your program ID is: 8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee"
echo "View on Solana Explorer: https://explorer.solana.com/address/8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee?cluster=devnet"

