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
    trendingMovies:      { zh: '热门电影', en: 'Trending Movies' },
    trendingMoviesLabel: { zh: '本周', en: 'THIS WEEK' },
    trendingTv:          { zh: '热门剧集', en: 'Trending TV Shows' },
    trendingTvLabel:     { zh: '当前流行', en: 'POPULAR NOW' },
    seasonal:            { zh: '本季新番', en: 'Seasonal Anime' },
    seasonalLabel:       { zh: '连载中', en: 'AIRING NOW' },
    topAnime:            { zh: '顶级动漫', en: 'Top Rated Anime' },
    topAnimeLabel:       { zh: '历史最佳', en: 'ALL TIME' },
    viewAll:             { zh: '查看全部 →', en: 'View All →' },
  },
  // Cards
  card: {
    movie:      { zh: '电影', en: 'MOVIE' },
    tvShow:     { zh: '剧集', en: 'TV SHOW' },
    anime:      { zh: '动漫', en: 'ANIME' },
    watchNow:   { zh: '立即观看', en: 'Watch Now' },
    addList:    { zh: '加入清单', en: 'Add to Watchlist' },
    removeList: { zh: '移出清单', en: 'Remove from Watchlist' },
  },
  // Browse pages (Movies / TV / Anime)
  browse: {
    browse:       { zh: '浏览', en: 'BROWSE' },
    movies:       { zh: '电影', en: 'Movies' },
    tv:           { zh: '剧集', en: 'TV Shows' },
    anime:        { zh: '动漫', en: 'Anime' },
    searchMovies: { zh: '搜索电影...', en: 'Search movies...' },
    searchTv:     { zh: '搜索剧集...', en: 'Search TV shows...' },
    searchAnime:  { zh: '搜索动漫...', en: 'Search anime...' },
    popular:      { zh: '热门', en: 'Popular' },
    topRated:     { zh: '高分', en: 'Top Rated' },
    seasonal:     { zh: '本季新番', en: 'Seasonal' },
    allGenres:    { zh: '全部类型', en: 'All Genres' },
    loadMore:     { zh: '加载更多', en: 'Load More' },
    noResult:     { zh: '没有找到结果', en: 'No results found' },
  },
  // Movie genres
  genres: {
    Action:      { zh: '动作', en: 'Action' },
    Adventure:   { zh: '冒险', en: 'Adventure' },
    Animation:   { zh: '动画', en: 'Animation' },
    Comedy:      { zh: '喜剧', en: 'Comedy' },
    Crime:       { zh: '犯罪', en: 'Crime' },
    Documentary: { zh: '纪录片', en: 'Documentary' },
    Drama:       { zh: '剧情', en: 'Drama' },
    Family:      { zh: '家庭', en: 'Family' },
    Fantasy:     { zh: '奇幻', en: 'Fantasy' },
    History:     { zh: '历史', en: 'History' },
    Horror:      { zh: '恐怖', en: 'Horror' },
    Music:       { zh: '音乐', en: 'Music' },
    Mystery:     { zh: '悬疑', en: 'Mystery' },
    Romance:     { zh: '爱情', en: 'Romance' },
    'Science Fiction': { zh: '科幻', en: 'Science Fiction' },
    'TV Movie':  { zh: '电视电影', en: 'TV Movie' },
    Thriller:    { zh: '惊悚', en: 'Thriller' },
    War:         { zh: '战争', en: 'War' },
    Western:     { zh: '西部', en: 'Western' },
    'Sci-Fi & Fantasy': { zh: '科幻奇幻', en: 'Sci-Fi & Fantasy' },
    'Action & Adventure': { zh: '动作冒险', en: 'Action & Adventure' },
    'Kids':      { zh: '儿童', en: 'Kids' },
    'News':      { zh: '新闻', en: 'News' },
    'Reality':   { zh: '真人秀', en: 'Reality' },
    'Soap':      { zh: '肥皂剧', en: 'Soap' },
    'Talk':      { zh: '脱口秀', en: 'Talk' },
    'War & Politics': { zh: '战争政治', en: 'War & Politics' },
  } as Record<string, { zh: string; en: string }>,
  // Anime genres
  animeGenres: {
    Action:      { zh: '动作', en: 'Action' },
    Adventure:   { zh: '冒险', en: 'Adventure' },
    Comedy:      { zh: '搞笑', en: 'Comedy' },
    Drama:       { zh: '剧情', en: 'Drama' },
    Fantasy:     { zh: '奇幻', en: 'Fantasy' },
    Horror:      { zh: '恐怖', en: 'Horror' },
    Mystery:     { zh: '悬疑', en: 'Mystery' },
    Romance:     { zh: '恋爱', en: 'Romance' },
    'Sci-Fi':    { zh: '科幻', en: 'Sci-Fi' },
    'Slice of Life': { zh: '日常', en: 'Slice of Life' },
    Supernatural: { zh: '超自然', en: 'Supernatural' },
    Sports:      { zh: '运动', en: 'Sports' },
  } as Record<string, { zh: string; en: string }>,
  // Watchlist page
  watchlistPage: {
    label:    { zh: '我的', en: 'MY' },
    title:    { zh: '观看清单', en: 'Watchlist' },
    saved:    { zh: '部已保存', en: 'titles saved' },
    empty:    { zh: '清单是空的', en: 'Your watchlist is empty' },
    emptyMsg: { zh: '点击任意影视的书签图标即可添加', en: 'Click the bookmark icon on any title to save it here' },
    browse:   { zh: '浏览内容', en: 'Browse Content' },
    movies:   { zh: '电影', en: 'Movies' },
    tv:       { zh: '剧集', en: 'TV Shows' },
    anime:    { zh: '动漫', en: 'Anime' },
  },
  // Detail pages
  detail: {
    movie:     { zh: '电影', en: 'MOVIE' },
    tvShow:    { zh: '剧集', en: 'TV SHOW' },
    anime:     { zh: '动漫', en: 'ANIME' },
    back:      { zh: '← 返回', en: '← Back' },
    watchNow:  { zh: '立即观看', en: 'Watch Now' },
    trailer:   { zh: '▶ 预告片', en: '▶ Trailer' },
    cast:      { zh: '演员表', en: 'Top Cast' },
    castLabel: { zh: '主演', en: 'CAST' },
    moreLike:  { zh: '相关推荐', en: 'MORE LIKE THIS' },
    similar:   { zh: '类似内容', en: 'Similar Titles' },
    recs:      { zh: '相关推荐', en: 'Recommendations' },
    recsLabel: { zh: '你可能喜欢', en: 'YOU MIGHT LIKE' },
    seasons:   { zh: '季', en: 'seasons' },
    episodes:  { zh: '集', en: 'episodes' },
    studio:    { zh: '制作公司', en: 'Studio' },
    status:    { zh: '状态', en: 'Status' },
    year:      { zh: '年份', en: 'Year' },
    rating:    { zh: '评分', en: 'Rating' },
    runtime:   { zh: '时长', en: 'Runtime' },
  },
  // Player
  player: {
    loading:     { zh: '加载中...', en: 'Loading...' },
    source:      { zh: '线路', en: 'Source' },
    close:       { zh: '关闭', en: 'Close' },
    episodes:    { zh: '选集', en: 'EPISODES' },
    season:      { zh: '季', en: 'Season' },
    ep:          { zh: '第', en: 'Ep' },
    epSuffix:    { zh: '集', en: '' },
    blocked:     { zh: '弹窗广告已屏蔽', en: 'Popup ads blocked' },
    currentSrc:  { zh: '当前线路：', en: 'Source: ' },
    external:    { zh: '外部播放 ↗', en: 'Open externally ↗' },
    failTitle:   { zh: '无法播放', en: 'Failed to load' },
    failMsg:     { zh: '该线路暂无此片源，请换一条线路', en: 'This source may not have this title. Try another.' },
    tryNext:     { zh: '切换到', en: 'Try' },
    allTried:    { zh: '已尝试所有线路', en: 'All sources tried' },
    animeNote:   { zh: 'anime1.me 不支持内嵌，请点击外部打开', en: 'anime1.me cannot be embedded, use external link' },
  },
  // Search
  search: {
    results:   { zh: '搜索结果', en: 'SEARCH RESULTS' },
    for:       { zh: '关键词：', en: 'Results for:' },
    movies:    { zh: '电影', en: 'MOVIES' },
    anime:     { zh: '动漫', en: 'ANIME' },
    noResult:  { zh: '没有找到相关内容：', en: 'No results found for' },
    backHome:  { zh: '← 返回首页', en: '← Back to Home' },
  },
}

export function tr(key: { zh: string; en: string }, lang: Lang): string {
  return key[lang]
}

// Helper: translate genre name
export function trGenre(name: string, lang: Lang): string {
  const g = t.genres[name]
  return g ? g[lang] : name
}
