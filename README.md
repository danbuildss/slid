# Slid

**Crypto invoicing with swipe-to-pay. Built on Base.**

Create invoices with agreements, share a link, get paid in USDC instantly.

![Slid](https://slid.vercel.app/og-image.png)

## Features

- **Wallet Connect** — RainbowKit integration for seamless Base wallet connection
- **Create Invoices** — Add client details, amount, scope of work, and payment terms
- **Share Links** — Send via Telegram, WhatsApp, Twitter, or any messaging app
- **Swipe to Pay** — Clients agree to terms and pay with one swipe gesture
- **USDC on Base** — Instant settlement, low fees, fast confirmations
- **Light/Dark Mode** — Toggle between themes with saved preference
- **Receipt Page** — Transaction confirmation with BaseScan link

## How It Works

1. **Connect Wallet** — Sign in with your Base wallet
2. **Create Invoice** — Add client, amount, description, and optional agreement terms
3. **Share Link** — Send the payment link to your client
4. **Get Paid** — Client swipes to agree and pay, USDC lands in your wallet

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Wallet:** RainbowKit + wagmi + viem
- **Database:** Supabase
- **Animation:** Framer Motion
- **Chain:** Base (USDC)
- **Deployment:** Vercel

## Getting Started

```bash
# Clone the repo
git clone https://github.com/danbuildss/slid.git
cd slid

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase and WalletConnect credentials

# Run development server
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

## Database Schema

```sql
CREATE TABLE slids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_id VARCHAR(10) UNIQUE NOT NULL,
  creator_address VARCHAR(42) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_address VARCHAR(42),
  amount DECIMAL(18, 6) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USDC',
  description TEXT NOT NULL,
  scope TEXT,
  terms TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  tx_hash VARCHAR(66),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Links

- **Live App:** [slid.vercel.app](https://slid.vercel.app)
- **Twitter:** [@slidmoney](https://twitter.com/slidmoney)
- **Built by:** [@danbuildss](https://twitter.com/danbuildss)

## License

MIT

---

**Why Base Media** • Built with AI
