import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="navbar__logo">
            <span className="logo-text">747 Viatges</span>
          </Link>
          <p>Agència de viatges especialitzada en circuits guiats per Eslovènia, Croàcia i Islàndia des de Barcelona.</p>
        </div>

        <div className="footer__links">
          <h4>Circuits</h4>
          <ul>
            <li><Link to="/viatge/joies-islandia">Joies d'Islàndia</Link></li>
            <li><Link to="/viatge/gran-tour-odin">Gran Tour d'Odín</Link></li>
            <li><Link to="/categoria/europa">Tots els circuits</Link></li>
          </ul>
        </div>

        <div className="footer__links">
          <h4>Contacte</h4>
          <ul>
            <li><a href="tel:935872079">935 87 20 79</a></li>
            <li><span>C/ Llobateras, 49</span></li>
            <li><span>08191 Rubí, Barcelona</span></li>
          </ul>
        </div>

        <div className="footer__links">
          <h4>Legal</h4>
          <ul>
            <li><a href="/#about">Qui som</a></li>
            <li><Link to="/avis-legal">Avís legal</Link></li>
            <li><Link to="/contacte">Contacte</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} 747 Viatges S.L. Tots els drets reservats.</p>
          <p>C/ Llobateras, 49 · 08191 Rubí (Barcelona) · 935 87 20 79</p>
        </div>
      </div>
    </footer>
  )
}
