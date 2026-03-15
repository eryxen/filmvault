import { useEffect, useState } from 'react'
import { getYYeTop, searchYYe, YYeResource, YYeTopItem } from '../api/yyets'
import { useLang } from '../context/LangContext'
import { tr } from '../i18n/translations'

type Region = 'ALL' | 'US' | 'JP' | 'KR' | 'UK'

const REGION_LABELS: Record<Region, { zh: string; en: string }> = {
  ALL: { zh: '全部', en: 'All' },
  US:  { zh: '美剧', en: 'US' },
  JP:  { zh: '日剧/日漫', en: 'Japan' },
  KR:  { zh: '韩剧', en: 'Korea' },
  UK:  { zh: '英剧', en: 'UK' },
}

export default function YYeTs() {
  const { lang } = useLang()
  const T = (key: { zh: string; en: string }) => tr(key, lang)

  const [topData, setTopData] = useState<Record<string, YYeTopItem[]>>({} as Record<string, YYeTopItem[]>)
  const [region, setRegion] = useState<Region>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<YYeResource[]>([])
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getYYeTop()
      .then(d => { setTopData(d as unknown as Record<string, YYeTopItem[]>); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const results = await searchYYe(searchQuery.trim())
      setSearchResults(results)
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const currentTopItems = (topData[region] || []).map(item => item.data?.info).filter(Boolean)
  const showSearch = searchResults.length > 0 || searching

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div style={{ background: 'linear-gradient(180deg, #1a0d0d 0%, #0a0a0f 100%)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <p className="section-label text-orange-400">{T({ zh: '资源', en: 'RESOURCES' })}</p>
            <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-0.5 rounded border border-orange-500/20">
              YYeTs · 16K★
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">{T({ zh: '人人影视资源', en: 'YYeTs Resources' })}</h1>
          <p className="text-gray-500 text-sm mb-6">
            {T({ zh: '人人影视全部资源 · 来自 tgbot-collection/YYeTsBot', en: 'Full YYeTs database · from tgbot-collection/YYeTsBot' })}
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative max-w-md mb-8">
            <input type="text" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={T({ zh: '搜索资源（中/英文）...', en: 'Search resources...' })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Region tabs */}
          {!showSearch && (
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(REGION_LABELS) as Region[]).map(r => (
                <button key={r} onClick={() => setRegion(r)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${
                    region === r ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}>
                  {T(REGION_LABELS[r])}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {searching && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Search results */}
        {!searching && searchResults.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="section-label text-orange-400 mb-1">{T({ zh: '搜索结果', en: 'SEARCH RESULTS' })}</p>
                <p className="text-gray-500 text-sm">{searchResults.length} {T({ zh: '个结果', en: 'results' })}</p>
              </div>
              <button onClick={() => { setSearchResults([]); setSearchQuery('') }}
                className="text-orange-400 hover:text-orange-300 text-sm">
                {T({ zh: '清除搜索', en: 'Clear search' })}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((r, i) => <ResourceCard key={`${r.id || i}`} resource={r} lang={lang} />)}
            </div>
          </div>
        )}

        {/* Top list */}
        {!showSearch && !loading && (
          <div>
            <p className="section-label text-orange-400 mb-1">{T({ zh: '热门排行', en: 'TOP RESOURCES' })}</p>
            <h2 className="text-xl font-black text-white mb-6">
              {T(REGION_LABELS[region])} {T({ zh: '热门', en: 'Trending' })}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentTopItems.map((r, i) => <ResourceCard key={`${r.id || i}`} resource={r} lang={lang} rank={i + 1} />)}
            </div>
          </div>
        )}

        {!searching && searchQuery && searchResults.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-gray-400">{T({ zh: '没有找到相关资源', en: 'No resources found' })}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ResourceCard({ resource, lang, rank }: { resource: YYeResource; lang: string; rank?: number }) {
  const channelLabel: Record<string, { zh: string; en: string }> = {
    tv:     { zh: '剧集', en: 'TV' },
    movie:  { zh: '电影', en: 'Movie' },
  }
  const label = channelLabel[resource.channel] || { zh: resource.channel, en: resource.channel }
  const channelColor = resource.channel === 'movie' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-green-400 bg-green-500/10 border-green-500/20'

  return (
    <div className="bg-white/3 border border-white/5 rounded-2xl p-5 hover:bg-white/5 transition-all group">
      <div className="flex items-start gap-3">
        {rank && (
          <span className={`text-2xl font-black flex-shrink-0 w-8 ${
            rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-orange-400' : 'text-gray-600'
          }`}>
            {rank}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${channelColor}`}>
              {lang === 'zh' ? label.zh : label.en}
            </span>
            {resource.area && (
              <span className="text-xs text-gray-600">{resource.area}</span>
            )}
          </div>
          <h3 className="text-white font-bold text-base mb-1 truncate">{resource.cnname}</h3>
          {resource.enname && resource.enname !== resource.cnname && (
            <p className="text-gray-500 text-sm truncate">{resource.enname}</p>
          )}
          {resource.views > 0 && (
            <p className="text-gray-600 text-xs mt-2">
              {lang === 'zh' ? `${resource.views} 次浏览` : `${resource.views} views`}
            </p>
          )}
        </div>
      </div>
      {/* Link to yyets.click */}
      <a href={`https://yyets.click/resource?id=${resource.id}`} target="_blank" rel="noopener noreferrer"
        className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-sm font-bold py-2 rounded-xl transition-all border border-orange-500/10">
        {lang === 'zh' ? '查看资源 & 下载 ↗' : 'View Resource & Download ↗'}
      </a>
    </div>
  )
}
