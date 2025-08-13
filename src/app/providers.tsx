'use client'

import { SessionProvider } from 'next-auth/react'
import { WardrobeProvider } from '@/contexts/WardrobeContext'
import { WardrobeNotificationProvider } from '@/contexts/WardrobeNotificationContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={1 * 60} // Refresh session every 1 minute instead of 5
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      <WardrobeProvider>
        <WardrobeNotificationProvider>
          {children}
        </WardrobeNotificationProvider>
      </WardrobeProvider>
    </SessionProvider>
  )
} 