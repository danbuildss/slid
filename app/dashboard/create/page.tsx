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
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold">
            slid<span className="text-primary">.</span>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/dashboard" className="text-muted hover:text-foreground transition-colors mb-6 inline-block">
            ← Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create a Slid</h1>
          <p className="text-muted mb-8">Fill in the details for your invoice</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Info */}
            <div className="card space-y-4">
              <h2 className="font-semibold text-lg">Client Information</h2>
              
              <div>
                <label className="block text-sm text-muted mb-2">Client Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="John Doe or Company Name"
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Client Email (optional)</label>
                <input
                  type="email"
                  className="input"
                  placeholder="client@example.com"
                  value={form.client_email}
                  onChange={(e) => setForm({ ...form, client_email: e.target.value })}
                />
              </div>
            </div>

            {/* Invoice Details */}
            <div className="card space-y-4">
              <h2 className="font-semibold text-lg">Invoice Details</h2>
              
              <div>
                <label className="block text-sm text-muted mb-2">Amount (USDC) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input pl-8"
                    placeholder="500.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Description *</label>
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

            {/* Agreement (Optional) */}
            <div className="card space-y-4">
              <h2 className="font-semibold text-lg">Agreement (Optional)</h2>
              <p className="text-sm text-muted">Add scope and terms for client to agree to before paying</p>
              
              <div>
                <label className="block text-sm text-muted mb-2">Scope of Work</label>
                <textarea
                  className="input min-h-[100px]"
                  placeholder="Describe what you'll deliver..."
                  value={form.scope}
                  onChange={(e) => setForm({ ...form, scope: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Terms & Conditions</label>
                <textarea
                  className="input min-h-[100px]"
                  placeholder="Payment terms, refund policy, etc."
                  value={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.value })}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !form.client_name || !form.amount || !form.description}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Slid →'}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  )
}
