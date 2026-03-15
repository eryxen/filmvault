import { Routes, Route } from 'react-router-dom'
import { WatchlistProvider } from './context/WatchlistContext'
import { LangProvider } from './context/LangContext'
import { PlayerProvider } from './context/PlayerContext'
import Navbar from './components/Navbar'
import VideoPlayer from './components/VideoPlayer'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Tv from './pages/Tv'
import AnimePage from './pages/Anime'
import MovieDetail from './pages/MovieDetail'
import AnimeDetail from './pages/AnimeDetail'
import Search from './pages/Search'
import Watchlist from './pages/Watchlist'
import LiveTV from './pages/LiveTV'
import YYeTs from './pages/YYeTs'

export default function App() {
  return (
    <LangProvider>
      <WatchlistProvider>
        <PlayerProvider>
          <VideoPlayer />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<Tv />} />
            <Route path="/anime" element={<AnimePage />} />
            <Route path="/movie/:id" element={<MovieDetail type="movie" />} />
            <Route path="/tv/:id" element={<MovieDetail type="tv" />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/search" element={<Search />} />
            <Route path="/live" element={<LiveTV />} />
            <Route path="/yyets" element={<YYeTs />} />
          </Routes>
        </PlayerProvider>
      </WatchlistProvider>
    </LangProvider>
  )
}
