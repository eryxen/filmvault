import { useEffect, useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import { useLang } from '../context/LangContext'

// Free embed sources
const getSrc = (type: string, id: number | string, season = 1, episode = 1) => {
  if (type === 'movie') return `https://vidsrc.to/embed/movie/${id}`
  if (type === 'tv')    return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
  if (type === 'anime') return `https://vidsrc.to/embed/anime/${id}/1/1`
  return ''
}

const getAlt = (type: string, id: number | string) => {
  if (type === 'movie') return `https://vidbox.cc/movie/${id}`
  if (type === 'tv')    return `https://vidbox.cc/tv/${id}`
  return `https://anime1.me`
}

export default function VideoPlayer() {
  const { playing, close } = usePlayer()
  const { lang } = useLang()
  const [season, setSeason] = useState(1)
  const [episode, setEpisode] = useState(1)
  const [srcIndex, setSrcIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const sources = playing ? [
    getSrc(playing.type, playing.id, season, episode),
    playing.type !== 'anime' ? getAlt(playing.type, playing.id) : 'https://anime1.me',
  ] : []

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
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-gray-600 text-xs hidden sm:block">
            {lang === 'zh' ? '线路' : 'Source'}
          </span>
          {sources.map((_, i) => (
            <button key={i} onClick={() => { setSrcIndex(i); setLoaded(false) }}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${srcIndex === i ? `${accentBg} text-white` : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
              {i + 1}
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
          {lang === 'zh' ? '播放异常？切换上方线路 1 / 2 试试' : "Can't play? Try switching Source 1 / 2 above"}
        </p>
        <a href={sources[1]} target="_blank" rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 underline">
          {lang === 'zh' ? '外部播放' : 'Open externally'}
        </a>
      </div>
    </div>
  )
}
