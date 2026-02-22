'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { nanoid } from 'nanoid'
import { supabase } from '@/lib/supabase'

export default function CreateSlid() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    amount: '',
    description: '',
    scope: '',
    terms: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address || !form.client_name || !form.amount || !form.description) return

    setLoading(true)
    const shortId = nanoid(8)

    const { error } = await supabase.from('slids').insert({
      short_id: shortId,
      creator_address: address.toLowerCase(),
      client_name: form.client_name,
      client_email: form.client_email || null,
      amount: parseFloat(form.amount),
      description: form.description,
      scope: form.scope || null,
      terms: form.terms || null,
      status: 'pending',
    })

    if (error) {
      console.error('Error creating slid:', error)
      alert('Failed to create slid')
      setLoading(false)
      return
    }

    router.push(`/dashboard/share/${shortId}`)
  }

  if (!isConnected) {
    router.push('/dashboard')
    return null
  }

  return (
    <main className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="w-10 h-10 bg-surface-light rounded-full flex items-center justify-center">
            <span className="text-lg">←</span>
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold">Create Slid</h1>
            <p className="text-xs text-muted">Step {step} of 2</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-surface-light">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: '50%' }}
            animate={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Amount Input - Big & Prominent */}
              <div className="text-center py-8">
                <label className="text-sm text-muted mb-4 block">Enter Amount</label>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold text-muted">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="text-5xl font-bold font-mono bg-transparent border-none outline-none text-center w-48 placeholder-border"
                    required
                  />
                </div>
                <div className="text-sm text-muted mt-2">USDC on Base</div>
              </div>

              {/* Client Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted mb-2 block">Client Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="John Doe or Company"
                    value={form.client_name}
                    onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 block">Client Email (optional)</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="client@example.com"
                    value={form.client_email}
                    onChange={(e) => setForm({ ...form, client_email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 block">Description</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Podcast editing - Episode 5"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!form.amount || !form.client_name || !form.description}
                className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
              
              <button
                type="button"
                onClick={() => {
                  // Skip agreement, submit directly
                  if (form.amount && form.client_name && form.description) {
                    handleSubmit(new Event('submit') as any)
                  }
                }}
                disabled={!form.amount || !form.client_name || !form.description}
                className="w-full text-center text-sm text-muted hover:text-foreground transition-colors disabled:opacity-50"
              >
                Skip agreement & create
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Summary Card */}
              <div className="card bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted">Invoice for</span>
                  <span className="font-semibold">{form.client_name}</span>
                </div>
                <div className="text-3xl font-bold font-mono text-primary">
                  ${parseFloat(form.amount || '0').toLocaleString()}
                </div>
                <div className="text-sm text-muted mt-1">{form.description}</div>
              </div>

              {/* Agreement Section */}
              <div className="space-y-4">
                <h2 className="font-semibold">Agreement (Optional)</h2>
                <p className="text-sm text-muted">Client will need to agree to these terms before paying</p>
                
                <div>
                  <label className="text-sm text-muted mb-2 block">Scope of Work</label>
                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Describe what you'll deliver..."
                    value={form.scope}
                    onChange={(e) => setForm({ ...form, scope: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 block">Terms & Conditions</label>
                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Payment terms, refund policy, timeline..."
                    value={form.terms}
                    onChange={(e) => setForm({ ...form, terms: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1 py-4"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-4 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Slid ✓'}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </main>
  )
}
