import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const prevPath = useRef(pathname)

  // Runs synchronously before the browser paints — eliminates the scroll-position flash
  useLayoutEffect(() => {
    if (pathname !== '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname])

  // Async home scroll restoration (needs rendered content to know where to scroll)
  useEffect(() => {
    const prev = prevPath.current
    prevPath.current = pathname

    // Capture home scroll position the moment we navigate away
    if (prev === '/' && pathname !== '/') {
      sessionStorage.setItem('homeScrollY', String(window.scrollY))
    }

    if (pathname !== '/') return

    const scrollToId = sessionStorage.getItem('scrollToId')
    if (scrollToId) {
      sessionStorage.removeItem('scrollToId')
      requestAnimationFrame(() => requestAnimationFrame(() => {
        document.getElementById(scrollToId)?.scrollIntoView({ behavior: 'smooth' })
      }))
      return
    }

    const saved = parseInt(sessionStorage.getItem('homeScrollY') || '0', 10)
    if (saved > 0) {
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, saved)))
    }
  }, [pathname])

  return null
}
