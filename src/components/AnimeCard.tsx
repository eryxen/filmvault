import { useNavigate } from 'react-router-dom'
import { Anime } from '../types'

interface Props {
  anime: Anime
}

export default function AnimeCard({ anime }: Props) {
  const navigate = useNavigate()
  const title = anime.title_english || anime.title

  return (
    <div
      className="group cursor-pointer flex-shrink-0"
      onClick={() => navigate(`/anime/${anime.mal_id}`)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#111118] transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-purple-500/20">
        {/* Poster */}
        <div className="aspect-[2/3] overflow-hidden">
          {anime.images?.jpg?.large_image_url ? (
            <img
              src={anime.images.jpg.large_image_url}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
              <span className="text-4xl">⛩️</span>
            </div>
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Score badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-white text-xs font-bold">{anime.score?.toFixed(1) ?? 'N/A'}</span>
        </div>

        {/* Episode badge */}
        {anime.episodes && (
          <div className="absolute top-2 left-2 bg-purple-500/80 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-white text-xs font-bold">{anime.episodes} ep</span>
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Bottom hover info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="section-label text-purple-400 mb-1">ANIME</p>
          <button
            onClick={e => {
              e.stopPropagation()
              navigate(`/watch/anime/${anime.mal_id}`)
            }}
            className="w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wide bg-purple-500 hover:bg-purple-400 text-white transition-all"
          >
            Watch Now
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mt-2 px-1">
        <p className="text-white text-sm font-semibold truncate">{title}</p>
        <p className="text-gray-500 text-xs mt-0.5">{anime.year ?? ''}{anime.status ? ` • ${anime.status}` : ''}</p>
      </div>
    </div>
  )
}
