'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { supabase, Slid } from '@/lib/supabase'

export default function ShareSlid() {
  const params = useParams()
  const shortId = params.shortId as string
  const [slid, setSlid] = useState<Slid | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  const payLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/p/${shortId}` 
    : `/p/${shortId}`

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

  const copyLink = () => {
    navigator.clipboard.writeText(payLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </main>
    )
  }

  if (!slid) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Slid not found</h1>
          <Link href="/dashboard" className="text-primary">Go to Dashboard</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold">
            slid<span className="text-primary">.</span>
          </Link>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Slid Created!</h1>
          <p className="text-muted mb-8">Share this link with your client to get paid</p>

          {/* Preview Card */}
          <div className="card mb-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-muted">Client</div>
                <div className="font-semibold">{slid.client_name}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted">Amount</div>
                <div className="text-2xl font-bold font-mono text-primary">
                  ${Number(slid.amount).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted">{slid.description}</div>
          </div>

          {/* Share Link */}
          <div className="card mb-6">
            <div className="text-sm text-muted mb-2">Payment Link</div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={payLink}
                className="input flex-1 text-sm font-mono"
              />
              <button
                onClick={copyLink}
                className="btn-primary whitespace-nowrap"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(payLink)}&text=${encodeURIComponent(`Invoice for $${slid.amount} - ${slid.description}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card hover:border-primary/30 transition-colors py-4"
            >
              <div className="text-2xl mb-1">📱</div>
              <div className="text-sm">Telegram</div>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Invoice for $${slid.amount}: ${payLink}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card hover:border-primary/30 transition-colors py-4"
            >
              <div className="text-2xl mb-1">💬</div>
              <div className="text-sm">WhatsApp</div>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just created an invoice with @slidmoney - the easiest way to get paid in crypto! ${payLink}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card hover:border-primary/30 transition-colors py-4"
            >
              <div className="text-2xl mb-1">𝕏</div>
              <div className="text-sm">Twitter</div>
            </a>
          </div>

          <Link href="/dashboard" className="text-muted hover:text-foreground transition-colors">
            ← Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
