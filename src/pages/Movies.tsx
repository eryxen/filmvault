import { useEffect, useState } from 'react'
import { Movie, Genre } from '../types'
import { getPopularMovies, getTopRatedMovies, getMovieGenres, discoverMovies, searchMovies } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import SkeletonCard from '../components/SkeletonCard'
import { useLang } from '../context/LangContext'
import { t, tr, trGenre } from '../i18n/translations'

type Tab = 'popular' | 'top_rated' | 'genre'

export default function Movies() {
  const { lang } = useLang()
  const T = (key: { zh: string; en: string }) => tr(key, lang)

  const [tab, setTab] = useState<Tab>('popular')
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getMovieGenres().then(setGenres) }, [])

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      try {
        let results: Movie[] = []
        let total = 1
        if (searchQuery.trim()) {
          const d = await searchMovies(searchQuery, page); results = d.results; total = d.totalPages
        } else if (tab === 'popular') {
          const d = await getPopularMovies(page); results = d.results; total = d.totalPages
        } else if (tab === 'top_rated') {
          const d = await getTopRatedMovies(page); results = d.results; total = d.totalPages
        } else {
          const d = await discoverMovies(selectedGenre ?? undefined, page); results = d.results; total = d.totalPages
        }
        setMovies(page === 1 ? results : prev => [...prev, ...results])
        setTotalPages(total)
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    fetchMovies()
  }, [tab, selectedGenre, page, searchQuery])

  const handleTabChange = (t: Tab) => { setTab(t); setPage(1); setMovies([]) }
  const handleGenreSelect = (id: number | null) => { setSelectedGenre(id); setTab('genre'); setPage(1); setMovies([]) }
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); setMovies([]) }

  const skeletons = Array.from({ length: 20 }, (_, i) => <SkeletonCard key={i} />)

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div style={{ background: 'linear-gradient(180deg, #0d1117 0%, #0a0a0f 100%)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="section-label text-blue-400 mb-2">{T(t.browse.browse)}</p>
          <h1 className="text-4xl font-black text-white mb-6">{T(t.browse.movies)}</h1>

          <form onSubmit={handleSearch} className="relative max-w-md mb-8">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder={T(t.browse.searchMovies)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="flex gap-3 flex-wrap mb-6">
            {(['popular', 'top_rated'] as Tab[]).map(tabKey => (
              <button key={tabKey} onClick={() => handleTabChange(tabKey)}
                className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${
                  tab === tabKey && !searchQuery ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}>
                {tabKey === 'popular' ? T(t.browse.popular) : T(t.browse.topRated)}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => handleGenreSelect(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                tab === 'genre' && !selectedGenre ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-500 hover:text-gray-300 border border-white/5'
              }`}>
              {T(t.browse.allGenres)}
            </button>
            {genres.map(g => (
              <button key={g.id} onClick={() => handleGenreSelect(g.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                  tab === 'genre' && selectedGenre === g.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-white/5 text-gray-500 hover:text-gray-300 border border-white/5'
                }`}>
                {trGenre(g.name, lang)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {movies.map(m => <MovieCard key={m.id} item={m} type="movie" />)}
          {loading && skeletons}
        </div>
        {!loading && movies.length === 0 && (
          <p className="text-gray-500 text-center py-20">{T(t.browse.noResult)}</p>
        )}
        {!loading && page < totalPages && (
          <div className="text-center mt-10">
            <button onClick={() => setPage(p => p + 1)}
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-3 rounded-xl transition-all">
              {T(t.browse.loadMore)}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
