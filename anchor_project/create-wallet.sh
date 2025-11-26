#!/bin/bash
# Create Solana wallet for deployment

echo "Creating Solana wallet..."
solana-keygen new -o ~/.config/solana/id.json

echo ""
echo "Wallet created! Your address is:"
solana address

echo ""
echo "Setting cluster to devnet..."
solana config set --url devnet

echo ""
echo "Checking balance..."
solana balance

echo ""
echo "If you need SOL, run: solana airdrop 2"

