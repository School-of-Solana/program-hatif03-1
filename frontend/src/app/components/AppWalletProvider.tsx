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
  // Use RPC URL from environment, fallback to devnet
  const endpoint = useMemo(() => {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL
    
    // If RPC URL is provided, use it directly
    if (rpcUrl) {
      return rpcUrl
    }
    
    // Fallback to devnet cluster API
    return clusterApiUrl(WalletAdapterNetwork.Devnet)
  }, [])

  const wallets = useMemo(
    () => {
      const adapters = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
      ]
      
      // Log wallet adapters for debugging
      console.log('Initialized wallet adapters:', adapters.map(a => a.name))
      
      return adapters
    },
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false}
        onError={(error) => {
          // Only log non-user-cancelled errors
          if (
            error.name !== 'WalletConnectionError' && 
            error.name !== 'WalletNotConnectedError' &&
            error.name !== 'WalletNotReadyError' &&
            error.message !== 'User rejected the request'
          ) {
            console.error('Wallet adapter error:', error)
          }
        }}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
