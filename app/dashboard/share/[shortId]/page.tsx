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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
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
          <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-foreground">Invoice not found</h1>
          <Link href="/dashboard" className="text-primary hover:underline">Go to Dashboard</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="w-10 h-10 bg-surface-light rounded-full flex items-center justify-center hover:bg-border transition-colors">
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground">Invoice Created</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-muted">Share this link with your client</p>
          </div>

          {/* Invoice Card */}
          <div className="bg-surface rounded-2xl shadow-lg overflow-hidden mb-6 border border-border">
            <div className="bg-primary px-5 py-6">
              <div className="text-sm text-white/80 mb-1">Invoice #{slid.short_id}</div>
              <div className="text-4xl font-bold font-mono text-white">
                ${Number(slid.amount).toLocaleString()}
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="w-11 h-11 bg-primary-light rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">
                    {slid.client_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{slid.client_name}</div>
                  <div className="text-sm text-muted">{slid.description}</div>
                </div>
              </div>
              <div className="pt-4 flex justify-between items-center">
                <span className="text-sm text-muted">{formatDate(slid.created_at)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  slid.status === 'paid' 
                    ? 'bg-primary-light text-primary' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {slid.status === 'paid' ? 'Paid' : 'Awaiting Payment'}
                </span>
              </div>
            </div>
          </div>

          {/* Share Link */}
          <div className="card mb-6">
            <div className="text-sm text-muted mb-3">Payment Link</div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={payLink}
                className="input flex-1 text-sm font-mono bg-surface-light"
              />
              <button
                onClick={copyLink}
                className="btn-primary whitespace-nowrap"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(payLink)}&text=${encodeURIComponent(`Invoice for $${slid.amount} - ${slid.description}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card hover:border-primary/30 hover:shadow-md transition-all py-4 text-center"
            >
              <svg className="w-6 h-6 mx-auto mb-2 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <div className="text-xs text-foreground font-medium">Telegram</div>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Invoice for $${slid.amount}: ${payLink}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card hover:border-primary/30 hover:shadow-md transition-all py-4 text-center"
            >
              <svg className="w-6 h-6 mx-auto mb-2 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div className="text-xs text-foreground font-medium">WhatsApp</div>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Invoice ready: ${payLink}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card hover:border-primary/30 hover:shadow-md transition-all py-4 text-center"
            >
              <svg className="w-6 h-6 mx-auto mb-2 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <div className="text-xs text-foreground font-medium">Twitter</div>
            </a>
          </div>

          <Link href="/dashboard" className="block text-center text-muted hover:text-foreground transition-colors text-sm">
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
