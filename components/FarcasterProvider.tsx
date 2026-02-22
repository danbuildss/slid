'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import sdk from '@farcaster/frame-sdk'

interface FarcasterContextType {
  isSDKLoaded: boolean
  isInFrame: boolean
  context: any | null
  openUrl: (url: string) => void
  close: () => void
}

const FarcasterContext = createContext<FarcasterContextType>({
  isSDKLoaded: false,
  isInFrame: false,
  context: null,
  openUrl: () => {},
  close: () => {},
})

export const useFarcaster = () => useContext(FarcasterContext)

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<any | null>(null)
  const [isInFrame, setIsInFrame] = useState(false)

  useEffect(() => {
    const initSDK = async () => {
      try {
        // Check if we're in a mini app
        const inMiniApp = await sdk.isInMiniApp()
        setIsInFrame(inMiniApp)
        
        if (inMiniApp) {
          const ctx = await sdk.context
          setContext(ctx)
          
          // Tell Farcaster we're ready
          await sdk.actions.ready()
        }
      } catch (error) {
        // Not in a frame, that's fine
        console.log('Not in Farcaster frame')
      }
      setIsSDKLoaded(true)
    }

    initSDK()
  }, [])

  const openUrl = useCallback((url: string) => {
    if (isInFrame) {
      sdk.actions.openUrl(url)
    } else {
      window.open(url, '_blank')
    }
  }, [isInFrame])

  const close = useCallback(() => {
    if (isInFrame) {
      sdk.actions.close()
    }
  }, [isInFrame])

  return (
    <FarcasterContext.Provider value={{ isSDKLoaded, isInFrame, context, openUrl, close }}>
      {children}
    </FarcasterContext.Provider>
  )
}
