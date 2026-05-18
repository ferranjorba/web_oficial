import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="navbar__logo">
            <span className="logo-text">NomAgència</span>
          </Link>
          <p>Creant experiències de viatge úniques des del 2009. El món és gran, t'ajudem a descobrir-lo.</p>
          <div className="footer__social">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="TikTok">TK</a>
            <a href="#" aria-label="YouTube">YT</a>
          </div>
        </div>

        <div className="footer__links">
          <h4>Destinacions</h4>
          <ul>
            <li><Link to="/categoria/europa">Europa</Link></li>
            <li><Link to="/categoria/asia">Àsia</Link></li>
            <li><Link to="/categoria/america">Amèrica</Link></li>
            <li><Link to="/categoria/africa">Àfrica</Link></li>
            <li><Link to="/categoria/oceania">Oceania</Link></li>
          </ul>
        </div>

        <div className="footer__links">
          <h4>Serveis</h4>
          <ul>
            <li><a href="#">Viatges a mida</a></li>
            <li><a href="#">Llunes de mel</a></li>
            <li><a href="#">Grups</a></li>
            <li><a href="#">Viatges empresa</a></li>
            <li><a href="#">Assegurances</a></li>
          </ul>
        </div>

        <div className="footer__links">
          <h4>Empresa</h4>
          <ul>
            <li><a href="/#about">Qui som</a></li>
            <li><a href="#">Blog de viatges</a></li>
            <li><a href="#">Treballa amb nosaltres</a></li>
            <li><Link to="/avis-legal">Avís legal</Link></li>
            <li><a href="#">Política de privacitat</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} NomAgència. Tots els drets reservats.</p>
          <p>LICENCIA TURISMO: XXXXX</p>
        </div>
      </div>
    </footer>
  )
}
