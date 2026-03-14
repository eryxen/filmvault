import { createContext, useContext, useState, ReactNode } from 'react'

export interface PlayInfo {
  type: 'movie' | 'tv' | 'anime'
  id: number | string
  title: string
  season?: number
  episode?: number
}

interface PlayerContextType {
  playing: PlayInfo | null
  play: (info: PlayInfo) => void
  close: () => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState<PlayInfo | null>(null)

  const play = (info: PlayInfo) => setPlaying(info)
  const close = () => setPlaying(null)

  return (
    <PlayerContext.Provider value={{ playing, play, close }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
