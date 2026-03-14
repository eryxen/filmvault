import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useWatchlistContext } from '../context/WatchlistContext'
import { useLang } from '../context/LangContext'
import { t, tr } from '../i18n/translations'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { watchlist } = useWatchlistContext()
  const { lang, toggle } = useLang()
  const T = (key: { zh: string; en: string }) => tr(key, lang)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">云</span>
            </div>
            <span className="font-black text-white text-lg tracking-tight">
              云<span className="text-blue-400">影</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
              {T(t.nav.home)}
            </Link>
            <Link to="/movies" className={`text-sm font-medium transition-colors ${isActive('/movies') ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}>
              {T(t.nav.movies)}
            </Link>
            <Link to="/tv" className={`text-sm font-medium transition-colors ${isActive('/tv') ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}>
              {T(t.nav.tv)}
            </Link>
            <Link to="/anime" className={`text-sm font-medium transition-colors ${isActive('/anime') ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}>
              {T(t.nav.anime)}
            </Link>
            <Link to="/watchlist" className={`relative text-sm font-medium transition-colors ${isActive('/watchlist') ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}>
              {T(t.nav.watchlist)}
              {watchlist.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-yellow-500 text-black text-xs font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {watchlist.length > 9 ? '9+' : watchlist.length}
                </span>
              )}
            </Link>
          </div>

          {/* Right: Search + Lang Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Lang toggle */}
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-xs font-bold transition-all"
            >
              <span className={lang === 'zh' ? 'text-blue-400' : 'text-gray-500'}>中</span>
              <span className="text-gray-600">/</span>
              <span className={lang === 'en' ? 'text-blue-400' : 'text-gray-500'}>EN</span>
            </button>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={T(t.nav.search)}
                  className="bg-white/5 border border-white/10 rounded-full px-4 py-2 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 w-52 transition-all"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-400 hover:text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a0f]/95 px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-300 hover:text-white py-2">{T(t.nav.home)}</Link>
          <Link to="/movies" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-blue-400 hover:text-blue-300 py-2">{T(t.nav.movies)}</Link>
          <Link to="/tv" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-green-400 hover:text-green-300 py-2">{T(t.nav.tv)}</Link>
          <Link to="/anime" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-purple-400 hover:text-purple-300 py-2">{T(t.nav.anime)}</Link>
          <Link to="/watchlist" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-yellow-400 hover:text-yellow-300 py-2">
            🔖 {T(t.nav.watchlist)} {watchlist.length > 0 && `(${watchlist.length})`}
          </Link>
          {/* Lang toggle mobile */}
          <button onClick={toggle} className="flex items-center gap-2 text-sm font-medium text-gray-400 py-2">
            <span className={lang === 'zh' ? 'text-blue-400 font-bold' : ''}>中文</span>
            <span className="text-gray-600">/</span>
            <span className={lang === 'en' ? 'text-blue-400 font-bold' : ''}>English</span>
          </button>
          <form onSubmit={handleSearch} className="pt-2">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={T(t.nav.search)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </form>
        </div>
      )}
    </nav>
  )
}
