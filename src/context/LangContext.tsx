import { createContext, useContext, useState, ReactNode } from 'react'
import { Lang } from '../i18n/translations'

const STORAGE_KEY = 'yuny_lang' // new key to avoid stale 'en' from old key

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
}

const LangContext = createContext<LangContextType | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    // Default: Chinese
    return (localStorage.getItem(STORAGE_KEY) as Lang) || 'zh'
  })

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }

  const toggle = () => setLang(lang === 'zh' ? 'en' : 'zh')

  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
