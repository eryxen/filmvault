import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Tv from './pages/Tv'
import AnimePage from './pages/Anime'
import MovieDetail from './pages/MovieDetail'
import AnimeDetail from './pages/AnimeDetail'
import Watch from './pages/Watch'
import Search from './pages/Search'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Routes>
        {/* Watch page has its own minimal layout */}
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
              <Route path="/search" element={<Search />} />
            </Routes>
          </>
        } />
      </Routes>
    </div>
  )
}
