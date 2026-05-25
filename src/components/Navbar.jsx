import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="logo-text">747 Viatges</span>
        </Link>

        <nav className={`navbar__menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/#destinations" onClick={() => setMenuOpen(false)}>Destinacions</Link>
          <Link to="/#services"     onClick={() => setMenuOpen(false)}>Serveis</Link>
          <Link to="/#testimonials" onClick={() => setMenuOpen(false)}>Nosaltres</Link>
          <Link to="/contacte" className="btn btn--outline" onClick={() => setMenuOpen(false)}>Contacte</Link>
        </nav>

        <button
          className="navbar__toggle"
          aria-label="Menú"
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
