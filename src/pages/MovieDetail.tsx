import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Movie, TvShow } from '../types'
import { getMovieDetails, getTvDetails, getImageUrl } from '../api/tmdb'
import MovieCard from '../components/MovieCard'

interface Props {
  type: 'movie' | 'tv'
}

export default function MovieDetail({ type }: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<Movie & { similar?: Movie[] } | TvShow & { similar?: TvShow[] } | null>(null)
  const [loading, setLoading] = useState(true)

  const isMovie = type === 'movie'

  useEffect(() => {
    if (!id) return
    setLoading(true)
    const fetch = isMovie ? getMovieDetails(+id) : getTvDetails(+id)
    fetch.then(data => { setItem(data as Movie); setLoading(false) }).catch(() => setLoading(false))
    window.scrollTo(0, 0)
  }, [id, type])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-16">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!item) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-16">
      <p className="text-gray-400">Not found.</p>
    </div>
  )

  const title = isMovie ? (item as Movie).title : (item as TvShow).name
  const date = isMovie ? (item as Movie).release_date : (item as TvShow).first_air_date
  const year = date?.slice(0, 4)
  const accentColor = isMovie ? 'text-blue-400' : 'text-green-400'
  const accentBg = isMovie ? 'bg-blue-500 hover:bg-blue-400' : 'bg-green-500 hover:bg-green-400'
  const runtime = isMovie ? (item as Movie).runtime : undefined
  const similar = (item as Movie).similar || []

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-20">
      {/* Backdrop */}
      <div className="relative h-[60vh] overflow-hidden">
        {item.backdrop_path ? (
          <img
            src={getImageUrl(item.backdrop_path, 'original')}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-indigo-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-[#0a0a0f]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-40 relative">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-48 md:w-56 rounded-2xl overflow-hidden shadow-2xl">
              {item.poster_path ? (
                <img src={getImageUrl(item.poster_path, 'w342')} alt={title} className="w-full" />
              ) : (
                <div className="aspect-[2/3] bg-gray-800 flex items-center justify-center">
                  <span className="text-5xl">🎬</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-20">
            <p className={`section-label ${accentColor} mb-2`}>{isMovie ? 'MOVIE' : 'TV SHOW'}</p>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3">{title}</h1>

            {(item as Movie).tagline && (
              <p className="text-gray-400 italic text-lg mb-4">"{(item as Movie).tagline}"</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="text-white font-bold text-lg">{item.vote_average?.toFixed(1)}</span>
                <span className="text-gray-500">({item.vote_count?.toLocaleString()})</span>
              </div>
              {year && <span className="text-gray-400">{year}</span>}
              {runtime && <span className="text-gray-400">{Math.floor(runtime / 60)}h {runtime % 60}m</span>}
              {!isMovie && (item as TvShow).number_of_seasons && (
                <span className="text-gray-400">{(item as TvShow).number_of_seasons} seasons</span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {item.genres?.map(g => (
                <span key={g.id} className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                  isMovie ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' : 'border-green-500/30 text-green-400 bg-green-500/10'
                }`}>
                  {g.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-2xl">{item.overview}</p>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate(`/watch/${type}/${id}`)}
                className={`flex items-center gap-2 ${accentBg} text-white font-bold px-6 py-3 rounded-xl transition-all`}
              >
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-all border border-white/10"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* Cast */}
        {item.cast && item.cast.length > 0 && (
          <section className="mt-12">
            <p className={`section-label ${accentColor} mb-2`}>CAST</p>
            <h2 className="text-xl font-black text-white mb-6">Top Cast</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {item.cast.map(c => (
                <div key={c.id} className="text-center">
                  <div className="w-full aspect-square rounded-full overflow-hidden bg-gray-800 mb-2">
                    {c.profile_path ? (
                      <img src={getImageUrl(c.profile_path, 'w185')} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                    )}
                  </div>
                  <p className="text-white text-xs font-semibold truncate">{c.name}</p>
                  <p className="text-gray-500 text-xs truncate">{c.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section className="mt-12">
            <p className={`section-label ${accentColor} mb-2`}>MORE LIKE THIS</p>
            <h2 className="text-xl font-black text-white mb-6">Similar {isMovie ? 'Movies' : 'Shows'}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similar.slice(0, 6).map(m => (
                <MovieCard key={m.id} item={m} type={type} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
