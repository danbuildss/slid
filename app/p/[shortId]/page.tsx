'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { parseUnits } from 'viem'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { supabase, Slid } from '@/lib/supabase'

// USDC on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }]
  }
] as const

export default function PayPage() {
  const params = useParams()
  const shortId = params.shortId as string
  const { address, isConnected } = useAccount()
  
  const [slid, setSlid] = useState<Slid | null>(null)
  const [loading, setLoading] = useState(true)
  const [agreed, setAgreed] = useState(false)
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  
  // Swipe state
  const constraintsRef = useRef(null)
  const x = useMotionValue(0)
  const background = useTransform(x, [0, 200], ['#00D47E20', '#00D47E'])
  const checkOpacity = useTransform(x, [150, 200], [0, 1])
  
  // Contract interaction
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    loadSlid()
  }, [shortId])

  useEffect(() => {
    if (isSuccess && hash && slid) {
      updateSlidStatus(hash)
    }
  }, [isSuccess, hash])

  const loadSlid = async () => {
    const { data, error } = await supabase
      .from('slids')
      .select('*')
      .eq('short_id', shortId)
      .single()

    if (!error && data) {
      setSlid(data)
      if (data.status === 'paid') {
        setPaid(true)
      }
    }
    setLoading(false)
  }

  const updateSlidStatus = async (txHash: string) => {
    await supabase
      .from('slids')
      .update({ 
        status: 'paid', 
        tx_hash: txHash,
        paid_at: new Date().toISOString(),
        client_address: address?.toLowerCase()
      })
      .eq('short_id', shortId)
    
    setPaid(true)
    setPaying(false)
  }

  const handlePay = async () => {
    if (!slid || !address) return
    
    setPaying(true)
    
    try {
      const amount = parseUnits(slid.amount.toString(), 6) // USDC has 6 decimals
      
      writeContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [slid.creator_address as `0x${string}`, amount]
      })
    } catch (error) {
      console.error('Payment error:', error)
      setPaying(false)
    }
  }

  const handleSwipeEnd = () => {
    const currentX = x.get()
    if (currentX > 180) {
      // Trigger payment
      animate(x, 220, { duration: 0.2 })
      handlePay()
    } else {
      // Reset
      animate(x, 0, { duration: 0.3 })
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading...</div>
      </main>
    )
  }

  if (!slid) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Invoice not found</h1>
          <p className="text-muted">This link may be expired or invalid</p>
        </div>
      </main>
    )
  }

  // Already paid
  if (paid || slid.status === 'paid') {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Complete!</h1>
          <p className="text-muted mb-6">
            ${Number(slid.amount).toLocaleString()} USDC sent to {slid.creator_address?.slice(0, 6)}...{slid.creator_address?.slice(-4)}
          </p>
          {slid.tx_hash && (
            <a
              href={`https://basescan.org/tx/${slid.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              View on BaseScan →
            </a>
          )}
        </motion.div>
      </main>
    )
  }

  const hasAgreement = slid.scope || slid.terms
  const canPay = !hasAgreement || agreed

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-center">
          <span className="text-xl font-bold">slid<span className="text-primary">.</span></span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Invoice Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          {/* From */}
          <div className="text-center mb-6">
            <div className="text-sm text-muted mb-1">Invoice from</div>
            <div className="font-semibold">
              {slid.creator_address?.slice(0, 6)}...{slid.creator_address?.slice(-4)}
            </div>
          </div>

          {/* Amount */}
          <div className="text-center py-8 border-y border-border">
            <div className="text-5xl font-bold font-mono text-primary mb-2">
              ${Number(slid.amount).toLocaleString()}
            </div>
            <div className="text-muted flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              USDC on Base
            </div>
          </div>

          {/* Details */}
          <div className="py-4">
            <div className="text-sm text-muted mb-1">For</div>
            <div className="font-medium">{slid.description}</div>
            {slid.client_name && (
              <div className="text-sm text-muted mt-2">To: {slid.client_name}</div>
            )}
          </div>
        </motion.div>

        {/* Agreement Section */}
        {hasAgreement && !agreed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card mb-6"
          >
            <h3 className="font-semibold mb-4">Agreement</h3>
            
            {slid.scope && (
              <div className="mb-4">
                <div className="text-sm text-muted mb-1">Scope of Work</div>
                <div className="text-sm bg-surface-light rounded-lg p-3">{slid.scope}</div>
              </div>
            )}
            
            {slid.terms && (
              <div className="mb-4">
                <div className="text-sm text-muted mb-1">Terms & Conditions</div>
                <div className="text-sm bg-surface-light rounded-lg p-3">{slid.terms}</div>
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-border bg-surface accent-primary"
              />
              <span className="text-sm text-muted">
                I have read and agree to the scope of work and terms above
              </span>
            </label>
          </motion.div>
        )}

        {/* Connect Wallet or Pay */}
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-muted mb-4">Connect your wallet to pay</p>
            <ConnectButton />
          </motion.div>
        ) : canPay ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Swipe to Pay */}
            <div 
              ref={constraintsRef}
              className="relative h-16 bg-surface rounded-2xl overflow-hidden border border-border"
            >
              <motion.div 
                className="absolute inset-0 rounded-2xl"
                style={{ background }}
              />
              
              {/* Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-muted font-medium">
                  {paying || isPending || isConfirming ? 'Processing...' : 'Swipe to Pay →'}
                </span>
              </div>

              {/* Check mark */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: checkOpacity }}
              >
                <span className="text-background text-2xl font-bold">✓</span>
              </motion.div>

              {/* Draggable button */}
              {!paying && !isPending && !isConfirming && (
                <motion.div
                  drag="x"
                  dragConstraints={constraintsRef}
                  dragElastic={0}
                  onDragEnd={handleSwipeEnd}
                  style={{ x }}
                  className="absolute left-1 top-1 bottom-1 w-14 bg-primary rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg"
                >
                  <span className="text-background text-xl">→</span>
                </motion.div>
              )}
              
              {/* Loading spinner */}
              {(paying || isPending || isConfirming) && (
                <div className="absolute left-1 top-1 bottom-1 w-14 bg-primary rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-background border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <p className="text-center text-xs text-muted mt-3">
              {isConfirming ? 'Confirming on Base...' : 'Slide right to confirm payment'}
            </p>
          </motion.div>
        ) : (
          <div className="text-center text-muted">
            Please agree to the terms above to continue
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-muted">
          Powered by <span className="text-foreground">slid</span> • Payments on Base
        </div>
      </div>
    </main>
  )
}
