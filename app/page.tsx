'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          slid<span className="text-primary">.</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/dashboard" className="btn-primary">
            Launch App
          </Link>
        </motion.div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light border border-primary/20 rounded-full mb-8"
        >
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          <span className="text-sm text-primary font-medium">Built on Base</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-foreground"
        >
          Invoices + Agreements.
          <br />
          <span className="text-primary">One swipe.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-muted max-w-2xl mb-10"
        >
          Create an invoice, add your terms, share the link. 
          Your client agrees and pays in one swipe. USDC hits your wallet instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
            Get Started Free
          </Link>
          <Link href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
            How it works
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-12 mt-16 pt-8 border-t border-border"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground font-mono">2%</div>
            <div className="text-sm text-muted">Platform fee</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground font-mono">~5s</div>
            <div className="text-sm text-muted">Payment time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground font-mono">$0</div>
            <div className="text-sm text-muted">Gas for clients</div>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 px-6 py-20 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-foreground">How it works</h2>
            <p className="text-muted text-lg">Three steps. Under a minute.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your invoice',
                desc: 'Add client details, amount, scope of work, and payment terms.',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )
              },
              {
                step: '02',
                title: 'Share the link',
                desc: 'Send via Telegram, WhatsApp, email, or any messaging app.',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )
              },
              {
                step: '03',
                title: 'Get paid instantly',
                desc: 'Client agrees, swipes to pay. USDC lands in your wallet.',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <div className="text-sm text-primary font-medium mb-2">Step {item.step}</div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Swipe Preview */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-foreground">The swipe that pays</h2>
            <p className="text-muted">Your client sees this. One action to agree and pay.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-surface rounded-3xl shadow-xl overflow-hidden"
          >
            {/* Green header */}
            <div className="bg-primary px-6 py-8 text-center">
              <div className="text-sm text-white/80 mb-1">Payment #abc123</div>
              <div className="text-4xl font-bold font-mono text-white">$500.00</div>
            </div>
            
            {/* White body */}
            <div className="p-6">
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">D</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">dan.eth</div>
                  <div className="text-sm text-muted">Podcast editing</div>
                </div>
              </div>
              
              <div className="py-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted">Network</span>
                  <span className="text-foreground">Base (USDC)</span>
                </div>
              </div>
              
              {/* Swipe button preview */}
              <div className="relative h-14 bg-primary/10 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted font-medium">
                  Swipe to Pay
                </div>
                <div className="absolute left-1 top-1 bottom-1 w-12 bg-primary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-20 bg-surface">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to get paid faster?</h2>
          <p className="text-muted text-lg mb-8">
            Free to start. 2% only when you get paid.
          </p>
          <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
            Create your first invoice
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-muted text-sm">
            Built by{' '}
            <a href="https://twitter.com/danbuildss" className="text-foreground hover:text-primary transition-colors">
              @danbuildss
            </a>
            {' '}• Why Base Media
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <a href="#" className="hover:text-foreground transition-colors">Docs</a>
            <a href="https://twitter.com/slidmoney" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="https://warpcast.com/slid" className="hover:text-foreground transition-colors">Farcaster</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
