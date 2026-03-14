import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Movie, TvShow, Anime } from '../types'
import { getTrending, getImageUrl } from '../api/tmdb'
import { getTopAnime, getSeasonalAnime } from '../api/jikan'
import MovieCard from '../components/MovieCard'
import AnimeCard from '../components/AnimeCard'
import SkeletonCard from '../components/SkeletonCard'

export default function Home() {
  const navigate = useNavigate()
  const [hero, setHero] = useState<Movie | null>(null)
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [trendingTv, setTrendingTv] = useState<TvShow[]>([])
  const [topAnime, setTopAnime] = useState<Anime[]>([])
  const [seasonalAnime, setSeasonalAnime] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [heroIndex, setHeroIndex] = useState(0)
  const heroItems = useRef<Movie[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movies, tv, anime, seasonal] = await Promise.all([
          getTrending('movie', 'week'),
          getTrending('tv', 'week'),
          getTopAnime(1),
          getSeasonalAnime(),
        ])
        const movieList = movies as Movie[]
        heroItems.current = movieList.slice(0, 5)
        setHero(movieList[0])
        setTrendingMovies(movieList)
        setTrendingTv(tv as TvShow[])
        setTopAnime(anime.results.slice(0, 12))
        setSeasonalAnime(seasonal.slice(0, 12))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Auto rotate hero
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
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[500px] overflow-hidden">
        {hero?.backdrop_path ? (
          <img
            key={hero.id}
            src={getImageUrl(hero.backdrop_path, 'original')}
            alt={hero.title}
            className="absolute inset-0 w-full h-full object-cover animate-fade-in"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-indigo-950" />
        )}
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/20" />

        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
            <div className="max-w-xl">
              <p className="section-label text-blue-400 mb-3">TRENDING THIS WEEK</p>
              <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-4">
                {hero?.title ?? '...'}
              </h1>
              <p className="text-gray-300 text-base leading-relaxed mb-6 line-clamp-3">
                {hero?.overview}
              </p>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-white font-bold">{hero?.vote_average?.toFixed(1)}</span>
                </div>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm">{hero?.release_date?.slice(0, 4)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => hero && navigate(`/watch/movie/${hero.id}`)}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Now
                </button>
                <button
                  onClick={() => hero && navigate(`/movie/${hero.id}`)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-all backdrop-blur-sm border border-white/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  More Info
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroItems.current.map((_, i) => (
            <button
              key={i}
              onClick={() => { setHeroIndex(i); setHero(heroItems.current[i]) }}
              className={`transition-all duration-300 rounded-full ${i === heroIndex ? 'w-8 h-2 bg-blue-400' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-[#0d1a1a] via-[#0d2626] to-[#0d1a1a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'MOVIES', value: '10K+', icon: '🎬', color: 'text-blue-400' },
              { label: 'TV SHOWS', value: '5K+', icon: '📺', color: 'text-green-400' },
              { label: 'ANIME', value: '3K+', icon: '⛩️', color: 'text-purple-400' },
              { label: 'GENRES', value: '20+', icon: '🎭', color: 'text-yellow-400' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                <div className={`section-label ${stat.color} text-xs`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Movies */}
      <section className="py-12" style={{ background: 'linear-gradient(180deg, #0d1117 0%, #0a0a0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label text-blue-400 mb-1">THIS WEEK</p>
              <h2 className="text-2xl font-black text-white">Trending Movies</h2>
            </div>
            <button onClick={() => navigate('/movies')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {loading
              ? skeletons
              : trendingMovies.slice(0, 8).map(m => <MovieCard key={m.id} item={m} type="movie" />)}
          </div>
        </div>
      </section>

      {/* Trending TV */}
      <section className="py-12" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d120d 50%, #0a0a0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label text-green-400 mb-1">POPULAR NOW</p>
              <h2 className="text-2xl font-black text-white">Trending TV Shows</h2>
            </div>
            <button onClick={() => navigate('/tv')} className="text-green-400 hover:text-green-300 text-sm font-medium">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {loading
              ? skeletons
              : trendingTv.slice(0, 8).map(t => <MovieCard key={t.id} item={t} type="tv" />)}
          </div>
        </div>
      </section>

      {/* Seasonal Anime */}
      <section className="py-12" style={{ background: 'linear-gradient(180deg, #0f0d1a 0%, #0a0a0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label text-purple-400 mb-1">AIRING NOW</p>
              <h2 className="text-2xl font-black text-white">Seasonal Anime</h2>
            </div>
            <button onClick={() => navigate('/anime')} className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {loading
              ? skeletons
              : seasonalAnime.slice(0, 8).map(a => <AnimeCard key={a.mal_id} anime={a} />)}
          </div>
        </div>
      </section>

      {/* Top Anime */}
      <section className="py-12 pb-20" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0a1a 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label text-yellow-400 mb-1">ALL TIME</p>
              <h2 className="text-2xl font-black text-white">Top Rated Anime</h2>
            </div>
            <button onClick={() => navigate('/anime')} className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {loading
              ? skeletons
              : topAnime.slice(0, 8).map(a => <AnimeCard key={a.mal_id} anime={a} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
