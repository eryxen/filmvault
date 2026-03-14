import { useNavigate } from 'react-router-dom'
import { Movie, TvShow } from '../types'
import { getImageUrl } from '../api/tmdb'

interface Props {
  item: Movie | TvShow
  type: 'movie' | 'tv'
}

const isMovie = (item: Movie | TvShow): item is Movie => 'title' in item

export default function MovieCard({ item, type }: Props) {
  const navigate = useNavigate()
  const title = isMovie(item) ? item.title : item.name
  const date = isMovie(item) ? item.release_date : item.first_air_date
  const year = date ? new Date(date).getFullYear() : ''
  const score = item.vote_average?.toFixed(1)
  const accentColor = type === 'movie' ? 'text-blue-400' : 'text-green-400'
  const glowColor = type === 'movie' ? 'group-hover:shadow-blue-500/20' : 'group-hover:shadow-green-500/20'

  return (
    <div
      className={`group cursor-pointer flex-shrink-0`}
      onClick={() => navigate(`/${type}/${item.id}`)}
    >
      <div className={`relative overflow-hidden rounded-2xl bg-[#111118] transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl ${glowColor}`}>
        {/* Poster */}
        <div className="aspect-[2/3] overflow-hidden">
          {item.poster_path ? (
            <img
              src={getImageUrl(item.poster_path, 'w342')}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-4xl">🎬</span>
            </div>
          )}
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Score badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-white text-xs font-bold">{score}</span>
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Info on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className={`section-label ${accentColor} mb-1`}>{type === 'movie' ? 'MOVIE' : 'TV SHOW'}</p>
          <button
            onClick={e => {
              e.stopPropagation()
              navigate(`/watch/${type}/${item.id}`)
            }}
            className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
              type === 'movie'
                ? 'bg-blue-500 hover:bg-blue-400 text-white'
                : 'bg-green-500 hover:bg-green-400 text-white'
            }`}
          >
            Watch Now
          </button>
        </div>
      </div>

      {/* Title info */}
      <div className="mt-2 px-1">
        <p className="text-white text-sm font-semibold truncate">{title}</p>
        <p className="text-gray-500 text-xs mt-0.5">{year}</p>
      </div>
    </div>
  )
}
