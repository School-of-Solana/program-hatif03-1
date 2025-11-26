'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Header = () => {
  const [isMounted, setIsMounted] = useState(false)
  const wallet = useWallet()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Debug: Log wallet state
  useEffect(() => {
    if (isMounted && wallet) {
      console.log('Wallet state:', {
        connected: wallet.connected,
        publicKey: wallet.publicKey?.toBase58(),
        wallets: wallet.wallets?.length,
      })
    }
  }, [isMounted, wallet])

  return (
    <header className="p-4 border-b border-gray-300 mb-4">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex justify-start items-center space-x-8">
          <Link href="/">
            <h4 className="text-black text-2xl font-extrabold">Votee</h4>
          </Link>

          <div className="flex justify-start items-center space-x-2">
            <Link href={'/create'}>Create</Link>
          </div>
        </div>

        {isMounted && (
          <div style={{ position: 'relative', zIndex: 1000 }}>
            <WalletMultiButton
              style={{ backgroundColor: '#F97316', color: 'white' }}
            />
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
