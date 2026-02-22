'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { supabase, Slid } from '@/lib/supabase'

export default function Dashboard() {
  const { address, isConnected } = useAccount()
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

  const truncateAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`

  // Not connected state
  if (!isConnected) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">💸</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Slid</h1>
          <p className="text-muted mb-8">
            Connect your wallet to create invoices and get paid in crypto.
          </p>
          <ConnectButton />
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-lg">👋</span>
            </div>
            <div>
              <div className="text-sm text-muted">Welcome back</div>
              <div className="font-semibold">{truncateAddress(address!)}</div>
            </div>
          </div>
          <ConnectButton showBalance={false} accountStatus="avatar" chainStatus="icon" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Total Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-3xl p-6 mb-6 text-background"
        >
          <div className="text-sm opacity-80 mb-1">Total Revenue</div>
          <div className="text-4xl font-bold font-mono mb-4">
            ${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 text-sm opacity-80">
            <span className="w-2 h-2 bg-background rounded-full"></span>
            <span>USDC on Base</span>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="card text-center py-4">
            <div className="text-2xl font-bold font-mono">{stats.total}</div>
            <div className="text-xs text-muted">Total Slids</div>
          </div>
          <div className="card text-center py-4">
            <div className="text-2xl font-bold font-mono text-primary">{stats.paid}</div>
            <div className="text-xs text-muted">Paid</div>
          </div>
          <div className="card text-center py-4">
            <div className="text-2xl font-bold font-mono text-yellow-500">{stats.pending}</div>
            <div className="text-xs text-muted">Pending</div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-4 gap-3 mb-8"
        >
          <Link href="/dashboard/create" className="card text-center py-4 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">➕</span>
            </div>
            <div className="text-xs text-muted">Create</div>
          </Link>
          <div className="card text-center py-4 opacity-50 cursor-not-allowed">
            <div className="w-12 h-12 bg-surface-light rounded-2xl flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">📊</span>
            </div>
            <div className="text-xs text-muted">Analytics</div>
          </div>
          <div className="card text-center py-4 opacity-50 cursor-not-allowed">
            <div className="w-12 h-12 bg-surface-light rounded-2xl flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">👥</span>
            </div>
            <div className="text-xs text-muted">Clients</div>
          </div>
          <div className="card text-center py-4 opacity-50 cursor-not-allowed">
            <div className="w-12 h-12 bg-surface-light rounded-2xl flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">⚙️</span>
            </div>
            <div className="text-xs text-muted">Settings</div>
          </div>
        </motion.div>

        {/* Recent Slids */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Slids</h2>
            {slids.length > 0 && (
              <span className="text-sm text-muted">See all</span>
            )}
          </div>

          {loading ? (
            <div className="card text-center py-12">
              <div className="animate-pulse text-muted">Loading...</div>
            </div>
          ) : slids.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="font-semibold mb-1">No slids yet</h3>
              <p className="text-sm text-muted mb-4">Create your first invoice</p>
              <Link href="/dashboard/create" className="btn-primary text-sm">
                Create Slid
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {slids.map((slid, i) => (
                <motion.div
                  key={slid.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                >
                  <Link 
                    href={`/dashboard/share/${slid.short_id}`}
                    className="card flex items-center gap-4 hover:border-primary/30 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-primary">
                        {slid.client_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{slid.client_name}</div>
                      <div className="text-sm text-muted truncate">{slid.description}</div>
                    </div>
                    
                    {/* Amount & Status */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold font-mono">
                        ${Number(slid.amount).toLocaleString()}
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                        slid.status === 'paid' 
                          ? 'bg-primary/20 text-primary' 
                          : slid.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-muted/20 text-muted'
                      }`}>
                        {slid.status.charAt(0).toUpperCase() + slid.status.slice(1)}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-primary">
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </button>
          <Link href="/dashboard/create" className="flex flex-col items-center gap-1 text-muted hover:text-foreground transition-colors">
            <span className="text-xl">➕</span>
            <span className="text-xs">Create</span>
          </Link>
          <button className="flex flex-col items-center gap-1 text-muted opacity-50 cursor-not-allowed">
            <span className="text-xl">📊</span>
            <span className="text-xs">Reports</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted opacity-50 cursor-not-allowed">
            <span className="text-xl">⚙️</span>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
    </main>
  )
}
