import { Routes, Route } from 'react-router-dom'
import { WatchlistProvider } from './context/WatchlistContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Tv from './pages/Tv'
import AnimePage from './pages/Anime'
import MovieDetail from './pages/MovieDetail'
import AnimeDetail from './pages/AnimeDetail'
import Watch from './pages/Watch'
import Search from './pages/Search'
import Watchlist from './pages/Watchlist'

export default function App() {
  return (
    <WatchlistProvider>
      <Routes>
        {/* Watch page — minimal layout */}
        <Route path="/watch/:type/:id" element={<Watch />} />

        {/* Main app with Navbar */}
        <Route path="*" element={
          <>
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
            </Routes>
          </>
        } />
      </Routes>
    </WatchlistProvider>
  )
}
