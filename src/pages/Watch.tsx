import { useParams, useNavigate } from 'react-router-dom'

// Watch page — embeds from vidsrc.to (free, public CDN)
// Sources: vidsrc.to supports TMDB IDs for movie/tv, MAL IDs for anime

type WatchType = 'movie' | 'tv' | 'anime'

const SOURCES: Record<WatchType, (id: string, ep?: string) => string> = {
  movie: (id) => `https://vidsrc.to/embed/movie/${id}`,
  tv: (id, ep = '1-1') => {
    const [s, e] = ep.split('-')
    return `https://vidsrc.to/embed/tv/${id}/${s || 1}/${e || 1}`
  },
  anime: (id) => `https://vidsrc.to/embed/anime/${id}/1/1`,
}

const ALT_SOURCES: Record<WatchType, (id: string) => string> = {
  movie: (id) => `https://vidbox.cc/movie/${id}`,
  tv: (id) => `https://vidbox.cc/tv/${id}`,
  anime: (id) => `https://9anime.pl/watch/${id}`,
}

export default function Watch() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const navigate = useNavigate()

  const watchType = (type as WatchType) || 'movie'
  const embedUrl = id ? SOURCES[watchType]?.(id) : ''

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Minimal top bar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-[#0a0a0f]/90 backdrop-blur-sm border-b border-white/5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="text-gray-600">|</span>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-black text-xs">云</span>
          </div>
          <span className="text-white font-bold text-sm">云影</span>
          <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
            watchType === 'movie' ? 'text-blue-400 bg-blue-500/10' :
            watchType === 'tv' ? 'text-green-400 bg-green-500/10' :
            'text-purple-400 bg-purple-500/10'
          }`}>{watchType}</span>
        </div>

        {/* Alt source */}
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="text-gray-600">Alternative:</span>
          <a
            href={id ? ALT_SOURCES[watchType]?.(id) : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {watchType === 'anime' ? 'anime1.me' : 'vidbox.cc'}
          </a>
        </div>
      </div>

      {/* Player */}
      <div className="flex-1 relative" style={{ height: 'calc(100vh - 52px)' }}>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="origin"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-white text-xl font-bold mb-2">No source available</p>
              <p className="text-gray-400">ID not found</p>
            </div>
          </div>
        )}

        {/* Overlay hint (fades after 3s via CSS trick) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-4 py-2 rounded-full pointer-events-none opacity-100 transition-opacity duration-1000">
          If player doesn't load, try the alternative source above
        </div>
      </div>
    </div>
  )
}
