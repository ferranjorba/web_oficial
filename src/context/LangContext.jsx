import { createContext, useContext, useState } from 'react'
import ca from '../i18n/ca'
import es from '../i18n/es'

const translations = { ca, es }
const LangCtx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem('lang') || 'es'
  )

  const changeLang = (l) => {
    setLang(l)
    localStorage.setItem('lang', l)
  }

  // Dotted key lookup: t('home.hero.title') → translations[lang].home.hero.title
  // Also supports {n} interpolation: t('home.featured.allLink', { n: 5 })
  const t = (key, vars) => {
    const parts = key.split('.')
    let val = translations[lang]
    for (const p of parts) val = val?.[p]
    if (val == null) return key
    if (vars && typeof val === 'string') {
      return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, v), val)
    }
    return val
  }

  return (
    <LangCtx.Provider value={{ lang, changeLang, t }}>
      {children}
    </LangCtx.Provider>
  )
}

export const useLang = () => useContext(LangCtx)
