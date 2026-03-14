export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  release_date: string
  genre_ids: number[]
  genres?: Genre[]
  runtime?: number
  tagline?: string
  cast?: CastMember[]
  similar?: Movie[]
}

export interface TvShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  first_air_date: string
  genre_ids: number[]
  genres?: Genre[]
  number_of_seasons?: number
  number_of_episodes?: number
  tagline?: string
  cast?: CastMember[]
  similar?: TvShow[]
}

export interface Anime {
  mal_id: number
  title: string
  title_english: string | null
  synopsis: string
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
  }
  score: number | null
  scored_by: number | null
  year: number | null
  episodes: number | null
  status: string
  genres: { mal_id: number; name: string }[]
  studios: { mal_id: number; name: string }[]
  trailer?: { youtube_id: string | null }
}

export interface Genre {
  id: number
  name: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface SearchResult {
  movies: Movie[]
  tvShows: TvShow[]
  anime: Anime[]
}
