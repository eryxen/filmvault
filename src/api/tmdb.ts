import axios from 'axios'
import { Movie, TvShow, Genre, CastMember } from '../types'

const API_KEY = '8265bd1679663a7ea12ac168da84d2e8'
const BASE_URL = 'https://api.themoviedb.org/3'
export const IMAGE_BASE = 'https://image.tmdb.org/t/p'

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: 'en-US' },
})

export const getImageUrl = (path: string | null, size = 'w500') =>
  path ? `${IMAGE_BASE}/${size}${path}` : '/placeholder.jpg'

export const getTrending = async (media: 'movie' | 'tv', period: 'day' | 'week' = 'week') => {
  const res = await tmdb.get(`/trending/${media}/${period}`)
  return res.data.results as Movie[] | TvShow[]
}

export const getPopularMovies = async (page = 1) => {
  const res = await tmdb.get('/movie/popular', { params: { page } })
  return { results: res.data.results as Movie[], totalPages: res.data.total_pages }
}

export const getTopRatedMovies = async (page = 1) => {
  const res = await tmdb.get('/movie/top_rated', { params: { page } })
  return { results: res.data.results as Movie[], totalPages: res.data.total_pages }
}

export const getPopularTv = async (page = 1) => {
  const res = await tmdb.get('/tv/popular', { params: { page } })
  return { results: res.data.results as TvShow[], totalPages: res.data.total_pages }
}

export const getMovieDetails = async (id: number): Promise<Movie> => {
  const [details, credits, similar] = await Promise.all([
    tmdb.get(`/movie/${id}`),
    tmdb.get(`/movie/${id}/credits`),
    tmdb.get(`/movie/${id}/similar`),
  ])
  return {
    ...details.data,
    cast: credits.data.cast.slice(0, 12) as CastMember[],
    similar: similar.data.results.slice(0, 12) as Movie[],
  }
}

export const getTvDetails = async (id: number): Promise<TvShow> => {
  const [details, credits, similar] = await Promise.all([
    tmdb.get(`/tv/${id}`),
    tmdb.get(`/tv/${id}/credits`),
    tmdb.get(`/tv/${id}/similar`),
  ])
  return {
    ...details.data,
    cast: credits.data.cast.slice(0, 12) as CastMember[],
    similar: similar.data.results.slice(0, 12) as TvShow[],
  }
}

export const searchMovies = async (query: string, page = 1) => {
  const res = await tmdb.get('/search/movie', { params: { query, page } })
  return { results: res.data.results as Movie[], totalPages: res.data.total_pages }
}

export const searchTv = async (query: string, page = 1) => {
  const res = await tmdb.get('/search/tv', { params: { query, page } })
  return { results: res.data.results as TvShow[], totalPages: res.data.total_pages }
}

export const getMovieGenres = async (): Promise<Genre[]> => {
  const res = await tmdb.get('/genre/movie/list')
  return res.data.genres
}

export const getTvGenres = async (): Promise<Genre[]> => {
  const res = await tmdb.get('/genre/tv/list')
  return res.data.genres
}

export const discoverMovies = async (genreId?: number, page = 1) => {
  const params: Record<string, string | number> = { page, sort_by: 'popularity.desc' }
  if (genreId) params.with_genres = genreId
  const res = await tmdb.get('/discover/movie', { params })
  return { results: res.data.results as Movie[], totalPages: res.data.total_pages }
}

export const discoverTv = async (genreId?: number, page = 1) => {
  const params: Record<string, string | number> = { page, sort_by: 'popularity.desc' }
  if (genreId) params.with_genres = genreId
  const res = await tmdb.get('/discover/tv', { params })
  return { results: res.data.results as TvShow[], totalPages: res.data.total_pages }
}

// Daily random picks — deterministic per day, wide pool
const dateSeed = () => {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

const seededRandom = (seed: number, max: number) => {
  // Simple hash to spread seed across range
  let h = seed
  h = ((h >> 16) ^ h) * 0x45d9f3b
  h = ((h >> 16) ^ h) * 0x45d9f3b
  h = (h >> 16) ^ h
  return (Math.abs(h) % max) + 1
}

export const getRandomDailyMovie = async (): Promise<Movie | null> => {
  const seed = dateSeed()
  const page = seededRandom(seed, 50)
  const idx = seededRandom(seed * 31, 20) - 1
  try {
    const res = await tmdb.get('/discover/movie', {
      params: { page, sort_by: 'vote_average.desc', 'vote_count.gte': 500 }
    })
    const results = res.data.results as Movie[]
    return results.length ? results[idx % results.length] : null
  } catch { return null }
}

export const getRandomDailyTv = async (): Promise<TvShow | null> => {
  const seed = dateSeed()
  const page = seededRandom(seed * 7, 30)
  const idx = seededRandom(seed * 13, 20) - 1
  try {
    const res = await tmdb.get('/discover/tv', {
      params: { page, sort_by: 'vote_average.desc', 'vote_count.gte': 300 }
    })
    const results = res.data.results as TvShow[]
    return results.length ? results[idx % results.length] : null
  } catch { return null }
}
