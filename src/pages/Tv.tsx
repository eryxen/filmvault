import { useEffect, useState } from 'react'
import { TvShow, Genre } from '../types'
import { getPopularTv, getTvGenres, discoverTv, searchTv } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import SkeletonCard from '../components/SkeletonCard'

export default function Tv() {
  const [shows, setShows] = useState<TvShow[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTvGenres().then(setGenres)
  }, [])

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true)
      try {
        let results: TvShow[] = []
        let total = 1
        if (searchQuery.trim()) {
          const d = await searchTv(searchQuery, page)
          results = d.results; total = d.totalPages
        } else if (selectedGenre) {
          const d = await discoverTv(selectedGenre, page)
          results = d.results; total = d.totalPages
        } else {
          const d = await getPopularTv(page)
          results = d.results; total = d.totalPages
        }
        setShows(page === 1 ? results : prev => [...prev, ...results])
        setTotalPages(total)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchShows()
  }, [selectedGenre, page, searchQuery])

  const handleGenreSelect = (id: number | null) => {
    setSelectedGenre(id); setPage(1); setShows([])
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); setPage(1); setShows([])
  }

  const skeletons = Array.from({ length: 20 }, (_, i) => <SkeletonCard key={i} />)

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div style={{ background: 'linear-gradient(180deg, #0d120d 0%, #0a0a0f 100%)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="section-label text-green-400 mb-2">BROWSE</p>
          <h1 className="text-4xl font-black text-white mb-6">TV Shows</h1>

          <form onSubmit={handleSearch} className="relative max-w-md mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search TV shows..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:bg-white/8"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleGenreSelect(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                !selectedGenre ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-gray-500 hover:text-gray-300 border border-white/5'
              }`}
            >
              All
            </button>
            {genres.map(g => (
              <button
                key={g.id}
                onClick={() => handleGenreSelect(g.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                  selectedGenre === g.id
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-white/5 text-gray-500 hover:text-gray-300 border border-white/5'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {shows.map(s => <MovieCard key={s.id} item={s} type="tv" />)}
          {loading && skeletons}
        </div>

        {!loading && page < totalPages && (
          <div className="text-center mt-10">
            <button
              onClick={() => setPage(p => p + 1)}
              className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3 rounded-xl transition-all"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
