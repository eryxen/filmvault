import { useEffect, useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import { useLang } from '../context/LangContext'

// ============================================================
// Sources curated from open-source projects:
//   enjoytown (282★), filmify, movie-web ecosystem
// Ordered: cleanest first. sandbox blocks popup ads.
// ============================================================

interface Source { label: string; url: string }

const getSources = (type: string, id: number | string, season = 1, episode = 1): Source[] => {
  if (type === 'movie') return [
    // VidSrc Pro first — most reliable TMDB ID support
    { label: 'VidSrc Pro',   url: `https://vidsrc.pro/embed/movie/${id}` },
    { label: 'VidSrc Me',    url: `https://vidsrc.me/embed/movie?tmdb=${id}` },
    { label: 'SmashyStream', url: `https://embed.smashystream.com/playere.php?tmdb=${id}` },
    { label: '2Embed',       url: `https://www.2embed.cc/embed/${id}` },
    { label: 'MultiEmbed',   url: `https://multiembed.mov/?video_id=${id}&tmdb=1` },
    // SuperEmbed last — needs IMDB ID, may 404 on new releases
    { label: 'SuperEmbed',   url: `https://www.superembed.stream/embed?video_id=${id}&tmdb=1` },
  ]
  if (type === 'tv') return [
    { label: 'VidSrc Pro',   url: `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}` },
    { label: 'VidSrc Me',    url: `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}` },
    { label: 'SmashyStream', url: `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${season}&episode=${episode}` },
    { label: '2Embed',       url: `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}` },
    { label: 'MultiEmbed',   url: `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}` },
    { label: 'SuperEmbed',   url: `https://www.superembed.stream/embed?video_id=${id}&tmdb=1&season=${season}&episode=${episode}` },
  ]
  if (type === 'anime') return [
    // anime1.me — default, use search embed (title passed via context)
    { label: 'Anime1.me',    url: `https://anime1.me/?cat=${id}` },
    { label: 'VidSrc Pro',   url: `https://vidsrc.pro/embed/anime/${id}/${episode}` },
    { label: 'VidSrc To',    url: `https://vidsrc.to/embed/anime/${id}/1/${episode}` },
    { label: 'SmashyStream', url: `https://embed.smashystream.com/playere.php?mal=${id}&ep=${episode}` },
    { label: 'VidSrc Me',    url: `https://vidsrc.me/embed/tv?mal=${id}&episode=${episode}` },
  ]
  return []
}

const getExternalLink = (type: string, id: number | string, title?: string) => {
  if (type === 'movie') return `https://vidsrc.pro/embed/movie/${id}`
  if (type === 'tv')    return `https://vidsrc.pro/embed/tv/${id}/1/1`
  // anime1.me search by title
  return title
    ? `https://anime1.me/?s=${encodeURIComponent(title)}`
    : `https://anime1.me/?cat=${id}`
}

export default function VideoPlayer() {
  const { playing, close } = usePlayer()
  const { lang } = useLang()
  const [season, setSeason] = useState(1)
  const [episode, setEpisode] = useState(1)
  const [srcIndex, setSrcIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const sources = playing ? getSources(playing.type, playing.id, season, episode) : []
  const maxSources = sources.length
  const [showFailHint, setShowFailHint] = useState(false)
  const [loadTimer, setLoadTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const tryNextSource = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex(i => i + 1)
      setLoaded(false)
      setShowFailHint(false)
    }
  }

  useEffect(() => {
    if (playing) {
      setSeason(playing.season || 1)
      setEpisode(playing.episode || 1)
      setSrcIndex(0)
      setLoaded(false)
      setShowFailHint(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [playing])

  useEffect(() => {
    setLoaded(false)
    setSrcIndex(0)
    setShowFailHint(false)
  }, [season, episode])

  // Show "try next" hint if not loaded after 12 seconds
  useEffect(() => {
    setShowFailHint(false)
    if (loadTimer) clearTimeout(loadTimer)
    if (!loaded) {
      const t = setTimeout(() => setShowFailHint(true), 12000)
      setLoadTimer(t)
      return () => clearTimeout(t)
    }
  }, [srcIndex, loaded, season, episode])

  if (!playing) return null

  const isTV = playing.type === 'tv'
  const isAnime = playing.type === 'anime'
  const typeLabel = playing.type === 'movie'
    ? (lang === 'zh' ? '电影' : 'MOVIE')
    : playing.type === 'tv'
    ? (lang === 'zh' ? '剧集' : 'TV')
    : (lang === 'zh' ? '动漫' : 'ANIME')

  const accentColor = playing.type === 'movie' ? 'text-blue-400' : playing.type === 'tv' ? 'text-green-400' : 'text-purple-400'
  const accentBg    = playing.type === 'movie' ? 'bg-blue-500'   : playing.type === 'tv' ? 'bg-green-500'   : 'bg-purple-500'

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      {/* ── Top Bar ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0a0a0f]/95 backdrop-blur-sm border-b border-white/5 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-black text-xs">云</span>
          </div>
          <span className="text-white font-black text-sm hidden sm:block">云<span className="text-blue-400">影</span></span>
        </div>

        <span className="text-gray-700 hidden sm:block">|</span>

        {/* Title */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className={`section-label ${accentColor} text-xs hidden sm:block flex-shrink-0`}>{typeLabel}</span>
          <span className="text-white font-semibold text-sm truncate">{playing.title}</span>
          {(isTV || isAnime) && (
            <span className="text-gray-500 text-xs flex-shrink-0">S{season} E{episode}</span>
          )}
        </div>

        {/* Source switcher — show source name */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-gray-600 text-xs mr-1 hidden md:block">{lang === 'zh' ? '线路' : 'Source'}:</span>
          <div className="flex gap-1 overflow-x-auto max-w-[200px] md:max-w-none">
            {sources.slice(0, maxSources).map((src, i) => (
              <button key={i}
                onClick={() => { setSrcIndex(i); setLoaded(false) }}
                title={src.label}
                className={`flex-shrink-0 h-7 px-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  srcIndex === i
                    ? `${accentBg} text-white shadow-lg`
                    : 'bg-white/8 text-gray-400 hover:bg-white/15 hover:text-white border border-white/5'
                }`}>
                {/* Mobile: just number; Desktop: name */}
                <span className="md:hidden">{i + 1}</span>
                <span className="hidden md:block">{src.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Close */}
        <button onClick={close}
          className="flex-shrink-0 flex items-center gap-1.5 bg-white/8 hover:bg-red-500/20 hover:text-red-400 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-all border border-white/5 ml-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="hidden sm:block">{lang === 'zh' ? '关闭' : 'Close'}</span>
        </button>
      </div>

      {/* ── Main ── */}
      <div className="flex flex-1 min-h-0">
        {/* Player */}
        <div className="flex-1 relative bg-black">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
              {!showFailHint ? (
                <>
                  <div className={`w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mb-4`}
                    style={{ borderColor: playing.type === 'movie' ? '#3b82f6' : playing.type === 'tv' ? '#10b981' : '#a855f7', borderTopColor: 'transparent' }} />
                  <p className="text-gray-400 text-sm mb-1">{lang === 'zh' ? '加载中...' : 'Loading...'}</p>
                  <p className="text-gray-600 text-xs">{sources[srcIndex]?.label}</p>
                </>
              ) : (
                /* Auto fail hint — shown after 12s if nothing loads */
                <div className="text-center px-8">
                  <div className="text-4xl mb-4">⚠️</div>
                  <p className="text-white font-bold text-lg mb-2">
                    {lang === 'zh' ? `${sources[srcIndex]?.label} 无法播放` : `${sources[srcIndex]?.label} failed to load`}
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    {lang === 'zh' ? '该线路暂无此片源，试试下一条线路' : 'This source may not have this title yet'}
                  </p>
                  {srcIndex < sources.length - 1 ? (
                    <button onClick={tryNextSource}
                      className={`${playing.type === 'movie' ? 'bg-blue-500 hover:bg-blue-400' : playing.type === 'tv' ? 'bg-green-500 hover:bg-green-400' : 'bg-purple-500 hover:bg-purple-400'} text-white font-bold px-6 py-3 rounded-xl transition-all text-sm`}>
                      {lang === 'zh' ? `切换到 ${sources[srcIndex + 1]?.label} →` : `Try ${sources[srcIndex + 1]?.label} →`}
                    </button>
                  ) : (
                    <p className="text-gray-500 text-sm">{lang === 'zh' ? '已尝试所有线路' : 'All sources tried'}</p>
                  )}
                  <div className="flex gap-2 justify-center mt-4 flex-wrap">
                    {sources.map((src, i) => i !== srcIndex && (
                      <button key={i} onClick={() => { setSrcIndex(i); setLoaded(false); setShowFailHint(false) }}
                        className="bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-all">
                        {src.label}
                      </button>
                    ))}
                    {playing.type === 'anime' && (
                      <a href={getExternalLink('anime', playing.id, playing.title)}
                        target="_blank" rel="noopener noreferrer"
                        className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-all border border-purple-500/20">
                        🎌 anime1.me ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <iframe
            key={`${playing.id}-${season}-${episode}-${srcIndex}`}
            src={sources[srcIndex]?.url}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            referrerPolicy="origin"
            onLoad={() => setLoaded(true)}
            // sandbox: blocks popup ads & tab hijacking
            // deliberately OMIT allow-popups, allow-top-navigation
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock allow-orientation-lock"
          />
        </div>

        {/* Episode Sidebar — TV / Anime, desktop only */}
        {(isTV || isAnime) && (
          <div className="w-52 bg-[#0d0d14] border-l border-white/5 flex flex-col flex-shrink-0 hidden lg:flex">
            <div className="p-3 border-b border-white/5">
              <p className={`section-label ${accentColor} text-xs mb-3`}>{lang === 'zh' ? '选集' : 'EPISODES'}</p>
              {isTV && (
                <>
                  <p className="text-gray-600 text-xs mb-1">{lang === 'zh' ? '季' : 'Season'}</p>
                  <div className="flex gap-1 flex-wrap mb-1">
                    {[1,2,3,4,5,6,7,8].map(s => (
                      <button key={s} onClick={() => { setSeason(s); setEpisode(1) }}
                        className={`w-8 h-7 rounded text-xs font-bold transition-all ${season === s ? `${accentBg} text-white` : 'bg-white/8 text-gray-400 hover:bg-white/15'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {Array.from({ length: 50 }, (_, i) => i + 1).map(ep => (
                <button key={ep} onClick={() => setEpisode(ep)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${
                    episode === ep ? `${accentBg} text-white font-bold` : 'text-gray-500 hover:bg-white/5 hover:text-white'
                  }`}>
                  {lang === 'zh' ? `第 ${ep} 集` : `Ep ${ep}`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile episode bar */}
      {(isTV || isAnime) && (
        <div className="lg:hidden border-t border-white/5 bg-[#0d0d14] px-3 py-2 flex-shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {isTV && (
              <>
                <span className="text-gray-600 text-xs flex-shrink-0">{lang === 'zh' ? 'S' : 'S'}</span>
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => { setSeason(s); setEpisode(1) }}
                    className={`flex-shrink-0 w-8 h-7 rounded text-xs font-bold ${season === s ? `${accentBg} text-white` : 'bg-white/8 text-gray-400'}`}>
                    {s}
                  </button>
                ))}
                <span className="text-gray-700 flex-shrink-0">|</span>
              </>
            )}
            <span className="text-gray-600 text-xs flex-shrink-0">{lang === 'zh' ? 'E' : 'E'}</span>
            {Array.from({ length: 50 }, (_, i) => i + 1).map(ep => (
              <button key={ep} onClick={() => setEpisode(ep)}
                className={`flex-shrink-0 w-8 h-7 rounded text-xs font-bold ${episode === ep ? `${accentBg} text-white` : 'bg-white/8 text-gray-400'}`}>
                {ep}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="bg-[#080808] border-t border-white/5 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xs">🛡 {lang === 'zh' ? '弹窗广告已屏蔽' : 'Popup ads blocked'}</span>
          <span className="text-gray-700 text-xs hidden sm:block">·</span>
          <span className="text-gray-600 text-xs hidden sm:block">
            {lang === 'zh' ? `当前线路: ${sources[srcIndex]?.label}` : `Source: ${sources[srcIndex]?.label}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Prominent anime1.me button for anime */}
          {playing.type === 'anime' && (
            <a href={getExternalLink('anime', playing.id, playing.title)}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-all border border-purple-500/20">
              🎌 anime1.me ↗
            </a>
          )}
          <a href={getExternalLink(playing.type, playing.id, playing.title)} target="_blank" rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-blue-400 transition-colors underline">
            {lang === 'zh' ? '外部播放 ↗' : 'Open externally ↗'}
          </a>
        </div>
      </div>
    </div>
  )
}
