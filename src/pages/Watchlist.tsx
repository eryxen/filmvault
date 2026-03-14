import { useNavigate } from 'react-router-dom'
import { useWatchlistContext } from '../context/WatchlistContext'
import { getImageUrl } from '../api/tmdb'

export default function Watchlist() {
  const navigate = useNavigate()
  const { watchlist, toggleWatchlist } = useWatchlistContext()

  const movies = watchlist.filter(w => w.type === 'movie')
  const tv = watchlist.filter(w => w.type === 'tv')
  const anime = watchlist.filter(w => w.type === 'anime')

  const getImageSrc = (item: typeof watchlist[0]) => {
    if (!item.poster) return null
    if (item.type === 'anime') return item.poster
    return getImageUrl(item.poster, 'w342')
  }

  const CardItem = ({ item }: { item: typeof watchlist[0] }) => {
    const img = getImageSrc(item)
    const accentColor = item.type === 'movie' ? 'text-blue-400' : item.type === 'tv' ? 'text-green-400' : 'text-purple-400'
    const label = item.type === 'movie' ? 'MOVIE' : item.type === 'tv' ? 'TV SHOW' : 'ANIME'

    return (
      <div className="group relative cursor-pointer" onClick={() => navigate(`/${item.type}/${item.id}`)}>
        <div className="relative overflow-hidden rounded-2xl bg-[#111118] transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl">
          <div className="aspect-[2/3] overflow-hidden">
            {img ? (
              <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-4xl">🎬</div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Score */}
          {item.score && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-white text-xs font-bold">{item.score.toFixed(1)}</span>
            </div>
          )}

          {/* Remove button */}
          <button
            onClick={e => { e.stopPropagation(); toggleWatchlist(item) }}
            className="absolute top-2 left-2 w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
            title="Remove from Watchlist"
          >
            <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          {/* Watch now overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={e => { e.stopPropagation(); navigate(`/watch/${item.type}/${item.id}`) }}
              className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wide text-white transition-all ${
                item.type === 'movie' ? 'bg-blue-500 hover:bg-blue-400' :
                item.type === 'tv' ? 'bg-green-500 hover:bg-green-400' :
                'bg-purple-500 hover:bg-purple-400'
              }`}
            >
              Watch Now
            </button>
          </div>
        </div>
        <div className="mt-2 px-1">
          <p className={`section-label ${accentColor} text-xs mb-0.5`}>{label}</p>
          <p className="text-white text-sm font-semibold truncate">{item.title}</p>
          {item.year && <p className="text-gray-500 text-xs">{item.year}</p>}
        </div>
      </div>
    )
  }

  const Section = ({ title, label, color, items }: { title: string; label: string; color: string; items: typeof watchlist }) => {
    if (items.length === 0) return null
    return (
      <section className="mb-12">
        <p className={`section-label ${color} mb-2`}>{label}</p>
        <h2 className="text-xl font-black text-white mb-6">{title} <span className="text-gray-600 text-base font-normal">({items.length})</span></h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {items.map(item => <CardItem key={`${item.type}-${item.id}`} item={item} />)}
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div style={{ background: 'linear-gradient(180deg, #0d1117 0%, #0a0a0f 100%)' }} className="py-10 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="section-label text-yellow-400 mb-2">MY LIST</p>
          <h1 className="text-4xl font-black text-white">Watchlist</h1>
          <p className="text-gray-500 mt-2">{watchlist.length} titles saved</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {watchlist.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔖</div>
            <h2 className="text-white text-2xl font-bold mb-3">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-8">Click the bookmark icon on any movie, show, or anime to save it here</p>
            <button onClick={() => navigate('/')} className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition-all">
              Browse Content
            </button>
          </div>
        ) : (
          <>
            <Section title="Movies" label="MOVIES" color="text-blue-400" items={movies} />
            <Section title="TV Shows" label="TV SHOWS" color="text-green-400" items={tv} />
            <Section title="Anime" label="ANIME" color="text-purple-400" items={anime} />
          </>
        )}
      </div>
    </div>
  )
}
