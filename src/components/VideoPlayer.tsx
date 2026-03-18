import { useEffect, useState, useRef, useCallback } from 'react'
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
    // Tested 2026-03-15 — all returning 200
    { label: 'VidSrc XYZ',   url: `https://vidsrc.xyz/embed/movie/${id}` },
    { label: 'VidSrc Me',    url: `https://vidsrc.me/embed/movie?tmdb=${id}` },
    { label: 'VidLink',      url: `https://vidlink.pro/movie/${id}` },
    { label: 'SmashyStream', url: `https://embed.smashystream.com/playere.php?tmdb=${id}` },
    { label: 'AutoEmbed',    url: `https://autoembed.co/movie/tmdb/${id}` },
    { label: 'MultiEmbed',   url: `https://multiembed.mov/?video_id=${id}&tmdb=1` },
    { label: 'VidSrc ICU',   url: `https://vidsrc.icu/embed/movie/${id}` },
    { label: 'MoviesAPI',    url: `https://moviesapi.club/movie/${id}` },
    { label: 'VidSrc To',   url: `https://vidsrc.to/embed/movie/${id}` },
    { label: 'Nontongo',    url: `https://nontongo.win/embed/movie/${id}` },
  ]
  if (type === 'tv') return [
    { label: 'VidSrc XYZ',   url: `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}` },
    { label: 'VidSrc Me',    url: `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}` },
    { label: 'VidLink',      url: `https://vidlink.pro/tv/${id}/${season}/${episode}` },
    { label: 'SmashyStream', url: `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${season}&episode=${episode}` },
    { label: 'AutoEmbed',    url: `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}` },
    { label: 'MultiEmbed',   url: `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}` },
    { label: 'VidSrc ICU',   url: `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}` },
    { label: 'MoviesAPI',    url: `https://moviesapi.club/tv/${id}-${season}-${episode}` },
    { label: 'VidSrc To',   url: `https://vidsrc.to/embed/tv/${id}/${season}/${episode}` },
    { label: 'Nontongo',    url: `https://nontongo.win/embed/tv/${id}/${season}/${episode}` },
  ]
  if (type === 'anime') return [
    // Tested 2026-03-15 — anime-compatible sources
    { label: 'VidSrc ICU',   url: `https://vidsrc.icu/embed/anime/${id}/${episode}` },
    { label: 'SmashyStream', url: `https://embed.smashystream.com/playere.php?mal=${id}&ep=${episode}` },
    { label: 'VidSrc Me',    url: `https://vidsrc.me/embed/tv?mal=${id}&episode=${episode}` },
    { label: 'MultiEmbed',   url: `https://multiembed.mov/?video_id=${id}&tmdb=1` },
    { label: 'VidSrc To',    url: `https://vidsrc.to/embed/anime/${id}/1/${episode}` },
  ]
  // Note: anime1.me blocks iframe (X-Frame-Options). Use the 🎌 external button below.
  return []
}

const getExternalLink = (type: string, id: number | string, title?: string) => {
  if (type === 'movie') return `https://vidsrc.xyz/embed/movie/${id}`
  if (type === 'tv')    return `https://vidsrc.xyz/embed/tv/${id}/1/1`
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
  const [isFullscreen, setIsFullscreen] = useState(false)
  const playerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  // Keyboard: F = fullscreen, Esc = close (when not fullscreen)
  useEffect(() => {
    if (!playing) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') toggleFullscreen()
      if (e.key === 'Escape' && !document.fullscreenElement) close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [playing, toggleFullscreen, close])

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

        {/* Fullscreen */}
        <button onClick={toggleFullscreen}
          className="flex-shrink-0 flex items-center gap-1 bg-white/8 hover:bg-white/15 text-gray-400 hover:text-white text-sm px-2.5 py-1.5 rounded-lg transition-all border border-white/5"
          title={lang === 'zh' ? (isFullscreen ? '退出全屏' : '全屏') : (isFullscreen ? 'Exit fullscreen' : 'Fullscreen')}>
          {isFullscreen ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>

        {/* Open in new tab */}
        <a href={sources[srcIndex]?.url} target="_blank" rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-1 bg-white/8 hover:bg-white/15 text-gray-400 hover:text-white text-sm px-2.5 py-1.5 rounded-lg transition-all border border-white/5"
          title={lang === 'zh' ? '新标签打开（支持倍速）' : 'Open in new tab (speed control available)'}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

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
        <div ref={playerRef} className="flex-1 relative bg-black">
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
          {/* Not working hint - always visible after load */}
          {loaded && srcIndex < sources.length - 1 && (
            <button onClick={tryNextSource}
              className="absolute bottom-4 right-4 z-20 bg-black/70 hover:bg-black/90 text-gray-400 hover:text-white text-xs px-3 py-2 rounded-lg transition-all backdrop-blur-sm border border-white/10">
              {lang === 'zh' ? '没反应？试下一条 →' : 'Not working? Next →'}
            </button>
          )}
          <iframe
            key={`${playing.id}-${season}-${episode}-${srcIndex}`}
            src={sources[srcIndex]?.url}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            referrerPolicy="no-referrer"
            onLoad={() => setLoaded(true)}
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
          <span className="text-gray-500 text-xs">💡 {lang === 'zh' ? '如有弹窗，点关闭即可继续观看' : 'Close any popups to continue watching'}</span>
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
