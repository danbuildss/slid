import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://slid.vercel.app'

export const metadata: Metadata = {
  title: 'Slid — Agreements + Invoices + Payments. One swipe.',
  description: 'Get paid in crypto instantly. Create agreements and invoices, share a link, get paid with one swipe.',
  openGraph: {
    title: 'Slid — Agreements + Invoices + Payments. One swipe.',
    description: 'Get paid in crypto instantly. Create agreements and invoices, share a link, get paid with one swipe.',
    type: 'website',
    images: [`${appUrl}/og-image.png`],
  },
  other: {
    // Farcaster Frame meta tags
    'fc:frame': 'vNext',
    'fc:frame:image': `${appUrl}/og-image.png`,
    'fc:frame:button:1': 'Open Slid',
    'fc:frame:button:1:action': 'launch_frame',
    'fc:frame:button:1:target': appUrl,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
