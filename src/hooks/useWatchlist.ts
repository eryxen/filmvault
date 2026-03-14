import { useState, useEffect } from 'react'

export interface WatchlistItem {
  id: number | string
  type: 'movie' | 'tv' | 'anime'
  title: string
  poster: string | null
  score: number | null
  year: string | null
}

const STORAGE_KEY = 'filmvault_watchlist'

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist))
  }, [watchlist])

  const addToWatchlist = (item: WatchlistItem) => {
    setWatchlist(prev => {
      if (prev.some(w => w.id === item.id && w.type === item.type)) return prev
      return [item, ...prev]
    })
  }

  const removeFromWatchlist = (id: number | string, type: string) => {
    setWatchlist(prev => prev.filter(w => !(w.id === id && w.type === type)))
  }

  const isInWatchlist = (id: number | string, type: string) =>
    watchlist.some(w => w.id === id && w.type === type)

  const toggleWatchlist = (item: WatchlistItem) => {
    if (isInWatchlist(item.id, item.type)) {
      removeFromWatchlist(item.id, item.type)
    } else {
      addToWatchlist(item)
    }
  }

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, toggleWatchlist }
}
