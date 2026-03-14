import { useEffect, useState } from 'react'
import { Anime } from '../types'
import { getTopAnime, searchAnime, getSeasonalAnime } from '../api/jikan'
import AnimeCard from '../components/AnimeCard'
import SkeletonCard from '../components/SkeletonCard'

type Tab = 'top' | 'seasonal'

const GENRES = [
  { id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }, { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' }, { id: 10, name: 'Fantasy' }, { id: 14, name: 'Horror' },
  { id: 7, name: 'Mystery' }, { id: 22, name: 'Romance' }, { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' }, { id: 37, name: 'Supernatural' }, { id: 30, name: 'Sports' },
]

export default function AnimePage() {
  const [tab, setTab] = useState<Tab>('top')
  const [anime, setAnime] = useState<Anime[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true)
      try {
        let results: Anime[] = []
        let total = 1
        if (searchQuery.trim()) {
          const d = await searchAnime(searchQuery, page)
          results = d.results; total = d.totalPages
        } else if (tab === 'top') {
          const d = await getTopAnime(page)
          results = d.results; total = d.totalPages
        } else {
          results = await getSeasonalAnime()
        }
        setAnime(page === 1 ? results : prev => [...prev, ...results])
        setTotalPages(total)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    // Jikan rate limit: debounce slightly
    const timer = setTimeout(fetchAnime, 300)
    return () => clearTimeout(timer)
  }, [tab, page, searchQuery])

  const handleTabChange = (t: Tab) => {
    setTab(t); setPage(1); setAnime([])
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); setPage(1); setAnime([])
  }

  const skeletons = Array.from({ length: 20 }, (_, i) => <SkeletonCard key={i} />)

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div style={{ background: 'linear-gradient(180deg, #0f0d1a 0%, #0a0a0f 100%)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="section-label text-purple-400 mb-2">BROWSE</p>
          <h1 className="text-4xl font-black text-white mb-6">Anime</h1>

          <form onSubmit={handleSearch} className="relative max-w-md mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search anime..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="flex gap-3 mb-6">
            {(['top', 'seasonal'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${
                  tab === t && !searchQuery ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {t === 'top' ? 'Top Rated' : 'Seasonal'}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {GENRES.map(g => (
              <button
                key={g.id}
                onClick={() => { setSearchQuery(''); setPage(1); setAnime([]); setTab('top') }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide bg-white/5 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/20 border border-white/5 transition-all"
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {anime.map(a => <AnimeCard key={a.mal_id} anime={a} />)}
          {loading && skeletons}
        </div>

        {!loading && page < totalPages && (
          <div className="text-center mt-10">
            <button
              onClick={() => setPage(p => p + 1)}
              className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-8 py-3 rounded-xl transition-all"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
