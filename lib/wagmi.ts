'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { farcasterFrame } from '@farcaster/miniapp-wagmi-connector'
import { base } from 'wagmi/chains'
import { http, createConfig } from 'wagmi'

// Standard config for web
export const config = getDefaultConfig({
  appName: 'Slid',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [base],
  ssr: true,
})

// Frame-specific config with Farcaster connector
export const frameConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [farcasterFrame()],
})
