// YYeTs (人人影视) API — from tgbot-collection/YYeTsBot (16K★)
// Public API at yyets.click

import axios from 'axios'

const BASE = 'https://yyets.click/api'

export interface YYeResource {
  id: number
  cnname: string
  enname: string
  channel: string   // tv / movie
  area: string      // 美国 / 日本 / etc
  category: string
  poster: string
  views: number
}

export interface YYeTopItem {
  data: { info: YYeResource }
}

export interface YYeTopResult {
  ALL: YYeTopItem[]
  US: YYeTopItem[]
  JP: YYeTopItem[]
  KR: YYeTopItem[]
  UK: YYeTopItem[]
}

export interface YYeSearchResult {
  data: Array<{
    data: { info: YYeResource }
    type?: string
  }>
}

export async function getYYeTop(): Promise<YYeTopResult> {
  const res = await axios.get(`${BASE}/top`)
  return res.data
}

export async function searchYYe(keyword: string): Promise<YYeResource[]> {
  const res = await axios.get(`${BASE}/resource`, {
    params: { keyword },
  })
  const data = res.data?.data || []
  return data
    .filter((d: { type?: string }) => d.type !== 'comment')
    .map((d: { data?: { info?: YYeResource }; info?: YYeResource }) => {
      const info = d.data?.info || d.info || d
      return info as YYeResource
    })
}

export async function getYYeResource(id: number): Promise<YYeResource | null> {
  try {
    const res = await axios.get(`${BASE}/resource`, { params: { id } })
    return res.data?.data?.info || null
  } catch {
    return null
  }
}
