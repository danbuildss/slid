'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { supabase, Slid } from '@/lib/supabase'

export default function ReceiptPage() {
  const params = useParams()
  const shortId = params.shortId as string
  const [slid, setSlid] = useState<Slid | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSlid()
  }, [shortId])

  const loadSlid = async () => {
    const { data, error } = await supabase
      .from('slids')
      .select('*')
      .eq('short_id', shortId)
      .single()

    if (!error && data) {
      setSlid(data)
    }
    setLoading(false)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          <h1 className="text-2xl font-bold mb-2 text-foreground">Receipt not found</h1>
          <p className="text-muted">This receipt may not exist</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-center">
          <span className="text-xl font-bold text-foreground">slid<span className="text-primary">.</span></span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Payment Successful</h1>
            <p className="text-muted">Transaction confirmed on Base</p>
          </div>

          {/* Receipt Card */}
          <div className="bg-surface rounded-3xl shadow-lg overflow-hidden border border-border mb-6">
            {/* Amount Header */}
            <div className="bg-primary px-6 py-8 text-center">
              <div className="text-sm text-white/80 mb-1">Amount Paid</div>
              <div className="text-5xl font-bold font-mono text-white">
                ${Number(slid.amount).toLocaleString()}
              </div>
              <div className="text-white/80 text-sm mt-2">USDC</div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted">Invoice ID</span>
                <span className="text-foreground font-mono">#{slid.short_id}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted">Description</span>
                <span className="text-foreground text-right max-w-[200px]">{slid.description}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted">Recipient</span>
                <span className="text-foreground font-mono text-sm">
                  {slid.creator_address?.slice(0, 8)}...{slid.creator_address?.slice(-6)}
                </span>
              </div>

              {slid.client_address && (
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted">Paid by</span>
                  <span className="text-foreground font-mono text-sm">
                    {slid.client_address?.slice(0, 8)}...{slid.client_address?.slice(-6)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted">Network</span>
                <span className="text-foreground">Base (USDC)</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted">Date</span>
                <span className="text-foreground">{slid.paid_at ? formatDate(slid.paid_at) : 'N/A'}</span>
              </div>

              <div className="flex justify-between py-3">
                <span className="text-muted">Status</span>
                <span className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-medium">
                  Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Link */}
          {slid.tx_hash && (
            <a
              href={`https://basescan.org/tx/${slid.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center justify-between hover:border-primary/30 transition-all mb-6"
            >
              <div>
                <div className="text-sm text-muted">Transaction Hash</div>
                <div className="font-mono text-sm text-foreground">
                  {slid.tx_hash.slice(0, 12)}...{slid.tx_hash.slice(-8)}
                </div>
              </div>
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}

          {/* Actions */}
          <div className="text-center">
            <Link href="/" className="text-primary hover:underline text-sm">
              Create your own invoice with Slid
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-xs text-muted">
        Powered by <span className="text-foreground font-medium">slid</span> • Crypto invoicing on Base
      </div>
    </main>
  )
}
