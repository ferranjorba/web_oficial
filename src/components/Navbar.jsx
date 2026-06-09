import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SUBCATS } from '../data/destinations'
import './Navbar.css'

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [dropOpen,     setDropOpen]     = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const location = useLocation()
  const navigate  = useNavigate()

  const closeAll = () => { setMenuOpen(false); setDropOpen(false) }
  const goHome   = () => { closeAll(); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const goToAbout = (e) => {
    e.preventDefault()
    closeAll()
    if (location.pathname === '/') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      sessionStorage.setItem('scrollToId', 'about')
      navigate('/')
    }
  }

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container navbar__inner">

        <Link to="/" className="navbar__logo" onClick={goHome}>
          <img src="/logo-goodtravels.png" alt="Good Travels" />
        </Link>

        <nav className={`navbar__menu${menuOpen ? ' open' : ''}`}>

          <div className="nav-dropdown" ref={dropRef}>
            <button
              className={`nav-dropdown__trigger${dropOpen ? ' active' : ''}`}
              onClick={() => setDropOpen(o => !o)}
              aria-expanded={dropOpen}
            >
              Destinacions
              <svg className="nav-dropdown__chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className={`nav-dropdown__panel${dropOpen ? ' open' : ''}`}>
              <Link
                to="/#categories"
                className="nav-drop-item nav-drop-item--all"
                onClick={closeAll}
              >
                Totes les destinacions
              </Link>
              <div className="nav-drop-divider" />
              {Object.entries(SUBCATS).map(([key, cat]) => (
                <Link
                  key={key}
                  to={`/categoria/${key}`}
                  className="nav-drop-item"
                  onClick={closeAll}
                >
                  <span className="nav-drop-item__name">{cat.shortLabel}</span>
                  <span className="nav-drop-item__count">{cat.ids.length}</span>
                </Link>
              ))}
            </div>
          </div>

          <Link to="/#services" onClick={closeAll}>Inici</Link>
          <a href="#about" onClick={goToAbout}>Nosaltres</a>
          <Link to="/contacte" className="btn btn--outline navbar__cta" onClick={closeAll}>
            Contacte
          </Link>
        </nav>

        <button
          className={`navbar__toggle${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Tancar menú' : 'Obrir menú'}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>

      </div>
    </header>
  )
}
