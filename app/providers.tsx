'use client'

import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi'
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

// Farcaster context
const FarcasterContext = createContext<{
  isInFrame: boolean
  context: any | null
}>({
  isInFrame: false,
  context: null,
})

export const useFarcaster = () => useContext(FarcasterContext)

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')
  const [isInFrame, setIsInFrame] = useState(false)
  const [fcContext, setFcContext] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    
    // Theme
    const saved = localStorage.getItem('slid-theme') as Theme
    if (saved) {
      setTheme(saved)
      document.documentElement.classList.toggle('dark', saved === 'dark')
    }

    // Farcaster SDK init
    const initFarcaster = async () => {
      try {
        const sdk = (await import('@farcaster/frame-sdk')).default
        const inMiniApp = await sdk.isInMiniApp()
        setIsInFrame(inMiniApp)
        
        if (inMiniApp) {
          const ctx = await sdk.context
          setFcContext(ctx)
          await sdk.actions.ready()
        }
      } catch (e) {
        console.log('Farcaster SDK not available')
      }
    }
    
    initFarcaster()
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('slid-theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  if (!mounted) {
    return null
  }

  return (
    <FarcasterContext.Provider value={{ isInFrame, context: fcContext }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
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
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeContext.Provider>
    </FarcasterContext.Provider>
  )
}
