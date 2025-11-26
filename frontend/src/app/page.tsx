'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  fetchAllPolls,
  getCounter,
  getProvider,
  getReadonlyProvider,
  initialize,
} from '../app/services/blockchain.service'
import Link from 'next/link'
import { Poll } from './utils/interfaces'
import { BN } from '@coral-xyz/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'react-toastify'

export default function Page() {
  const [polls, setPolls] = useState<Poll[]>([])
  const { publicKey, signTransaction, sendTransaction } = useWallet()
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [rpcError, setRpcError] = useState<boolean>(false)
  const programReadOnly = useMemo(() => getReadonlyProvider(), [])

  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  )

  const fetchData = async () => {
    try {
      setRpcError(false)
      const pollsData = await fetchAllPolls(programReadOnly)
      setPolls(pollsData)
      const count = await getCounter(programReadOnly)
      // If count is -1, it means RPC connection failed
      if (count.eq(new BN(-1))) {
        setRpcError(true)
        setIsInitialized(false)
      } else {
        setIsInitialized(count.gte(new BN(0)))
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      // Set default values on error
      setPolls([])
      setIsInitialized(false)
      setRpcError(true)
    }
  }

  useEffect(() => {
    if (!programReadOnly) return
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programReadOnly])

  const handleInit = async () => {
    // alert(isInitialized && !!publicKey)
    if (isInitialized && !!publicKey) return

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          const tx = await initialize(program!, publicKey!)
          console.log(tx)

          await fetchData()
          resolve(tx as any)
        } catch (error) {
          console.error('Transaction failed:', error)
          reject(error)
        }
      }),
      {
        pending: 'Approve transaction...',
        success: 'Transaction successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div className="flex flex-col items-center py-10">
      {rpcError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg mb-6 max-w-2xl">
          <p className="font-semibold">⚠️ RPC Connection Failed</p>
          <p className="mt-2">
            Make sure the Solana localnet validator is running. Start it with:
          </p>
          <code className="block mt-2 bg-yellow-50 p-2 rounded">
            solana-test-validator
          </code>
          <p className="mt-2 text-sm">
            Or update NEXT_PUBLIC_RPC_URL in your .env file to use a different RPC endpoint.
          </p>
        </div>
      )}
      {isInitialized && polls.length > 0 && (
        <h2 className="bg-gray-800 text-white rounded-full px-6 py-2 text-lg font-bold mb-8">
          List of Polls
        </h2>
      )}

      {isInitialized && polls.length < 1 && (
        <>
          <h2 className="bg-gray-800 text-white rounded-full px-6 py-2 text-lg font-bold mb-8">
            List of Polls
          </h2>
          <p>We don&apos;t have any polls yet, be the first to create one.</p>
        </>
      )}

      {!isInitialized && publicKey && (
        <button
          onClick={handleInit}
          className="bg-gray-800 text-white rounded-full
          px-6 py-2 text-lg font-bold mb-8"
        >
          Initialize
        </button>
      )}

      {!publicKey && polls.length < 1 && (
        <>
          <h2 className="bg-gray-800 text-white rounded-full px-6 py-2 text-lg font-bold mb-8">
            List of Polls
          </h2>
          <p>We don&apos;t have any polls yet, please connect wallet.</p>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-4/5">
        {polls.map((poll) => (
          <div
            key={poll.publicKey}
            className="bg-white border border-gray-300 rounded-xl shadow-lg p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {poll.description.length > 20
                ? poll.description.slice(0, 25) + '...'
                : poll.description}
            </h3>
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-semibold">Starts:</span>{' '}
                {new Date(poll.start).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Ends:</span>{' '}
                {new Date(poll.end).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Candidates:</span>{' '}
                {poll.candidates}
              </p>
            </div>

            <div className="w-full">
              <Link
                href={`/polls/${poll.publicKey}`}
                className="bg-black text-white font-bold py-2 px-4 rounded-lg
              hover:bg-gray-900 transition duration-200 w-full block text-center"
              >
                View Poll
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
