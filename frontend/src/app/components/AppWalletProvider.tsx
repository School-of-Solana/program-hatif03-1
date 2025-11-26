'use client'

import React, { useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets'

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Use localnet in development, devnet in production
  const endpoint = useMemo(() => {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8899'
    // If it's a localnet URL, use it directly, otherwise use devnet
    if (rpcUrl.includes('127.0.0.1') || rpcUrl.includes('localhost')) {
      return rpcUrl
    }
    return clusterApiUrl(WalletAdapterNetwork.Devnet)
  }, [])

  const wallets = useMemo(
    () => [
      // manually add any legacy wallet adapters here
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [] // wallets don't depend on network
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
