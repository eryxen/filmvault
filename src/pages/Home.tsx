import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Movie, TvShow, Anime } from '../types'
import { getTrending, getImageUrl, getRandomDailyMovie, getRandomDailyTv } from '../api/tmdb'
import { getTopAnime, getSeasonalAnime, getRandomDailyAnime } from '../api/jikan'
import MovieCard from '../components/MovieCard'
import AnimeCard from '../components/AnimeCard'
import SkeletonCard from '../components/SkeletonCard'
import { useWatchlistContext } from '../context/WatchlistContext'
import { usePlayer } from '../context/PlayerContext'
import { useLang } from '../context/LangContext'
import { t, tr } from '../i18n/translations'

export default function Home() {
  const navigate = useNavigate()
  const { watchlist, toggleWatchlist, isInWatchlist } = useWatchlistContext()
  const { play } = usePlayer()
  const { lang } = useLang()
  const T = (key: { zh: string; en: string }) => tr(key, lang)

  const [hero, setHero] = useState<Movie | null>(null)
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [trendingTv, setTrendingTv] = useState<TvShow[]>([])
  const [topAnime, setTopAnime] = useState<Anime[]>([])
  const [seasonalAnime, setSeasonalAnime] = useState<Anime[]>([])
  const [dailyMovie, setDailyMovie] = useState<Movie | null>(null)
  const [dailyTv, setDailyTv] = useState<TvShow | null>(null)
  const [dailyAnime, setDailyAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)
  const [heroIndex, setHeroIndex] = useState(0)
  const heroItems = useRef<Movie[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movies, tv, anime, seasonal, randMovie, randTv, randAnime] = await Promise.all([
          getTrending('movie', 'week'),
          getTrending('tv', 'week'),
          getTopAnime(1),
          getSeasonalAnime(),
          getRandomDailyMovie(),
          getRandomDailyTv(),
          getRandomDailyAnime(),
        ])
        const movieList = movies as Movie[]
        const tvList = tv as TvShow[]
        const animeList = anime.results

        heroItems.current = movieList.slice(0, 5)
        setHero(movieList[0])
        setTrendingMovies(movieList)
        setTrendingTv(tvList)
        setTopAnime(animeList.slice(0, 12))
        setSeasonalAnime(seasonal.slice(0, 12))

        if (randMovie) setDailyMovie(randMovie)
        if (randTv) setDailyTv(randTv)
        if (randAnime) setDailyAnime(randAnime)
      } catch (err) {
        console.error('Home fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (heroItems.current.length === 0) return
    const timer = setInterval(() => {
      setHeroIndex(i => {
        const next = (i + 1) % heroItems.current.length
        setHero(heroItems.current[next])
        return next
      })
    }, 6000)
    return () => clearInterval(timer)
  }, [loading])

  const skeletons = Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <div className="relative h-[85vh] min-h-[500px] overflow-hidden">
        {hero?.backdrop_path ? (
          <img key={hero.id} src={getImageUrl(hero.backdrop_path, 'original')} alt={hero.title}
            className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-indigo-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/20" />

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
            <div className="max-w-xl">
              <p className="section-label text-blue-400 mb-3">{T(t.hero.trending)}</p>
              <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-4">
                {hero?.title ?? (loading ? '...' : '云影')}
              </h1>
              <p className="text-gray-300 text-base leading-relaxed mb-6 line-clamp-3">{hero?.overview}</p>
              <div className="flex items-center gap-4 mb-8">
                {hero?.vote_average && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-bold text-lg">{hero.vote_average.toFixed(1)}</span>
                  </div>
                )}
                {hero?.release_date && <span className="text-gray-400 text-sm">{hero.release_date.slice(0, 4)}</span>}
              </div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => hero && play({ type: 'movie', id: hero.id, title: hero.title })}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30">
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  {T(t.hero.watchNow)}
                </button>
                <button onClick={() => hero && navigate(`/movie/${hero.id}`)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-all backdrop-blur-sm border border-white/10">
                  {T(t.hero.moreInfo)}
                </button>
                {hero && (
                  <button
                    onClick={() => toggleWatchlist({ id: hero.id, type: 'movie', title: hero.title, poster: hero.poster_path, score: hero.vote_average, year: hero.release_date?.slice(0,4) || null })}
                    className={`flex items-center gap-2 font-bold px-4 py-3 rounded-xl transition-all border ${isInWatchlist(hero.id, 'movie') ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>
                    <svg className="w-5 h-5" fill={isInWatchlist(hero.id, 'movie') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroItems.current.map((_, i) => (
            <button key={i} onClick={() => { setHeroIndex(i); setHero(heroItems.current[i]) }}
              className={`transition-all duration-300 rounded-full ${i === heroIndex ? 'w-8 h-2 bg-blue-400' : 'w-2 h-2 bg-white/30'}`} />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-[#0d1a1a] via-[#0d2626] to-[#0d1a1a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: T(t.stats.movies), value: '10K+', icon: '🎬', color: 'text-blue-400', path: '/movies' },
              { label: T(t.stats.tv), value: '5K+', icon: '📺', color: 'text-green-400', path: '/tv' },
              { label: T(t.stats.anime), value: '3K+', icon: '⛩️', color: 'text-purple-400', path: '/anime' },
              { label: T(t.stats.myList), value: watchlist.length.toString(), icon: '🔖', color: 'text-yellow-400', path: '/watchlist' },
            ].map(stat => (
              <div key={stat.label} onClick={() => navigate(stat.path)}
                className="bg-white/5 rounded-2xl p-6 border border-white/5 cursor-pointer hover:bg-white/8 transition-colors">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                <div className={`section-label ${stat.color} text-xs`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Picks */}
      {!loading && (dailyMovie || dailyTv || dailyAnime) && (
        <section className="py-12" style={{ background: 'linear-gradient(180deg, #0f0a0a 0%, #1a0d0d 50%, #0a0a0f 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="section-label text-red-400 mb-1">{T(t.daily.label)}</p>
            <h2 className="text-2xl font-black text-white mb-8">{T(t.daily.title)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dailyMovie && <DailyCard title={dailyMovie.title} overview={dailyMovie.overview}
                backdrop={dailyMovie.backdrop_path} poster={dailyMovie.poster_path}
                score={dailyMovie.vote_average} year={dailyMovie.release_date?.slice(0,4)}
                label={T(t.daily.movieOfDay)} accent="blue"
                onClick={() => navigate(`/movie/${dailyMovie.id}`)}
                onWatch={() => play({ type: 'movie', id: dailyMovie.id, title: dailyMovie.title })} />}
              {dailyTv && <DailyCard title={(dailyTv as TvShow).name} overview={dailyTv.overview}
                backdrop={dailyTv.backdrop_path} poster={dailyTv.poster_path}
                score={dailyTv.vote_average} year={(dailyTv as TvShow).first_air_date?.slice(0,4)}
                label={T(t.daily.tvOfDay)} accent="green"
                onClick={() => navigate(`/tv/${dailyTv.id}`)}
                onWatch={() => play({ type: 'tv', id: dailyTv.id, title: (dailyTv as TvShow).name })} />}
              {dailyAnime && <DailyCard title={dailyAnime.title_english || dailyAnime.title}
                overview={dailyAnime.synopsis?.slice(0,200) + '...' || ''} backdrop={null}
                poster={dailyAnime.images?.jpg?.large_image_url || null}
                score={dailyAnime.score} year={dailyAnime.year?.toString()}
                label={T(t.daily.animeOfDay)} accent="purple"
                onClick={() => navigate(`/anime/${dailyAnime.mal_id}`)}
                onWatch={() => play({ type: 'anime', id: dailyAnime.mal_id, title: dailyAnime.title_english || dailyAnime.title })} />}
            </div>
          </div>
        </section>
      )}

      {/* Trending Movies */}
      <section className="py-12" style={{ background: 'linear-gradient(180deg, #0d1117 0%, #0a0a0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label text-blue-400 mb-1">{T(t.section.trendingMoviesLabel)}</p>
              <h2 className="text-2xl font-black text-white">{T(t.section.trendingMovies)}</h2>
            </div>
            <button onClick={() => navigate('/movies')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">{T(t.section.viewAll)}</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {loading ? skeletons : trendingMovies.slice(0, 8).map(m => <MovieCard key={m.id} item={m} type="movie" />)}
          </div>
        </div>
      </section>

      {/* Trending TV */}
      <section className="py-12" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d120d 50%, #0a0a0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label text-green-400 mb-1">{T(t.section.trendingTvLabel)}</p>
              <h2 className="text-2xl font-black text-white">{T(t.section.trendingTv)}</h2>
            </div>
            <button onClick={() => navigate('/tv')} className="text-green-400 hover:text-green-300 text-sm font-medium">{T(t.section.viewAll)}</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {loading ? skeletons : trendingTv.slice(0, 8).map(tv => <MovieCard key={tv.id} item={tv} type="tv" />)}
          </div>
        </div>
      </section>

      {/* Seasonal Anime */}
      <section className="py-12" style={{ background: 'linear-gradient(180deg, #0f0d1a 0%, #0a0a0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label text-purple-400 mb-1">{T(t.section.seasonalLabel)}</p>
              <h2 className="text-2xl font-black text-white">{T(t.section.seasonal)}</h2>
            </div>
            <button onClick={() => navigate('/anime')} className="text-purple-400 hover:text-purple-300 text-sm font-medium">{T(t.section.viewAll)}</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {loading ? skeletons : seasonalAnime.slice(0, 8).map(a => <AnimeCard key={a.mal_id} anime={a} />)}
          </div>
        </div>
      </section>

      {/* Top Anime */}
      <section className="py-12 pb-20" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0a1a 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label text-yellow-400 mb-1">{T(t.section.topAnimeLabel)}</p>
              <h2 className="text-2xl font-black text-white">{T(t.section.topAnime)}</h2>
            </div>
            <button onClick={() => navigate('/anime')} className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">{T(t.section.viewAll)}</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {loading ? skeletons : topAnime.slice(0, 8).map(a => <AnimeCard key={a.mal_id} anime={a} />)}
          </div>
        </div>
      </section>
    </div>
  )
}

function DailyCard({ title, overview, backdrop, poster, score, year, label, accent, onClick, onWatch }: {
  title: string; overview: string; backdrop: string | null; poster: string | null
  score: number | null; year?: string; label: string; accent: 'blue' | 'green' | 'purple'
  onClick: () => void; onWatch: () => void
}) {
  const { lang } = useLang()
  const watchNow = lang === 'zh' ? '立即观看' : 'Watch Now'
  const accentMap = {
    blue:   { text: 'text-blue-400', bg: 'bg-blue-500 hover:bg-blue-400', border: 'border-blue-500/20', glow: 'from-blue-950/80' },
    green:  { text: 'text-green-400', bg: 'bg-green-500 hover:bg-green-400', border: 'border-green-500/20', glow: 'from-green-950/80' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-500 hover:bg-purple-400', border: 'border-purple-500/20', glow: 'from-purple-950/80' },
  }
  const c = accentMap[accent]
  const imgSrc = backdrop ? getImageUrl(backdrop, 'w780')
    : poster ? (poster.startsWith('http') ? poster : getImageUrl(poster, 'w780'))
    : null

  return (
    <div className={`relative rounded-2xl overflow-hidden border ${c.border} cursor-pointer group`} onClick={onClick}>
      <div className="absolute inset-0">
        {imgSrc ? (
          <img src={imgSrc} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${c.glow} to-[#0a0a0f]`} />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${c.glow} via-black/60 to-transparent`} />
      </div>
      <div className="relative p-6 pt-40">
        <p className={`section-label ${c.text} mb-2`}>{label}</p>
        <h3 className="text-white text-xl font-black mb-2 leading-tight">{title}</h3>
        <div className="flex items-center gap-3 mb-3">
          {score && <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold"><span>★</span>{score.toFixed(1)}</span>}
          {year && <span className="text-gray-400 text-sm">{year}</span>}
        </div>
        <p className="text-gray-300 text-sm line-clamp-2 mb-4">{overview}</p>
        <button onClick={e => { e.stopPropagation(); onWatch() }}
          className={`w-full py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide text-white transition-all ${c.bg}`}>
          {watchNow}
        </button>
      </div>
    </div>
  )
}
