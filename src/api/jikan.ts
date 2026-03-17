import axios from 'axios'
import { Anime } from '../types'

const jikan = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
})

export const getTopAnime = async (page = 1) => {
  const res = await jikan.get('/top/anime', { params: { page, limit: 20 } })
  return { results: res.data.data as Anime[], totalPages: res.data.pagination?.last_visible_page || 1 }
}

export const getSeasonalAnime = async () => {
  const res = await jikan.get('/seasons/now', { params: { limit: 20 } })
  return res.data.data as Anime[]
}

export const searchAnime = async (query: string, page = 1) => {
  const res = await jikan.get('/anime', { params: { q: query, page, limit: 20 } })
  return { results: res.data.data as Anime[], totalPages: res.data.pagination?.last_visible_page || 1 }
}

export const getAnimeDetails = async (id: number): Promise<Anime & { recommendations: Anime[] }> => {
  const [details, recommendations] = await Promise.all([
    jikan.get(`/anime/${id}/full`),
    jikan.get(`/anime/${id}/recommendations`),
  ])
  const recs = recommendations.data.data
    .slice(0, 12)
    .map((r: { entry: Anime }) => r.entry)
  return { ...details.data.data, recommendations: recs }
}

export const getRandomDailyAnime = async (): Promise<Anime | null> => {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  let h = seed * 17
  h = ((h >> 16) ^ h) * 0x45d9f3b
  h = (h >> 16) ^ h
  const page = (Math.abs(h) % 20) + 1
  const idx = (Math.abs(h * 37) % 20)
  try {
    const res = await jikan.get('/top/anime', { params: { page, limit: 20 } })
    const results = res.data.data as Anime[]
    return results.length ? results[idx % results.length] : null
  } catch { return null }
}

export const getAnimeByGenre = async (genreId: number, page = 1) => {
  const res = await jikan.get('/anime', { params: { genres: genreId, page, limit: 20, order_by: 'score', sort: 'desc' } })
  return { results: res.data.data as Anime[], totalPages: res.data.pagination?.last_visible_page || 1 }
}
