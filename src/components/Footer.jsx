import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import './Footer.css'

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  )
}

export default function Footer() {
  const { lang } = useLang()
  const isEs = lang === 'es'

  return (
    <footer className="footer">
      <div className="container footer__grid">

        {/* Col 1: Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo-link">
            <img src="/logo-goodtravels.png" alt="Good Travels" className="footer__logo-img" />
          </Link>
          <p className="footer__tagline">
            {isEs ? 'Circuitos únicos desde Barcelona' : 'Circuits únics des de Barcelona'}
          </p>
          <p className="footer__address">Rubí, Barcelona</p>
          <div className="footer__social">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <IconInstagram />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <IconFacebook />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="footer__nav">
          <h4>{isEs ? 'Navegación' : 'Navegació'}</h4>
          <ul>
            <li><Link to="/categoria/eslovenia-croacia">{isEs ? 'Eslovenia y Croacia' : 'Eslovènia i Croàcia'}</Link></li>
            <li><Link to="/categoria/islandia">{isEs ? 'Islandia' : 'Islàndia'}</Link></li>
            <li><Link to="/categoria/noruega">{isEs ? 'Noruega' : 'Noruega'}</Link></li>
            <li><Link to="/categoria/nadal">{isEs ? 'Mercados de Navidad' : 'Mercats de Nadal'}</Link></li>
            <li><a href="/#about">{isEs ? 'Nosotros' : 'Nosaltres'}</a></li>
            <li><Link to="/contacte">{isEs ? 'Contacto' : 'Contacte'}</Link></li>
          </ul>
        </div>

        {/* Col 3: Contact */}
        <div className="footer__contact">
          <h4>{isEs ? 'Contacto' : 'Contacte'}</h4>
          <ul>
            <li><a href="tel:935872079">935 87 20 79</a></li>
            <li><a href="mailto:info@747viatges.com">info@747viatges.com</a></li>
            <li><span>C/ Llobateras, 49</span></li>
            <li><span>08191 Rubí, Barcelona</span></li>
          </ul>
          <Link to="/contacte" className="footer__cta-btn">
            {isEs ? 'Habla con un experto' : 'Parla amb un expert'}
          </Link>
        </div>

      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} Good Travels · Rubí, Barcelona</p>
          <Link to="/avis-legal">{isEs ? 'Aviso legal' : 'Avís legal'}</Link>
        </div>
      </div>
    </footer>
  )
}
