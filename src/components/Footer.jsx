import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import './Footer.css'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="navbar__logo">
            <span className="logo-text">747 Viatges</span>
          </Link>
          <p>{t('footer.desc')}</p>
        </div>

        <div className="footer__links">
          <h4>{t('footer.circuits')}</h4>
          <ul>
            <li><Link to="/viatge/joies-islandia">Joies d'Islàndia</Link></li>
            <li><Link to="/viatge/gran-tour-odin">Gran Tour d'Odín</Link></li>
            <li><Link to="/categoria/europa">{t('footer.allCircuits')}</Link></li>
          </ul>
        </div>

        <div className="footer__links">
          <h4>{t('footer.contact')}</h4>
          <ul>
            <li><a href="tel:935872079">935 87 20 79</a></li>
            <li><span>C/ Llobateras, 49</span></li>
            <li><span>08191 Rubí, Barcelona</span></li>
          </ul>
        </div>

        <div className="footer__links">
          <h4>{t('footer.legal')}</h4>
          <ul>
            <li><a href="/#about">{t('footer.whoWeAre')}</a></li>
            <li><Link to="/avis-legal">{t('footer.legalNotice')}</Link></li>
            <li><Link to="/contacte">{t('footer.contact')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} 747 Viatges S.L. {t('footer.rights')}</p>
          <p>C/ Llobateras, 49 · 08191 Rubí (Barcelona) · 935 87 20 79</p>
        </div>
      </div>
    </footer>
  )
}
