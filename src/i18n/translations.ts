export type Lang = 'zh' | 'en'

export const t = {
  // Navbar
  nav: {
    home:      { zh: '首页', en: 'Home' },
    movies:    { zh: '电影', en: 'Movies' },
    tv:        { zh: '剧集', en: 'TV Shows' },
    anime:     { zh: '动漫', en: 'Anime' },
    watchlist: { zh: '我的清单', en: 'Watchlist' },
    search:    { zh: '搜索电影、动漫...', en: 'Search movies, anime...' },
  },
  // Hero
  hero: {
    trending:  { zh: '本周热门', en: 'TRENDING THIS WEEK' },
    watchNow:  { zh: '立即观看', en: 'Watch Now' },
    moreInfo:  { zh: '详细信息', en: 'More Info' },
  },
  // Stats
  stats: {
    movies:    { zh: '电影', en: 'MOVIES' },
    tv:        { zh: '剧集', en: 'TV SHOWS' },
    anime:     { zh: '动漫', en: 'ANIME' },
    myList:    { zh: '我的清单', en: 'MY LIST' },
  },
  // Daily Picks
  daily: {
    label:       { zh: '今日精选', en: 'CURATED FOR TODAY' },
    title:       { zh: '每日推荐', en: 'Daily Picks' },
    movieOfDay:  { zh: '今日电影', en: 'MOVIE OF THE DAY' },
    tvOfDay:     { zh: '今日剧集', en: 'SHOW OF THE DAY' },
    animeOfDay:  { zh: '今日动漫', en: 'ANIME OF THE DAY' },
  },
  // Sections
  section: {
    trendingMovies:   { zh: '热门电影', en: 'Trending Movies' },
    trendingMoviesLabel: { zh: '本周', en: 'THIS WEEK' },
    trendingTv:       { zh: '热门剧集', en: 'Trending TV Shows' },
    trendingTvLabel:  { zh: '当前流行', en: 'POPULAR NOW' },
    seasonal:         { zh: '本季新番', en: 'Seasonal Anime' },
    seasonalLabel:    { zh: '连载中', en: 'AIRING NOW' },
    topAnime:         { zh: '顶级动漫', en: 'Top Rated Anime' },
    topAnimeLabel:    { zh: '历史最佳', en: 'ALL TIME' },
    viewAll:          { zh: '查看全部 →', en: 'View All →' },
  },
  // Cards
  card: {
    movie:     { zh: '电影', en: 'MOVIE' },
    tvShow:    { zh: '剧集', en: 'TV SHOW' },
    anime:     { zh: '动漫', en: 'ANIME' },
    watchNow:  { zh: '立即观看', en: 'Watch Now' },
    addList:   { zh: '加入清单', en: 'Add to Watchlist' },
    removeList:{ zh: '移出清单', en: 'Remove from Watchlist' },
  },
  // Browse pages
  browse: {
    browse:         { zh: '浏览', en: 'BROWSE' },
    movies:         { zh: '电影', en: 'Movies' },
    tv:             { zh: '剧集', en: 'TV Shows' },
    anime:          { zh: '动漫', en: 'Anime' },
    searchMovies:   { zh: '搜索电影...', en: 'Search movies...' },
    searchTv:       { zh: '搜索剧集...', en: 'Search TV shows...' },
    searchAnime:    { zh: '搜索动漫...', en: 'Search anime...' },
    popular:        { zh: '热门', en: 'Popular' },
    topRated:       { zh: '高分', en: 'Top Rated' },
    seasonal:       { zh: '本季新番', en: 'Seasonal' },
    allGenres:      { zh: '全部类型', en: 'All Genres' },
    loadMore:       { zh: '加载更多', en: 'Load More' },
  },
  // Watchlist page
  watchlistPage: {
    myList:   { zh: '我的', en: 'MY' },
    title:    { zh: '观看清单', en: 'Watchlist' },
    saved:    { zh: '部已保存', en: 'titles saved' },
    empty:    { zh: '清单是空的', en: 'Your watchlist is empty' },
    emptyMsg: { zh: '点击任意电影、剧集或动漫的书签图标即可添加', en: 'Click the bookmark icon on any movie, show, or anime to save it here' },
    browse:   { zh: '浏览内容', en: 'Browse Content' },
    movies:   { zh: '电影', en: 'Movies' },
    tv:       { zh: '剧集', en: 'TV Shows' },
    anime:    { zh: '动漫', en: 'Anime' },
  },
  // Detail page
  detail: {
    back:      { zh: '← 返回', en: '← Back' },
    watchNow:  { zh: '立即观看', en: 'Watch Now' },
    trailer:   { zh: '预告片', en: 'Trailer' },
    cast:      { zh: '演员表', en: 'Top Cast' },
    castLabel: { zh: '主演', en: 'CAST' },
    similar:   { zh: '相关推荐', en: 'More Like This' },
    similarMovies: { zh: '类似电影', en: 'Similar Movies' },
    similarShows:  { zh: '类似剧集', en: 'Similar Shows' },
    recs:      { zh: '相关推荐', en: 'Recommendations' },
    recsLabel: { zh: '你可能喜欢', en: 'YOU MIGHT LIKE' },
    seasons:   { zh: '季', en: 'seasons' },
    studio:    { zh: '制作公司', en: 'Studio' },
    episodes:  { zh: '集', en: 'ep' },
  },
  // Watch page
  watch: {
    back:    { zh: '返回', en: 'Back' },
    alt:     { zh: '备用源：', en: 'Alternative:' },
    hint:    { zh: '如果播放器无法加载，请尝试上方备用源', en: "If player doesn't load, try the alternative source above" },
  },
  // Search
  search: {
    results:  { zh: '搜索结果', en: 'SEARCH RESULTS' },
    movies:   { zh: '电影', en: 'MOVIES' },
    anime:    { zh: '动漫', en: 'ANIME' },
    noResult: { zh: '没有找到相关内容', en: 'No results found for' },
    backHome: { zh: '← 返回首页', en: '← Back to Home' },
  },
}

export function tr(key: { zh: string; en: string }, lang: Lang): string {
  return key[lang]
}
