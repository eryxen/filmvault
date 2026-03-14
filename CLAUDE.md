# FilmVault - 影视 + 动漫 App

## 项目目标
Premium dark-themed film & anime web app。设计参考健身 app 截图的风格：深色渐变、粗体标题、卡片布局、premium feel。

## Tech Stack
- React 18 + Vite
- TypeScript
- Tailwind CSS v3
- React Router v6

## 数据源
- TMDB API (movies/TV) — https://api.themoviedb.org/3
  - 测试 API Key: 先用 demo key 或 hardcode 一个测试 key
- Jikan API (Anime, 无需 key) — https://api.jikan.moe/v4
- 播放器 embed: vidbox.cc pattern `https://vidbox.cc/movie/{tmdb_id}` 或 `https://vidsrc.to/embed/movie/{tmdb_id}`

## 设计规范 (CRITICAL - 严格遵守)
- 背景: 极深色，每个 section 不同深色渐变
  - 主背景: #0a0a0f
  - Movies section: 深蓝渐变 (#0d1117 -> #111827)
  - Anime section: 深紫渐变 (#0f0d1a -> #1a0d2e)
  - Stats: 深青色渐变 (#0d1a1a -> #0d2626)
- 字体: 超粗 bold headline，section label 全大写 + accent 颜色 + letter-spacing
- 卡片: 圆角大(16px)，hover 有光晕效果，封面图占满
- Accent 颜色: 
  - Movies: #3b82f6 (蓝)
  - Anime: #a855f7 (紫)
  - Trending: #10b981 (绿)
- 没有白色背景，没有 flat design，一切要有 depth 和 premium 感

## 页面结构
1. **首页 (/)** — Hero banner + Trending Movies + Trending Anime + Stats section
2. **Movies (/movies)** — Grid browse，可搜索，按类型筛选
3. **Anime (/anime)** — Grid browse，可搜索，按类型筛选
4. **详情页 (/movie/:id 和 /anime/:id)** — 完整信息 + Cast + 推荐
5. **播放页 (/watch/movie/:id 和 /watch/anime/:id)** — 全屏播放器 embed

## Commands
- Dev: `npm run dev`
- Build: `npm run build`

## 注意
- 全程 dark theme，绝不出现浅色背景
- 响应式设计，移动端友好
- loading skeleton 用深色，不要白色
