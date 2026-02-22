'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      
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
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8"
        >
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm text-primary font-medium">Built on Base</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold leading-tight mb-6"
        >
          Agreements + Invoices.
          <br />
          <span className="text-primary">One swipe.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-muted max-w-2xl mb-10"
        >
          Create an agreement, add your invoice, share the link. 
          Your client signs and pays in one swipe. Money hits your wallet instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
            Get Started — Free
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
      <section id="how-it-works" className="relative z-10 px-6 py-24 bg-surface/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-muted text-lg">Three steps. Under a minute.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your Slid',
                desc: 'Add client details, amount, scope of work, and terms. Takes 30 seconds.',
              },
              {
                step: '02',
                title: 'Share the link',
                desc: 'Send via Telegram, WhatsApp, email, or cast it on Farcaster.',
              },
              {
                step: '03',
                title: 'Get paid instantly',
                desc: 'Client reviews, agrees, and swipes to pay. USDC hits your wallet.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card hover:border-primary/30 transition-colors"
              >
                <div className="text-5xl font-bold text-primary/20 mb-4 font-mono">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Swipe Preview */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">The swipe that pays</h2>
            <p className="text-muted text-lg">Your client sees this. One action to sign and pay.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card max-w-md mx-auto"
          >
            <div className="text-center mb-6">
              <div className="text-sm text-muted mb-2">Invoice from</div>
              <div className="text-xl font-semibold">dan.eth</div>
            </div>
            
            <div className="text-center py-8 border-y border-border">
              <div className="text-4xl font-bold font-mono text-primary mb-2">$500.00</div>
              <div className="text-muted">USDC on Base</div>
            </div>
            
            <div className="mt-6 text-sm text-muted text-center mb-4">
              Podcast editing - Episode 5
            </div>
            
            <div className="relative h-14 bg-primary/10 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-primary font-medium">
                SWIPE TO PAY →
              </div>
              <motion.div
                className="absolute left-1 top-1 bottom-1 w-12 bg-primary rounded-lg flex items-center justify-center swipe-hint"
              >
                <span className="text-background text-xl">→</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24 bg-surface/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to get paid faster?</h2>
          <p className="text-muted text-lg mb-8">
            Free to start. 2% only when you get paid.
          </p>
          <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
            Create your first Slid
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-border">
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
