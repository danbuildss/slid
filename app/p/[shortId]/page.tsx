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
  const background = useTransform(x, [0, 200], ['rgba(0,212,126,0.1)', 'rgba(0,212,126,1)'])
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
      const amount = parseUnits(slid.amount.toString(), 6)
      
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
      animate(x, 220, { duration: 0.2 })
      handlePay()
    } else {
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
          <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
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
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Complete</h1>
          <p className="text-muted mb-6">
            ${Number(slid.amount).toLocaleString()} USDC sent to {slid.creator_address?.slice(0, 6)}...{slid.creator_address?.slice(-4)}
          </p>
          {slid.tx_hash && (
            <a
              href={`https://basescan.org/tx/${slid.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm inline-flex items-center gap-1"
            >
              View on BaseScan
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
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
          <span className="text-xl font-bold text-foreground">slid<span className="text-primary">.</span></span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Invoice Card - Like InvoiceJet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-3xl shadow-lg overflow-hidden mb-6"
        >
          {/* Green Header */}
          <div className="bg-primary px-6 py-8 text-center">
            <div className="text-sm text-white/80 mb-1">Payment #{slid.short_id}</div>
            <div className="text-5xl font-bold font-mono text-white">
              ${Number(slid.amount).toLocaleString()}
            </div>
          </div>

          {/* White Body */}
          <div className="p-6">
            {/* Client Info */}
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">
                  {slid.client_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">{slid.client_name}</div>
                <div className="text-sm text-muted">{slid.client_email || 'No email'}</div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                Pending
              </span>
            </div>

            {/* Invoice Details */}
            <div className="py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Description</span>
                <span className="text-foreground font-medium">{slid.description}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Network</span>
                <span className="text-foreground font-medium">Base (USDC)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Recipient</span>
                <span className="text-foreground font-medium font-mono">
                  {slid.creator_address?.slice(0, 8)}...{slid.creator_address?.slice(-6)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <span className="font-semibold text-foreground">TOTAL</span>
              <span className="text-2xl font-bold font-mono text-primary">
                ${Number(slid.amount).toLocaleString()}
              </span>
            </div>
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
            <h3 className="font-semibold mb-4 text-foreground">Agreement</h3>
            
            {slid.scope && (
              <div className="mb-4">
                <div className="text-sm text-muted mb-2">Scope of Work</div>
                <div className="text-sm bg-surface-light rounded-xl p-4 text-foreground">{slid.scope}</div>
              </div>
            )}
            
            {slid.terms && (
              <div className="mb-4">
                <div className="text-sm text-muted mb-2">Terms & Conditions</div>
                <div className="text-sm bg-surface-light rounded-xl p-4 text-foreground">{slid.terms}</div>
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
              className="relative h-16 bg-surface rounded-2xl overflow-hidden border border-border shadow-sm"
            >
              <motion.div 
                className="absolute inset-0 rounded-2xl"
                style={{ background }}
              />
              
              {/* Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-muted font-medium">
                  {paying || isPending || isConfirming ? 'Processing...' : 'Swipe to Pay'}
                </span>
              </div>

              {/* Check mark */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: checkOpacity }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
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
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.div>
              )}
              
              {/* Loading spinner */}
              {(paying || isPending || isConfirming) && (
                <div className="absolute left-1 top-1 bottom-1 w-14 bg-primary rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          Powered by <span className="text-foreground font-medium">slid</span> • Payments on Base
        </div>
      </div>
    </main>
  )
}
