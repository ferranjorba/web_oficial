import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { destinations } from '../data/destinations'
import './Home.css'

const FILTERS = ['all', 'europa']
const FILTER_LABELS = { all: 'Totes', europa: 'Europa' }

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchWhere, setSearchWhere]   = useState('')
  const navigate = useNavigate()

  const filtered = destinations.filter(d => activeFilter === 'all' || d.category === activeFilter)

  // Fade-in on scroll
  const observerRef = useRef(null)
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observerRef.current.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('.fade-in').forEach(el => observerRef.current.observe(el))
    return () => observerRef.current?.disconnect()
  }, [filtered])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/cerca?q=${searchWhere}`)
  }

  return (
    <main>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero__bg">
          <div className="hero__overlay" />
          <div className="hero__placeholder-img" />
        </div>
        <div className="container hero__content">
          <p className="hero__tag">Descobreix el món amb nosaltres</p>
          <h1 className="hero__title">Cada viatge,<br />una vida nova</h1>
          <p className="hero__subtitle">Dissenyem experiències de viatge a mida, úniques i inoblidables per a tu.</p>
          <div className="hero__actions">
            <a href="#destinations" className="btn btn--primary">Veure destinacions</a>
            <Link to="/contacte" className="btn btn--ghost">Parla amb un expert</Link>
          </div>
          <form className="hero__search" onSubmit={handleSearch}>
            <div className="search-field">
              <label>On vols anar?</label>
              <input
                type="text"
                placeholder="Destinació, país..."
                value={searchWhere}
                onChange={e => setSearchWhere(e.target.value)}
              />
            </div>
            <div className="search-field">
              <label>Quan?</label>
              <input type="text" placeholder="Dates del viatge" />
            </div>
            <div className="search-field">
              <label>Viatgers</label>
              <input type="text" placeholder="1 adult" />
            </div>
            <button type="submit" className="btn btn--primary search-btn">Buscar</button>
          </form>
        </div>
        <div className="hero__scroll">
          <span>Desplaça't</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="container stats__grid">
          {[
            { n: '2 pax',   l: 'Sortida garantida' },
            { n: 'Màx. 25', l: 'Passatgers per grup' },
            { n: 'Directe', l: 'Vol BCN → Ljubljana divendres' },
          ].map(({ n, l }) => (
            <div key={l} className="stat-item fade-in">
              <span className="stat-number">{n}</span>
              <span className="stat-label">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* DESTINACIONS */}
      <section className="destinations" id="destinations">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Les més sol·licitades</p>
            <h2 className="section-title">Destinacions que enamoren</h2>
            <p className="section-subtitle">Selecció dels llocs més increïbles del món, curats pel nostre equip d'experts.</p>
          </div>

          <div className="destinations__filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>

          <div className="destinations__grid">
            {filtered.map(dest => (
              <article
                key={dest.id}
                className={`dest-card fade-in ${dest.featured ? 'dest-card--featured' : ''}`}
              >
                <div className="dest-card__img dest-card__img--placeholder" />
                {dest.featured && <div className="dest-card__badge">Més popular</div>}
                <div className="dest-card__info">
                  <div className="dest-card__meta">
                    <span className="dest-card__country">{dest.country}</span>
                    {dest.rating && <span className="dest-card__rating">★ {dest.rating}</span>}
                  </div>
                  <h3 className="dest-card__name">{dest.name}</h3>
                  <p className="dest-card__desc">{dest.description}</p>
                  <div className="dest-card__footer">
                    {dest.price
                      ? <span className="dest-card__price">Des de <strong>{dest.price.toLocaleString('ca')}€</strong></span>
                      : <span className="dest-card__price dest-card__price--consult">Preu a consultar</span>
                    }
                    <Link to={`/viatge/${dest.id}`} className="btn btn--sm btn--primary">Descobrir</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="section-cta">
            <Link to="/cerca" className="btn btn--primary btn--lg">Veure totes les destinacions</Link>
          </div>
        </div>
      </section>

      {/* PER QUÈ 747 VIATGES */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Per què triar-nos</p>
            <h2 className="section-title">El que ens fa diferents</h2>
          </div>
          <div className="services__grid">
            {[
              { icon: '', title: 'Sortida garantida',      desc: 'Els nostres circuits surten garantits amb un mínim de 2 passatgers. Sense cancel·lacions per falta de grup.' },
              { icon: '', title: 'Vol directe BCN–Ljubljana', desc: 'Vol directe exclusiu des de Barcelona a Ljubljana amb Trade Air tots els divendres de juny a setembre.' },
              { icon: '', title: 'Hotels cèntrics',        desc: 'Allotjaments cèntrics o semi-cèntrics perquè aprofitis al màxim cada destinació.' },
              { icon: '', title: 'Grups tancats',          desc: 'Màxim 25 passatgers per circuit. Comoditat, atenció personalitzada i grup reduït.' },
            ].map(s => (
              <div key={s.title} className="service-card fade-in">
                <span className="service-card__icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOSALTRES */}
      <section className="about" id="about">
        <div className="container about__grid">
          <div className="about__visual fade-in">
            <div className="about__img-main about__img--placeholder" />
            <div className="about__img-secondary about__img--placeholder" />
          </div>
          <div className="about__content fade-in">
            <p className="section-tag">Qui som</p>
            <h2 className="section-title">747 Viatges S.L.</h2>
            <p>Descripció pendent a preguntar</p>
            <p>C/ Llobateras, 49 · 08191 Rubí, Barcelona<br />Tel. 935 87 20 79</p>
            <Link to="/contacte" className="btn btn--primary" style={{ marginTop: '8px' }}>Contacta amb nosaltres</Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterSection />

    </main>
  )
}

function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [sent, setSent]   = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <section className="newsletter">
      <div className="container newsletter__inner">
        <h2>Inspira't cada setmana</h2>
        <p>Subscriu-te i rep ofertes exclusives, idees de viatge i destinacions amagades directament al teu correu.</p>
        <form className="newsletter__form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={sent ? 'Subscrit! Gràcies ✓' : 'El teu correu electrònic'}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn--primary">Subscriure'm</button>
        </form>
        <p className="newsletter__disclaimer">Sense spam. Cancel·la quan vulguis.</p>
      </div>
    </section>
  )
}
