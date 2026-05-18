import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { destinations } from '../data/destinations'
import './Home.css'

const FILTERS = ['all', 'europa', 'asia', 'america', 'africa']
const FILTER_LABELS = { all: 'Totes', europa: 'Europa', asia: 'Àsia', america: 'Amèrica', africa: 'Àfrica' }

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
            { n: '+500',    l: 'Destinacions' },
            { n: '+12.000', l: 'Clients satisfets' },
            { n: '15',      l: 'Anys d\'experiència' },
            { n: '98%',     l: 'Valoració positiva' },
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
                    <span className="dest-card__rating">★ {dest.rating}</span>
                  </div>
                  <h3 className="dest-card__name">{dest.name}</h3>
                  <p className="dest-card__desc">{dest.description}</p>
                  <div className="dest-card__footer">
                    <span className="dest-card__price">Des de <strong>{dest.price}€</strong></span>
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

      {/* SERVEIS */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Què oferim</p>
            <h2 className="section-title">Viatges a la teva mida</h2>
            <p className="section-subtitle">Cuidem cada detall perquè tu només hagis de gaudir.</p>
          </div>
          <div className="services__grid">
            {[
              { icon: '✈️', title: 'Viatges a mida',     desc: 'Dissenyem el teu itinerari perfecte des de zero, adaptat als teus gustos i pressupost.' },
              { icon: '🏨', title: 'Hotels seleccionats', desc: 'Allotjaments únics i verificats, des de boutique hotels fins a resorts de luxe.' },
              { icon: '🗺️', title: 'Guies locals',        desc: 'Experts locals que et mostren els secrets amagats de cada destinació.' },
              { icon: '🛡️', title: 'Viatge segur',        desc: 'Assegurança integral i assistència 24h durant tot el teu viatge.' },
              { icon: '👨‍👩‍👧‍👦', title: 'Viatges en grup',   desc: 'Circuit en grup reduït per connectar amb altres viatgers d\'arreu del món.' },
              { icon: '💍', title: 'Llunes de mel',       desc: 'Experiències exclusives i detalls especials per a la vostra escapada més romàntica.' },
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
            <div className="about__badge-floating">
              <span className="badge-number">15</span>
              <span className="badge-text">anys creant<br/>somnis</span>
            </div>
          </div>
          <div className="about__content fade-in">
            <p className="section-tag">Qui som</p>
            <h2 className="section-title">Apassionats dels viatges des del primer dia</h2>
            <p>Som un equip de viatgers que va convertir la seva passió en professió. Coneixem de primera mà cada destinació que recomanem perquè l'hem viscut.</p>
            <p>La nostra missió és simple: que cada client torni a casa amb un somriure i ganes de tornar a sortir.</p>
            <ul className="about__features">
              {[
                'Atenció personalitzada des del primer contacte',
                'Pressupost sense compromís en 24h',
                'Suport continu durant el viatge',
                'Garantia de preu millor',
              ].map(f => (
                <li key={f}><span className="check">✓</span> {f}</li>
              ))}
            </ul>
            <Link to="/contacte" className="btn btn--primary">Coneix el nostre equip</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIS */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">El que diuen de nosaltres</p>
            <h2 className="section-title">Viatgers feliços</h2>
          </div>
          <div className="testimonials__grid">
            {[
              { text: '"Van organitzar el nostre viatge de noces a Maldives i va ser perfecte. Cada detall cuidat al màxim. 100% recomanables."', author: 'Anna & Marc', trip: 'Maldives · Juny 2024' },
              { text: '"El viatge al Japó va superar totes les expectatives. L\'itinerari era perfecte i els hotels increïbles. Repetirem!"', author: 'Jordi Puig', trip: 'Japó · Abril 2024' },
              { text: '"Portàvem anys intentant organitzar el safari i no ens atrevíem. Va ser l\'experiència de la nostra vida."', author: 'Família Roca', trip: 'Kenya · Agost 2024' },
            ].map(t => (
              <div key={t.author} className="testimonial-card fade-in">
                <div className="testimonial-card__stars">★★★★★</div>
                <p className="testimonial-card__text">{t.text}</p>
                <div className="testimonial-card__author">
                  <div className="author-avatar author-avatar--placeholder" />
                  <div>
                    <strong>{t.author}</strong>
                    <span>{t.trip}</span>
                  </div>
                </div>
              </div>
            ))}
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
