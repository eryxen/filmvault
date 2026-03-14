import { useEffect, useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import { useLang } from '../context/LangContext'

// Embed sources — ordered by cleanliness (least ads first)
// sandbox on iframe blocks popup windows at browser level
const SOURCES: Record<string, (id: number | string, s?: number, e?: number) => string> = {
  // 2embed — cleaner, no popups
  '2embed_movie':  (id) => `https://www.2embed.cc/embed/${id}`,
  '2embed_tv':     (id, s=1, e=1) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  // multiembed — very clean
  'multi_movie':   (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
  'multi_tv':      (id, s=1, e=1) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  // vidsrc.me (different from vidsrc.to, fewer ads)
  'vidsrcme_movie': (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
  'vidsrcme_tv':    (id, s=1, e=1) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  // anime sources
  'anime_embed':   (id) => `https://vidsrc.me/embed/tv?tmdb=${id}`,
}

const getSources = (type: string, id: number | string, season = 1, episode = 1): string[] => {
  if (type === 'movie') return [
    `https://www.2embed.cc/embed/${id}`,
    `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    `https://vidsrc.me/embed/movie?tmdb=${id}`,
    `https://vidsrc.to/embed/movie/${id}`,
  ]
  if (type === 'tv') return [
    `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
    `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
    `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`,
    `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
  ]
  if (type === 'anime') return [
    `https://vidsrc.to/embed/anime/${id}/1/${episode}`,
    `https://9anime.pl/watch/${id}`,
  ]
  return []
}

const getAlt = (type: string, id: number | string) => {
  if (type === 'movie') return `https://www.2embed.cc/embed/${id}`
  if (type === 'tv')    return `https://www.2embed.cc/embedtv/${id}&s=1&e=1`
  return `https://anime1.me`
}
void SOURCES // suppress unused warning

export default function VideoPlayer() {
  const { playing, close } = usePlayer()
  const { lang } = useLang()
  const [season, setSeason] = useState(1)
  const [episode, setEpisode] = useState(1)
  const [srcIndex, setSrcIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const sources = playing ? getSources(playing.type, playing.id, season, episode) : []

  useEffect(() => {
    if (playing) {
      setSeason(playing.season || 1)
      setEpisode(playing.episode || 1)
      setSrcIndex(0)
      setLoaded(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [playing])

  // Reset iframe on season/episode change
  useEffect(() => {
    setLoaded(false)
    setSrcIndex(0)
  }, [season, episode])

  if (!playing) return null

  const isTV = playing.type === 'tv'
  const isAnime = playing.type === 'anime'
  const typeLabel = playing.type === 'movie'
    ? (lang === 'zh' ? '电影' : 'Movie')
    : playing.type === 'tv'
    ? (lang === 'zh' ? '剧集' : 'TV Show')
    : (lang === 'zh' ? '动漫' : 'Anime')

  const accentColor = playing.type === 'movie' ? 'text-blue-400' : playing.type === 'tv' ? 'text-green-400' : 'text-purple-400'
  const accentBg = playing.type === 'movie' ? 'bg-blue-500' : playing.type === 'tv' ? 'bg-green-500' : 'bg-purple-500'

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      {/* Top Bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0a0a0f]/95 backdrop-blur-sm border-b border-white/5 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-black text-xs">云</span>
          </div>
          <span className="text-white font-black text-sm hidden sm:block">云<span className="text-blue-400">影</span></span>
        </div>

        <span className="text-gray-600 hidden sm:block">|</span>

        {/* Title + type */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className={`section-label ${accentColor} text-xs hidden sm:block flex-shrink-0`}>{typeLabel.toUpperCase()}</span>
          <span className="text-white font-semibold text-sm truncate">{playing.title}</span>
          {(isTV || isAnime) && (
            <span className="text-gray-500 text-xs flex-shrink-0">
              S{season} E{episode}
            </span>
          )}
        </div>

        {/* Source switcher */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-gray-600 text-xs hidden sm:block mr-1">
            {lang === 'zh' ? '线路' : 'Source'}
          </span>
          {sources.slice(0, playing?.type === 'anime' ? 2 : 4).map((_, i) => (
            <button key={i} onClick={() => { setSrcIndex(i); setLoaded(false) }}
              className={`h-7 px-2 rounded-lg text-xs font-bold transition-all ${srcIndex === i ? `${accentBg} text-white` : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
              {i === 0 ? (lang === 'zh' ? '线1' : 'S1') :
               i === 1 ? (lang === 'zh' ? '线2' : 'S2') :
               i === 2 ? (lang === 'zh' ? '线3' : 'S3') : (lang === 'zh' ? '线4' : 'S4')}
            </button>
          ))}
        </div>

        {/* Close */}
        <button onClick={close}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ml-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="hidden sm:block">{lang === 'zh' ? '关闭' : 'Close'}</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Player */}
        <div className="flex-1 relative bg-black">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
              <div className={`w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mb-4 ${accentBg.replace('bg-', 'border-')}`} />
              <p className="text-gray-400 text-sm">{lang === 'zh' ? '加载中...' : 'Loading...'}</p>
            </div>
          )}
          <iframe
            key={`${playing.id}-${season}-${episode}-${srcIndex}`}
            src={sources[srcIndex]}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            referrerPolicy="origin"
            onLoad={() => setLoaded(true)}
            // sandbox blocks popup windows & new tab redirects from iframe content
            // allow-scripts + allow-same-origin needed for player to work
            // deliberately OMIT: allow-popups, allow-top-navigation, allow-popups-to-escape-sandbox
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock allow-orientation-lock"
          />
        </div>

        {/* Episode sidebar (TV / Anime only) */}
        {(isTV || isAnime) && (
          <div className="w-48 bg-[#0d0d14] border-l border-white/5 flex flex-col flex-shrink-0 hidden lg:flex">
            <div className="p-3 border-b border-white/5">
              <p className={`section-label ${accentColor} text-xs mb-1`}>{lang === 'zh' ? '选集' : 'EPISODES'}</p>
              {isTV && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 text-xs">{lang === 'zh' ? '季' : 'S'}</span>
                  <div className="flex gap-1 flex-wrap">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map(s => (
                      <button key={s} onClick={() => { setSeason(s); setEpisode(1) }}
                        className={`w-7 h-7 rounded text-xs font-bold transition-all ${season === s ? `${accentBg} text-white` : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {Array.from({ length: 24 }, (_, i) => i + 1).map(ep => (
                <button key={ep} onClick={() => setEpisode(ep)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all mb-1 ${episode === ep ? `${accentBg} text-white font-bold` : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                  {lang === 'zh' ? `第 ${ep} 集` : `Episode ${ep}`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile episode selector for TV */}
      {(isTV || isAnime) && (
        <div className="lg:hidden border-t border-white/5 bg-[#0d0d14] px-4 py-2 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <span className="text-gray-500 text-xs flex-shrink-0">{lang === 'zh' ? '集数：' : 'EP:'}</span>
            {isTV && (
              <>
                <span className="text-gray-600 text-xs flex-shrink-0">{lang === 'zh' ? '季' : 'S'}</span>
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => { setSeason(s); setEpisode(1) }}
                    className={`flex-shrink-0 w-8 h-8 rounded text-xs font-bold transition-all ${season === s ? `${accentBg} text-white` : 'bg-white/10 text-gray-400'}`}>
                    {s}
                  </button>
                ))}
                <span className="text-gray-600 text-xs flex-shrink-0 ml-2">E</span>
              </>
            )}
            {Array.from({ length: 24 }, (_, i) => i + 1).map(ep => (
              <button key={ep} onClick={() => setEpisode(ep)}
                className={`flex-shrink-0 w-8 h-8 rounded text-xs font-bold transition-all ${episode === ep ? `${accentBg} text-white` : 'bg-white/10 text-gray-400'}`}>
                {ep}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hint */}
      <div className="bg-[#0a0a0f] border-t border-white/5 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <p className="text-gray-600 text-xs">
          {lang === 'zh' ? '弹窗广告已屏蔽 · 播放异常？切换线路试试' : 'Popups blocked · Not playing? Switch source above'}
        </p>
        <a href={playing ? getAlt(playing.type, playing.id) : '#'} target="_blank" rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 underline">
          {lang === 'zh' ? '外部播放' : 'Open externally'}
        </a>
      </div>
    </div>
  )
}
