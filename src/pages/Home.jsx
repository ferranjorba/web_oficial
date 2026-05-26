import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { destinations, SUBCATS } from '../data/destinations'
import './Home.css'

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS_CA = ['gen','feb','mar','abr','mai','jun','jul','ago','set','oct','nov','des']

function parseDate(str) {
  if (!str) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return new Date(str)
  if (/^\d{2}\/\d{2}$/.test(str)) {
    const [dd, mm] = str.split('/')
    return new Date(2026, parseInt(mm) - 1, parseInt(dd))
  }
  return null
}
function formatShortDate(str) {
  if (!str) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [, mm, dd] = str.split('-')
    return `${parseInt(dd)} ${MONTHS_CA[parseInt(mm) - 1]}`
  }
  return str
}
function getNextDep(trip) {
  if (!trip.departures?.length) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const available = trip.departures.filter(d => {
    const dt = parseDate(d.date)
    return dt && dt >= today && d.status !== 'CLOSED'
  })
  if (!available.length) return null
  return available.sort((a, b) => parseDate(a.date) - parseDate(b.date))[0]
}
function hasGuaranteed(trip) {
  return trip.departures?.some(d => d.status === 'GUARANTEED')
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [searchWhere, setSearchWhere] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchWhere.trim()) navigate(`/cerca?q=${encodeURIComponent(searchWhere)}`)
  }

  const tripMap = Object.fromEntries(destinations.map(d => [d.id, d]))

  return (
    <main>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hero" id="home">
        <div className="hero__bg">
          <div className="hero__overlay" />
          <div className="hero__placeholder-img" />
        </div>
        <div className="container hero__content">
          <p className="hero__eyebrow">Agència de viatges · Rubí, Barcelona</p>
          <h1 className="hero__title">Circuits únicament<br />per a tu.</h1>
          <p className="hero__subtitle">
            Grups de màxim 25 persones, sortida garantida des de 2.<br />
            El viatge que vols, quan el vols.
          </p>
          <div className="hero__actions">
            <a href="#categories" className="btn btn--primary">Veure destinacions</a>
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
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
      <section className="trust-bar">
        <div className="container trust-bar__grid">
          {[
            { n: '2 passatgers',  l: 'Sortida garantida' },
            { n: 'Màxim 25',      l: 'Persones per grup' },
            { n: 'Vol directe',   l: 'BCN–Ljubljana, tots els divendres' },
            { n: '27 circuits',   l: 'Disponibles per a 2026' },
          ].map(({ n, l }) => (
            <div key={l} className="trust-item">
              <span className="trust-value">{n}</span>
              <span className="trust-label">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── DESTACATS: ESLOVÈNIA I CROÀCIA ──────────────────────────────── */}
      <FeaturedSection tripMap={tripMap} />

      {/* ── CATEGORIES NAV ───────────────────────────────────────────────── */}
      <section className="cat-nav" id="categories">
        <div className="container">
          <header className="section-header">
            <p className="section-tag">Tots els circuits 2026</p>
            <h2 className="section-title">On vols anar?</h2>
            <p className="section-subtitle">Sis col·leccions de viatges curades per l'equip. Des de mercats de Nadal fins a aurores boreals.</p>
          </header>
          <div className="cat-nav__grid">
            {Object.entries(SUBCATS).map(([key, cat], i) => {
              const count = cat.ids.filter(id => tripMap[id]).length
              return (
                <CatTile key={key} catKey={key} cat={cat} count={count} index={i} />
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CATEGORY SECTIONS ────────────────────────────────────────────── */}
      {Object.entries(SUBCATS).map(([key, cat], i) => {
        const trips = cat.ids.map(id => tripMap[id]).filter(Boolean)
        const isNadal = key === 'nadal'
        const isAlt   = i % 2 === 1

        return (
          <section
            key={key}
            id={`sec-${key}`}
            className={`cat-section${isNadal ? ' cat-section--nadal' : isAlt ? ' cat-section--alt' : ''}`}
          >
            <div className="container">
              <header className="cat-section__header">
                {isNadal && <span className="season-tag">Temporada Nadal 2026</span>}
                <h2 className="section-title">{cat.label}</h2>
                <p className="section-subtitle">{cat.desc}</p>
              </header>

              <div className={`trips-grid${isNadal ? ' trips-grid--nadal' : ''}`}>
                {trips.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* ── PER QUÈ NOSALTRES ────────────────────────────────────────────── */}
      <section className="why-us" id="services">
        <div className="container">
          <header className="section-header section-header--left">
            <p className="section-tag">Per què triar-nos</p>
            <h2 className="section-title">El que ens fa diferents</h2>
          </header>
          <div className="why-grid">
            {[
              { num: '01', title: 'Sortida garantida',         desc: 'Els nostres circuits surten amb un mínim de 2 passatgers. Sense cancel·lacions per falta de grup.' },
              { num: '02', title: 'Vol directe BCN–Ljubljana', desc: 'Vol directe exclusiu amb Trade Air tots els divendres de juny a setembre. Sense escales, sense esperes.' },
              { num: '03', title: 'Hotels cèntrics',           desc: 'Allotjaments cèntrics o semi-cèntrics. Aprofites cada moment perquè ets al cor de la destinació.' },
              { num: '04', title: 'Grups reduïts',             desc: 'Màxim 25 passatgers per circuit. Atenció personalitzada i l\'experiència d\'un grup íntim.' },
            ].map(s => (
              <div key={s.num} className="why-card">
                <span className="why-card__num">{s.num}</span>
                <h3 className="why-card__title">{s.title}</h3>
                <p className="why-card__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOSALTRES ────────────────────────────────────────────────────── */}
      <section className="about" id="about">
        <div className="container about__grid">
          <div className="about__visual">
            <div className="about__img-main about__img--placeholder" />
            <div className="about__img-secondary about__img--placeholder" />
          </div>
          <div className="about__content">
            <p className="section-tag">Qui som</p>
            <h2 className="section-title">747 Viatges S.L.</h2>
            <p>Descripció pendent a preguntar</p>
            <p>C/ Llobateras, 49 · 08191 Rubí, Barcelona<br />Tel. 935 87 20 79</p>
            <Link to="/contacte" className="btn btn--primary" style={{ marginTop: '28px', display: 'inline-flex' }}>
              Contacta amb nosaltres
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <NewsletterSection />

    </main>
  )
}

// ── Cat Tile — tilt 3D ────────────────────────────────────────────────────────
function CatTile({ catKey, cat, count, index }) {
  const ref = useRef(null)
  const num = String(index + 1).padStart(2, '0')

  function onMove(e) {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left) / width  - 0.5   // -0.5 → 0.5
    const y = (e.clientY - top)  / height - 0.5
    // Atura la transició del transform mentre mou (més fluid)
    el.style.transition = 'box-shadow .2s ease, background .2s ease'
    el.style.transform  = `perspective(700px) rotateX(${-y * 9}deg) rotateY(${x * 12}deg) translateY(-6px) scale(1.01)`
  }

  function onLeave() {
    const el = ref.current
    if (!el) return
    // Torna suaument a la posició original
    el.style.transition = 'transform .55s cubic-bezier(.23,1,.32,1), box-shadow .4s ease, background .25s ease'
    el.style.transform  = ''
  }

  return (
    <a
      ref={ref}
      href={`#sec-${catKey}`}
      className={`cat-tile cat-tile--${catKey}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="cat-tile__accent" />
      <span className="cat-tile__num" aria-hidden="true">{num}</span>
      <strong className="cat-tile__name">{cat.label}</strong>
      <p className="cat-tile__desc">{cat.desc}</p>
      <div className="cat-tile__foot">
        <span className="cat-tile__count">{count} circuits</span>
        <span className="cat-tile__arrow">→</span>
      </div>
    </a>
  )
}

// ── Featured Section: Eslovènia i Croàcia ─────────────────────────────────────
function FeaturedSection({ tripMap }) {
  const cat   = SUBCATS['eslovenia-croacia']
  const trips = cat.ids.map(id => tripMap[id]).filter(Boolean).slice(0, 4)

  return (
    <section className="featured-section">
      <div className="container">

        {/* Franja vol directe */}
        <div className="featured-flight-strip">
          <span className="flight-strip__dot" />
          <span>
            <strong>Vol directe exclusiu</strong> — BCN → Ljubljana amb Trade Air,
            tots els divendres de juny a setembre 2026
          </span>
          <Link to="/categoria/eslovenia-croacia" className="flight-strip__link">
            Veure sortides →
          </Link>
        </div>

        {/* Capçalera */}
        <div className="featured-section__head">
          <div>
            <p className="section-tag">Recomanat per l'equip</p>
            <h2 className="section-title">Eslovènia i Croàcia</h2>
            <p className="section-subtitle">
              Llacs esmeralda, costes adriàtiques i vol directe des de Barcelona.
              Els circuits més sol·licitats de la temporada.
            </p>
          </div>
          <Link to="/categoria/eslovenia-croacia" className="featured-section__all">
            Veure tots els {cat.ids.length} circuits →
          </Link>
        </div>

        {/* Grid de trips destacats */}
        <div className="featured-grid">
          {trips.map((trip, i) => (
            <TripCard key={trip.id} trip={trip} featured={i === 0} />
          ))}
        </div>

      </div>
    </section>
  )
}

// ── Trip Card ─────────────────────────────────────────────────────────────────
function TripCard({ trip, featured = false }) {
  const nextDep    = getNextDep(trip)
  const guaranteed = hasGuaranteed(trip)

  return (
    <article className={`trip-card${featured ? ' trip-card--featured' : ''}`}>
      <Link to={`/viatge/${trip.id}`} className="trip-card__img-wrap">
        <div
          className={`trip-card__img${trip.image ? '' : ' trip-card__img--placeholder'}`}
          style={trip.image ? { backgroundImage: `url(${trip.image})` } : undefined}
        />
        {guaranteed && (
          <span className="trip-card__stamp">Sortida assegurada</span>
        )}
      </Link>

      <div className="trip-card__body">
        <p className="trip-card__kicker">
          {trip.country}
          {trip.duration && <><span className="kicker-sep">·</span>{trip.duration}</>}
        </p>
        <h3 className="trip-card__name">
          <Link to={`/viatge/${trip.id}`}>{trip.name}</Link>
        </h3>

        {nextDep && (
          <p className="trip-card__dep">
            <span className="dep-dot" />
            Pròxima sortida — <strong>{formatShortDate(nextDep.date)}</strong>
            {nextDep.status === 'GUARANTEED' && !guaranteed && (
              <span className="dep-gtd"> · assegurada</span>
            )}
          </p>
        )}

        <div className="trip-card__foot">
          <div className="trip-card__price">
            {trip.price ? (
              <>
                <span className="price-label">Des de</span>
                <span className="price-value">{trip.price.toLocaleString('ca')} €</span>
              </>
            ) : (
              <span className="price-consult">Preu a consultar</span>
            )}
          </div>
          <Link to={`/viatge/${trip.id}`} className="trip-card__cta">
            Descobrir <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

// ── Newsletter ────────────────────────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [sent, setSent]   = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true); setEmail('')
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section className="newsletter">
      <div className="container newsletter__inner">
        <p className="section-tag newsletter__tag">Inspira't</p>
        <h2>Rep ofertes exclusives cada setmana</h2>
        <p>Destinacions amagades, ofertes especials i idees de viatge directament al teu correu.</p>
        <form className="newsletter__form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={sent ? 'Subscrit correctament — gràcies' : 'El teu correu electrònic'}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn--primary">Subscriure'm</button>
        </form>
        <p className="newsletter__note">Sense spam. Cancel·la en qualsevol moment.</p>
      </div>
    </section>
  )
}
