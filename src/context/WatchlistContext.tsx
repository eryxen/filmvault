import { createContext, useContext, ReactNode } from 'react'
import { useWatchlist, WatchlistItem } from '../hooks/useWatchlist'

interface WatchlistContextType {
  watchlist: WatchlistItem[]
  toggleWatchlist: (item: WatchlistItem) => void
  isInWatchlist: (id: number | string, type: string) => boolean
}

const WatchlistContext = createContext<WatchlistContextType | null>(null)

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const wl = useWatchlist()
  return (
    <WatchlistContext.Provider value={wl}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlistContext() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlistContext must be used within WatchlistProvider')
  return ctx
}
