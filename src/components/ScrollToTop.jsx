import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const prevPath = useRef(pathname)

  useEffect(() => {
    const prev = prevPath.current
    prevPath.current = pathname

    if (prev === '/') {
      sessionStorage.setItem('homeScrollY', window.scrollY)
    }

    if (pathname === '/') {
      const scrollToId = sessionStorage.getItem('scrollToId')
      if (scrollToId) {
        sessionStorage.removeItem('scrollToId')
        requestAnimationFrame(() => requestAnimationFrame(() => {
          document.getElementById(scrollToId)?.scrollIntoView({ behavior: 'smooth' })
        }))
        return
      }
      const saved = parseInt(sessionStorage.getItem('homeScrollY') || '0', 10)
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, saved)))
      return
    }

    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    document.documentElement.style.scrollBehavior = ''
  }, [pathname])

  return null
}
