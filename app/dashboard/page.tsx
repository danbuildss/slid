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
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
              <span className="text-primary font-bold text-sm">{address?.slice(2, 4).toUpperCase()}</span>
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
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-xs text-muted">Create</div>
          </Link>
          <div className="card text-center py-4 opacity-40 cursor-not-allowed">
            <div className="w-12 h-12 bg-surface-light rounded-2xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-xs text-muted">Analytics</div>
          </div>
          <div className="card text-center py-4 opacity-40 cursor-not-allowed">
            <div className="w-12 h-12 bg-surface-light rounded-2xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-xs text-muted">Clients</div>
          </div>
          <div className="card text-center py-4 opacity-40 cursor-not-allowed">
            <div className="w-12 h-12 bg-surface-light rounded-2xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
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
                <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">No invoices yet</h3>
              <p className="text-sm text-muted mb-4">Create your first invoice to get started</p>
              <Link href="/dashboard/create" className="btn-primary text-sm">
                Create Invoice
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </button>
          <Link href="/dashboard/create" className="flex flex-col items-center gap-1 text-muted hover:text-foreground transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs">Create</span>
          </Link>
          <button className="flex flex-col items-center gap-1 text-muted opacity-40 cursor-not-allowed">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Reports</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted opacity-40 cursor-not-allowed">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
    </main>
  )
}
