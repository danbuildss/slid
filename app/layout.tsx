import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Slid — Agreements + Invoices + Payments. One swipe.',
  description: 'Get paid in crypto instantly. Create agreements and invoices, share a link, get paid with one swipe.',
  openGraph: {
    title: 'Slid — Agreements + Invoices + Payments. One swipe.',
    description: 'Get paid in crypto instantly. Create agreements and invoices, share a link, get paid with one swipe.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
