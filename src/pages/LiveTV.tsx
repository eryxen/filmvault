import { useEffect, useState, useRef } from 'react'
import Hls from 'hls.js'
import { fetchChannels, ChannelGroup, Channel } from '../api/iptv'
import { useLang } from '../context/LangContext'
import { tr } from '../i18n/translations'

export default function LiveTV() {
  const { lang } = useLang()
  const T = (key: { zh: string; en: string }) => tr(key, lang)

  const [groups, setGroups] = useState<ChannelGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [error, setError] = useState<string>('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    fetchChannels()
      .then(g => {
        setGroups(g)
        if (g.length > 0) setSelectedGroup(g[0].name)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Play channel
  useEffect(() => {
    if (!selectedChannel || !videoRef.current) return
    setError('')

    const video = videoRef.current
    const url = selectedChannel.url

    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 10,
        maxMaxBufferLength: 30,
        liveSyncDurationCount: 3,
      })
      hlsRef.current = hls
      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError(lang === 'zh' ? '该频道暂时无法播放，请换一个试试' : 'Channel unavailable, try another')
          hls.destroy()
        }
      })
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {})
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url
      video.play().catch(() => {})
    } else {
      setError(lang === 'zh' ? '浏览器不支持直播播放' : 'Browser does not support live streaming')
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [selectedChannel])

  const currentChannels = groups.find(g => g.name === selectedGroup)?.channels || []

  // Group name translations for common ones
  const groupNames: Record<string, string> = {
    '央视': lang === 'zh' ? '央视' : 'CCTV',
    'NewTV': 'NewTV',
    '北京': lang === 'zh' ? '北京' : 'Beijing',
    '上海': lang === 'zh' ? '上海' : 'Shanghai',
    '广东': lang === 'zh' ? '广东' : 'Guangdong',
    '网络': lang === 'zh' ? '网络' : 'Online',
    '教育': lang === 'zh' ? '教育' : 'Education',
    '景区': lang === 'zh' ? '景区' : 'Scenic',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-10">
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg, #0a1117 0%, #0a0a0f 100%)' }} className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="section-label text-red-400 mb-2">{T({ zh: '直播', en: 'LIVE' })}</p>
          <h1 className="text-4xl font-black text-white mb-2">{T({ zh: '电视直播', en: 'Live TV' })}</h1>
          <p className="text-gray-500 text-sm">
            {T({ zh: `${groups.reduce((s, g) => s + g.channels.length, 0)} 个频道 · 来自 iptv-org`, en: `${groups.reduce((s, g) => s + g.channels.length, 0)} channels · from iptv-org` })}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Player */}
            <div className="flex-1">
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/5">
                {selectedChannel ? (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full"
                      controls
                      autoPlay
                      playsInline
                    />
                    {error && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
                        <span className="text-4xl mb-3">📡</span>
                        <p className="text-gray-400 text-sm">{error}</p>
                      </div>
                    )}
                    {/* Channel name overlay */}
                    <div className="absolute top-3 left-3 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LIVE · {selectedChannel.name}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <span className="text-5xl mb-4">📺</span>
                    <p className="text-gray-400">{T({ zh: '选择一个频道开始观看', en: 'Select a channel to start watching' })}</p>
                  </div>
                )}
              </div>

              {/* Current channel info */}
              {selectedChannel && (
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-red-400 text-xs font-bold uppercase tracking-widest">🔴 LIVE</span>
                  <span className="text-white font-bold text-lg">{selectedChannel.name}</span>
                  <span className="text-gray-600 text-sm">{selectedChannel.group}</span>
                </div>
              )}
            </div>

            {/* Channel list sidebar */}
            <div className="w-full lg:w-72 flex-shrink-0">
              {/* Group tabs */}
              <div className="flex gap-1.5 flex-wrap mb-4">
                {groups.map(g => (
                  <button key={g.name} onClick={() => setSelectedGroup(g.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedGroup === g.name
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}>
                    {groupNames[g.name] || g.name}
                    <span className="ml-1 text-gray-600">{g.channels.length}</span>
                  </button>
                ))}
              </div>

              {/* Channel list */}
              <div className="bg-white/3 rounded-2xl border border-white/5 max-h-[60vh] overflow-y-auto">
                {currentChannels.map((ch, i) => (
                  <button key={`${ch.name}-${i}`}
                    onClick={() => setSelectedChannel(ch)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all border-b border-white/3 last:border-0 ${
                      selectedChannel?.url === ch.url
                        ? 'bg-red-500/10 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedChannel?.url === ch.url ? 'bg-red-500 animate-pulse' : 'bg-gray-700'}`} />
                    <span className="text-sm font-medium truncate">{ch.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
