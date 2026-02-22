'use client'

import { useState, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { supabase, Slid } from '@/lib/supabase'

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [slids, setSlids] = useState<Slid[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, paid: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (address) {
      loadSlids()
    } else {
      setSlids([])
      setStats({ total: 0, pending: 0, paid: 0, revenue: 0 })
      setLoading(false)
    }
  }, [address])

  const loadSlids = async () => {
    if (!address) return
    setLoading(true)
    
    const { data, error } = await supabase
      .from('slids')
      .select('*')
      .eq('creator_address', address.toLowerCase())
      .order('created_at', { ascending: false })

    if (!error && data) {
      setSlids(data)
      const paid = data.filter(s => s.status === 'paid')
      setStats({
        total: data.length,
        pending: data.filter(s => s.status === 'pending').length,
        paid: paid.length,
        revenue: paid.reduce((sum, s) => sum + Number(s.amount), 0)
      })
    }
    setLoading(false)
  }

  // Not connected state
  if (!isConnected) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-6">👋</div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Slid</h1>
          <p className="text-muted mb-8">
            Connect your wallet to create invoices and get paid in crypto.
          </p>
          <ConnectButton />
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            slid<span className="text-primary">.</span>
          </Link>
          <div className="flex items-center gap-4">
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="card">
            <div className="text-sm text-muted mb-1">Total Slids</div>
            <div className="text-3xl font-bold font-mono">{stats.total}</div>
          </div>
          <div className="card">
            <div className="text-sm text-muted mb-1">Pending</div>
            <div className="text-3xl font-bold font-mono text-yellow-500">{stats.pending}</div>
          </div>
          <div className="card">
            <div className="text-sm text-muted mb-1">Paid</div>
            <div className="text-3xl font-bold font-mono text-primary">{stats.paid}</div>
          </div>
          <div className="card">
            <div className="text-sm text-muted mb-1">Revenue</div>
            <div className="text-3xl font-bold font-mono text-primary">${stats.revenue.toLocaleString()}</div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your Slids</h2>
          <Link href="/dashboard/create" className="btn-primary">
            + Create Slid
          </Link>
        </div>

        {/* Slid List or Empty State */}
        {loading ? (
          <div className="card text-center py-12">
            <div className="text-muted">Loading...</div>
          </div>
        ) : slids.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-16"
          >
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">No slids yet</h3>
            <p className="text-muted mb-6">Create your first invoice to get started</p>
            <Link href="/dashboard/create" className="btn-primary">
              Create your first Slid
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {slids.map((slid, i) => (
              <motion.div
                key={slid.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{slid.client_name}</div>
                    <div className="text-sm text-muted">{slid.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold font-mono">${Number(slid.amount).toLocaleString()}</div>
                    <div className={`text-sm ${
                      slid.status === 'paid' ? 'text-primary' : 
                      slid.status === 'pending' ? 'text-yellow-500' : 'text-muted'
                    }`}>
                      {slid.status.charAt(0).toUpperCase() + slid.status.slice(1)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
