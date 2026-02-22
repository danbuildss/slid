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
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'pending'>('all')

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

  const filteredSlids = slids.filter(slid => {
    if (activeTab === 'all') return true
    return slid.status === activeTab
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
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
          <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-sm">{address?.slice(2, 4).toUpperCase()}</span>
            </div>
            <div>
              <div className="font-semibold">{truncateAddress(address!)}</div>
              <div className="text-xs text-muted">Base Network</div>
            </div>
          </div>
          <ConnectButton showBalance={false} accountStatus="avatar" chainStatus="none" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Stats Row - Like InvoiceJet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="stat-card">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-xs text-muted mt-1">Total Invoices</div>
          </div>
          <div className="stat-card">
            <div className="text-2xl font-bold text-primary">{stats.paid}</div>
            <div className="text-xs text-muted mt-1">Paid</div>
          </div>
          <div className="stat-card">
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            <div className="text-xs text-muted mt-1">Pending</div>
          </div>
        </motion.div>

        {/* Quick Actions Grid - Like InvoiceJet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-4 mb-8"
        >
          <Link href="/dashboard/create" className="text-center group">
            <div className="action-icon bg-primary-light mx-auto mb-2 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-xs text-foreground font-medium">Create Invoice</div>
          </Link>
          <div className="text-center opacity-40 cursor-not-allowed">
            <div className="action-icon bg-blue-50 mx-auto mb-2">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-xs text-muted">Customers</div>
          </div>
          <div className="text-center opacity-40 cursor-not-allowed">
            <div className="action-icon bg-orange-50 mx-auto mb-2">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-xs text-muted">Expenses</div>
          </div>
          <div className="text-center opacity-40 cursor-not-allowed">
            <div className="action-icon bg-purple-50 mx-auto mb-2">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-xs text-muted">Reports</div>
          </div>
        </motion.div>

        {/* Recent Transactions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-semibold text-lg mb-4">Recent Transactions</h2>

          {/* Tabs - Like InvoiceJet */}
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'all' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              All Invoices
            </button>
            <button 
              onClick={() => setActiveTab('paid')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'paid' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              Paid
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'pending' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              Pending
            </button>
          </div>

          {loading ? (
            <div className="card text-center py-12">
              <div className="animate-pulse text-muted">Loading...</div>
            </div>
          ) : filteredSlids.length === 0 ? (
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
              {filteredSlids.map((slid, i) => (
                <motion.div
                  key={slid.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                >
                  <Link 
                    href={`/dashboard/share/${slid.short_id}`}
                    className="card flex items-center gap-4 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    {/* Avatar */}
                    <div className="w-11 h-11 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-semibold text-primary">
                        {slid.client_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground">{slid.client_name}</div>
                      <div className="text-xs text-muted">
                        #{slid.short_id} • {formatDate(slid.created_at)}
                      </div>
                    </div>
                    
                    {/* Amount & Status */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold font-mono text-foreground">
                        ${Number(slid.amount).toLocaleString()}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full inline-block font-medium ${
                        slid.status === 'paid' 
                          ? 'bg-primary-light text-primary' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {slid.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Nav - Like InvoiceJet */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border shadow-lg">
        <div className="max-w-lg mx-auto px-6 py-3 flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-primary">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>
          <Link href="/dashboard/create" className="flex flex-col items-center gap-1 text-muted hover:text-foreground transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs">Invoices</span>
          </Link>
          <button className="flex flex-col items-center gap-1 text-muted opacity-40 cursor-not-allowed">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Reports</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted opacity-40 cursor-not-allowed">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs">Menu</span>
          </button>
        </div>
      </nav>
    </main>
  )
}
