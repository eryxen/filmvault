import { useEffect, useState } from 'react'
import { Anime } from '../types'
import { getTopAnime, searchAnime, getSeasonalAnime } from '../api/jikan'
import AnimeCard from '../components/AnimeCard'
import SkeletonCard from '../components/SkeletonCard'
import { useLang } from '../context/LangContext'
import { t, tr } from '../i18n/translations'

type Tab = 'top' | 'seasonal'

const ANIME_GENRES = [
  { id: 1, nameZh: '动作', nameEn: 'Action' },
  { id: 2, nameZh: '冒险', nameEn: 'Adventure' },
  { id: 4, nameZh: '搞笑', nameEn: 'Comedy' },
  { id: 8, nameZh: '剧情', nameEn: 'Drama' },
  { id: 10, nameZh: '奇幻', nameEn: 'Fantasy' },
  { id: 14, nameZh: '恐怖', nameEn: 'Horror' },
  { id: 7, nameZh: '悬疑', nameEn: 'Mystery' },
  { id: 22, nameZh: '恋爱', nameEn: 'Romance' },
  { id: 24, nameZh: '科幻', nameEn: 'Sci-Fi' },
  { id: 36, nameZh: '日常', nameEn: 'Slice of Life' },
  { id: 37, nameZh: '超自然', nameEn: 'Supernatural' },
  { id: 30, nameZh: '运动', nameEn: 'Sports' },
]

export default function AnimePage() {
  const { lang } = useLang()
  const T = (key: { zh: string; en: string }) => tr(key, lang)

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
        let results: Anime[] = []; let total = 1
        if (searchQuery.trim()) {
          const d = await searchAnime(searchQuery, page); results = d.results; total = d.totalPages
        } else if (tab === 'top') {
          const d = await getTopAnime(page); results = d.results; total = d.totalPages
        } else {
          results = await getSeasonalAnime()
        }
        setAnime(page === 1 ? results : prev => [...prev, ...results])
        setTotalPages(total)
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    const timer = setTimeout(fetchAnime, 300)
    return () => clearTimeout(timer)
  }, [tab, page, searchQuery])

  const handleTabChange = (t: Tab) => { setTab(t); setPage(1); setAnime([]) }
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); setAnime([]) }
  const skeletons = Array.from({ length: 20 }, (_, i) => <SkeletonCard key={i} />)

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div style={{ background: 'linear-gradient(180deg, #0f0d1a 0%, #0a0a0f 100%)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="section-label text-purple-400 mb-2">{T(t.browse.browse)}</p>
          <h1 className="text-4xl font-black text-white mb-6">{T(t.browse.anime)}</h1>

          <form onSubmit={handleSearch} className="relative max-w-md mb-8">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder={T(t.browse.searchAnime)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="flex gap-3 mb-6">
            {(['top', 'seasonal'] as Tab[]).map(tabKey => (
              <button key={tabKey} onClick={() => handleTabChange(tabKey)}
                className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${
                  tab === tabKey && !searchQuery ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}>
                {tabKey === 'top' ? T(t.browse.topRated) : T(t.browse.seasonal)}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {ANIME_GENRES.map(g => (
              <button key={g.id}
                onClick={() => { setSearchQuery(''); setPage(1); setAnime([]); setTab('top') }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide bg-white/5 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/20 border border-white/5 transition-all">
                {lang === 'zh' ? g.nameZh : g.nameEn}
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
        {!loading && anime.length === 0 && (
          <p className="text-gray-500 text-center py-20">{T(t.browse.noResult)}</p>
        )}
        {!loading && page < totalPages && (
          <div className="text-center mt-10">
            <button onClick={() => setPage(p => p + 1)}
              className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-8 py-3 rounded-xl transition-all">
              {T(t.browse.loadMore)}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
