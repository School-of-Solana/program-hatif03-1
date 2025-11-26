#!/bin/bash
# Create a new wallet and use it for deployment

echo "Creating a new wallet..."
NEW_WALLET="$HOME/.config/solana/wallet2.json"
solana-keygen new -o "$NEW_WALLET"

echo ""
echo "New wallet address:"
solana address -k "$NEW_WALLET"

echo ""
echo "Requesting airdrop for new wallet..."
echo "If rate limited, use https://faucet.solana.com/ with the address above"
solana airdrop 2 --url devnet -k "$NEW_WALLET"

echo ""
echo "Checking balance..."
solana balance --url devnet -k "$NEW_WALLET"

echo ""
echo "To use this wallet for deployment, run:"
echo "anchor deploy --provider.cluster devnet --provider.wallet $NEW_WALLET"
echo ""
echo "Or set it as default temporarily:"
echo "solana config set --keypair $NEW_WALLET"
echo "anchor deploy --provider.cluster devnet"
echo "solana config set --keypair ~/.config/solana/id.json  # switch back"

