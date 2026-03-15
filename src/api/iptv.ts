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

// Full international index — 12K+ channels
const IPTV_SOURCES = [
  'https://iptv-org.github.io/iptv/index.m3u',
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

export async function fetchChannels(): Promise<ChannelGroup[]> {
  let text = ''
  for (const url of IPTV_SOURCES) {
    try {
      const res = await fetch(url)
      if (res.ok) {
        text = await res.text()
        break
      }
    } catch {
      continue
    }
  }

  if (!text) return []

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

  const deduplicated = dedup(channels)

  // Group them
  const groupMap: Record<string, Channel[]> = {}
  for (const ch of deduplicated) {
    if (!groupMap[ch.group]) groupMap[ch.group] = []
    groupMap[ch.group].push(ch)
  }

  // Sort: larger groups first, with some priority categories
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
