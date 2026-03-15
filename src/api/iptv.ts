// IPTV source from iptv-org/iptv (80K+ ★)
// Curated, internationally accessible streams
// https://github.com/iptv-org/iptv

export interface Channel {
  name: string
  group: string
  url: string
  logo?: string
}

export interface ChannelGroup {
  name: string
  channels: Channel[]
}

export type IPTVRegion = 'chinese' | 'english' | 'malay' | 'entertainment' | 'movies' | 'sports' | 'news' | 'kids'

export const IPTV_REGIONS: { key: IPTVRegion; label: { zh: string; en: string }; url: string }[] = [
  { key: 'chinese',       label: { zh: '中文频道',   en: 'Chinese' },       url: 'https://iptv-org.github.io/iptv/languages/zho.m3u' },
  { key: 'english',       label: { zh: '英文频道',   en: 'English' },       url: 'https://iptv-org.github.io/iptv/languages/eng.m3u' },
  { key: 'malay',         label: { zh: '马来频道',   en: 'Malay' },         url: 'https://iptv-org.github.io/iptv/languages/msa.m3u' },
  { key: 'entertainment', label: { zh: '综艺娱乐',   en: 'Entertainment' }, url: 'https://iptv-org.github.io/iptv/categories/entertainment.m3u' },
  { key: 'movies',        label: { zh: '电影频道',   en: 'Movies' },        url: 'https://iptv-org.github.io/iptv/categories/movies.m3u' },
  { key: 'sports',        label: { zh: '体育频道',   en: 'Sports' },        url: 'https://iptv-org.github.io/iptv/categories/sports.m3u' },
  { key: 'news',          label: { zh: '新闻频道',   en: 'News' },          url: 'https://iptv-org.github.io/iptv/categories/news.m3u' },
  { key: 'kids',          label: { zh: '少儿频道',   en: 'Kids' },          url: 'https://iptv-org.github.io/iptv/categories/kids.m3u' },
]

// Deduplicate: keep first URL per channel name per group
function dedup(channels: Channel[]): Channel[] {
  const seen = new Set<string>()
  return channels.filter(ch => {
    const key = `${ch.group}:${ch.name}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function parseM3U(text: string): Channel[] {
  const lines = text.split('\n')
  const channels: Channel[] = []
  let currentGroup = ''
  let currentName = ''
  let currentLogo = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('#EXTINF')) {
      const groupMatch = line.match(/group-title="([^"]*)"/)
      const logoMatch = line.match(/tvg-logo="([^"]*)"/)
      const nameMatch = line.match(/,(.+)$/)
      currentGroup = groupMatch?.[1] || 'Other'
      currentName = nameMatch?.[1]?.trim() || ''
      currentLogo = logoMatch?.[1] || ''
    } else if (line.startsWith('http') && currentName) {
      channels.push({ name: currentName, group: currentGroup, url: line, logo: currentLogo || undefined })
      currentName = ''
      currentLogo = ''
    }
  }

  return dedup(channels)
}

export async function fetchChannels(region: IPTVRegion = 'chinese'): Promise<ChannelGroup[]> {
  const source = IPTV_REGIONS.find(r => r.key === region) || IPTV_REGIONS[0]

  const res = await fetch(source.url)
  if (!res.ok) return []
  const text = await res.text()

  const channels = parseM3U(text)

  // Group them
  const groupMap: Record<string, Channel[]> = {}
  for (const ch of channels) {
    if (!groupMap[ch.group]) groupMap[ch.group] = []
    groupMap[ch.group].push(ch)
  }

  // Sort by group size
  const priority = ['General', 'News', 'Entertainment', 'Sports', 'Movies', 'Music', 'Kids', 'Documentary', 'Education', 'Animation']
  const groups: ChannelGroup[] = Object.entries(groupMap)
    .map(([name, channels]) => ({ name, channels }))
    .sort((a, b) => {
      const ai = priority.indexOf(a.name)
      const bi = priority.indexOf(b.name)
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
      return b.channels.length - a.channels.length
    })

  return groups
}
