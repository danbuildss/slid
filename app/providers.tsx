'use client'

import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config, frameConfig } from '@/lib/wagmi'
import { FarcasterProvider, useFarcaster } from '@/components/FarcasterProvider'
import { createContext, useContext, useEffect, useState } from 'react'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

function WalletProviders({ children }: { children: React.ReactNode }) {
  const { isInFrame, isSDKLoaded } = useFarcaster()
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const saved = localStorage.getItem('slid-theme') as Theme
    if (saved) {
      setTheme(saved)
      document.documentElement.classList.toggle('dark', saved === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('slid-theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  if (!isSDKLoaded) {
    return null
  }

  // Use frame config when in Farcaster, standard config otherwise
  const activeConfig = isInFrame ? frameConfig : config

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <WagmiProvider config={activeConfig}>
        <QueryClientProvider client={queryClient}>
          {isInFrame ? (
            // In frame: no RainbowKit modal needed, use Farcaster wallet
            children
          ) : (
            // On web: use RainbowKit for wallet connection
            <RainbowKitProvider
              theme={theme === 'dark' ? darkTheme({
                accentColor: '#00D47E',
                accentColorForeground: '#0A0A0B',
                borderRadius: 'large',
              }) : lightTheme({
                accentColor: '#00D47E',
                accentColorForeground: 'white',
                borderRadius: 'large',
              })}
            >
              {children}
            </RainbowKitProvider>
          )}
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeContext.Provider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <FarcasterProvider>
      <WalletProviders>{children}</WalletProviders>
    </FarcasterProvider>
  )
}
