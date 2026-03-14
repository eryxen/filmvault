import { createContext, useContext, useState, ReactNode } from 'react'
import { Lang } from '../i18n/translations'

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
}

const LangContext = createContext<LangContextType | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('filmvault_lang') as Lang) || 'zh'
  })

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('filmvault_lang', l)
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
