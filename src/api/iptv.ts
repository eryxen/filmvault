// IPTV source from zbefine/iptv (1972★)
// Parses M3U8 playlist into channel groups

export interface Channel {
  name: string
  group: string
  url: string
}

export interface ChannelGroup {
  name: string
  channels: Channel[]
}

const IPTV_URL = 'https://raw.githubusercontent.com/zbefine/iptv/main/iptv.m3u'

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
  const res = await fetch(IPTV_URL)
  const text = await res.text()
  const lines = text.split('\n')

  const channels: Channel[] = []
  let currentGroup = ''
  let currentName = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('#EXTINF')) {
      const groupMatch = line.match(/group-title="([^"]*)"/)
      const nameMatch = line.match(/,(.+)$/)
      currentGroup = groupMatch?.[1] || '其他'
      currentName = nameMatch?.[1] || ''
    } else if (line.startsWith('http') && currentName) {
      channels.push({ name: currentName, group: currentGroup, url: line })
      currentName = ''
    }
  }

  const deduplicated = dedup(channels)

  // Group them
  const groupMap: Record<string, Channel[]> = {}
  for (const ch of deduplicated) {
    if (!groupMap[ch.group]) groupMap[ch.group] = []
    groupMap[ch.group].push(ch)
  }

  // Custom sort order: 央视 first, then by size
  const priority = ['央视', 'NewTV', '北京', '上海', '广东', '浙江', '江苏', '湖南', '湖北']
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
