import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Movie } from '../types'
import { Anime } from '../types'
import { searchMovies } from '../api/tmdb'
import { searchAnime } from '../api/jikan'
import MovieCard from '../components/MovieCard'
import AnimeCard from '../components/AnimeCard'
import { useLang } from '../context/LangContext'
import { t, tr } from '../i18n/translations'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const navigate = useNavigate()
  const { lang } = useLang()
  const T = (key: { zh: string; en: string }) => tr(key, lang)

  const [movies, setMovies] = useState<Movie[]>([])
  const [anime, setAnime] = useState<Anime[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    Promise.all([searchMovies(query, 1), searchAnime(query, 1)])
      .then(([m, a]) => { setMovies(m.results.slice(0, 12)); setAnime(a.results.slice(0, 12)) })
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="section-label text-white/40 mb-2">{T(t.search.results)}</p>
        <h1 className="text-3xl font-black text-white mb-8">"{query}"</h1>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && movies.length > 0 && (
          <section className="mb-12">
            <p className="section-label text-blue-400 mb-2">{T(t.search.movies)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movies.map(m => <MovieCard key={m.id} item={m} type="movie" />)}
            </div>
          </section>
        )}

        {!loading && anime.length > 0 && (
          <section>
            <p className="section-label text-purple-400 mb-2">{T(t.search.anime)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {anime.map(a => <AnimeCard key={a.mal_id} anime={a} />)}
            </div>
          </section>
        )}

        {!loading && movies.length === 0 && anime.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">{T(t.search.noResult)} "{query}"</p>
            <button onClick={() => navigate('/')} className="mt-6 text-blue-400 hover:text-blue-300">
              {T(t.search.backHome)}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
