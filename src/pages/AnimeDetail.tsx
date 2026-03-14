import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Anime } from '../types'
import { getAnimeDetails } from '../api/jikan'
import AnimeCard from '../components/AnimeCard'

export default function AnimeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [anime, setAnime] = useState<(Anime & { recommendations: Anime[] }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    // Jikan rate limit delay
    setTimeout(() => {
      getAnimeDetails(+id)
        .then(d => { setAnime(d); setLoading(false) })
        .catch(() => setLoading(false))
    }, 400)
    window.scrollTo(0, 0)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-16">
        <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!anime) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-16">
      <p className="text-gray-400">Anime not found.</p>
    </div>
  )

  const title = anime.title_english || anime.title
  const hasTrailer = anime.trailer?.youtube_id

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-20">
      {/* Backdrop / top section */}
      <div style={{ background: 'linear-gradient(180deg, #0f0d1a 0%, #0a0a0f 100%)' }} className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-48 md:w-56 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/30 border border-purple-500/10">
                <img
                  src={anime.images?.jpg?.large_image_url}
                  alt={title}
                  className="w-full"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="section-label text-purple-400 mb-2">ANIME</p>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{title}</h1>
              {anime.title !== title && (
                <p className="text-gray-500 mb-4">{anime.title}</p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
                {anime.score && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-bold text-lg">{anime.score.toFixed(1)}</span>
                    {anime.scored_by && <span className="text-gray-500">({anime.scored_by.toLocaleString()})</span>}
                  </div>
                )}
                {anime.year && <span className="text-gray-400">{anime.year}</span>}
                {anime.episodes && <span className="text-gray-400">{anime.episodes} episodes</span>}
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  anime.status === 'Finished Airing' ? 'bg-gray-700 text-gray-300' : 'bg-purple-500/20 text-purple-400'
                }`}>{anime.status}</span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-5">
                {anime.genres?.map(g => (
                  <span key={g.mal_id} className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-purple-500/30 text-purple-400 bg-purple-500/10">
                    {g.name}
                  </span>
                ))}
              </div>

              {/* Studios */}
              {anime.studios?.length > 0 && (
                <p className="text-gray-400 text-sm mb-5">
                  <span className="text-gray-600 uppercase text-xs tracking-widest mr-2">Studio</span>
                  {anime.studios.map(s => s.name).join(', ')}
                </p>
              )}

              {/* Synopsis */}
              <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-2xl">
                {anime.synopsis?.replace(/\[Written by.*?\]/, '')}
              </p>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate(`/watch/anime/${id}`)}
                  className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/30"
                >
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Now
                </button>
                {hasTrailer && (
                  <a
                    href={`https://youtube.com/watch?v=${anime.trailer!.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold px-6 py-3 rounded-xl transition-all border border-red-500/20"
                  >
                    ▶ Trailer
                  </a>
                )}
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-all border border-white/10"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {anime.recommendations?.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
          <p className="section-label text-purple-400 mb-2">YOU MIGHT LIKE</p>
          <h2 className="text-xl font-black text-white mb-6">Recommendations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {anime.recommendations.slice(0, 6).map(a => (
              <AnimeCard key={a.mal_id} anime={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
