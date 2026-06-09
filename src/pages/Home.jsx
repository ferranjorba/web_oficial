import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { destinations, SUBCATS } from '../data/destinations'
import './Home.css'

function normalitza(str) {
  if (!str) return ''
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function searchTrips(query, max = 6) {
  const q = normalitza(query.trim())
  if (q.length < 1) return []
  return destinations
    .filter(d =>
      normalitza(d.name).includes(q) ||
      normalitza(d.country).includes(q) ||
      normalitza(d.tagline || '').includes(q) ||
      normalitza(d.description || '').includes(q)
    )
    .slice(0, max)
}

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
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchWrapRef = useRef(null)
  const navigate = useNavigate()

  const suggestions = showSuggestions ? searchTrips(searchWhere) : []

  useEffect(() => {
    function onClickOutside(e) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setShowSuggestions(false)
    if (searchWhere.trim()) navigate(`/cerca?q=${encodeURIComponent(searchWhere)}`)
  }

  const handleSearchChange = (e) => {
    setSearchWhere(e.target.value)
    setShowSuggestions(true)
  }

  const pickSuggestion = (trip) => {
    setShowSuggestions(false)
    setSearchWhere('')
    navigate(`/viatge/${trip.id}`)
  }

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

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
          <div className="hero__search-wrap" ref={searchWrapRef}>
            <form className="hero__search" onSubmit={handleSearch}>
              <div className="search-field">
                <label>On vols anar?</label>
                <input
                  type="text"
                  placeholder="Islàndia, Noruega, Eslovènia..."
                  value={searchWhere}
                  onChange={handleSearchChange}
                  onFocus={() => searchWhere.length > 0 && setShowSuggestions(true)}
                  onKeyDown={e => e.key === 'Escape' && setShowSuggestions(false)}
                  autoComplete="off"
                />
              </div>
              <button type="submit" className="btn btn--primary search-btn">Buscar</button>
            </form>

            {suggestions.length > 0 && (
              <ul className="search-suggestions">
                {suggestions.map(trip => (
                  <li key={trip.id} className="search-suggestion" onMouseDown={() => pickSuggestion(trip)}>
                    <div
                      className="search-suggestion__img"
                      style={trip.image ? { backgroundImage: `url(${trip.image})` } : undefined}
                    />
                    <div className="search-suggestion__info">
                      <span className="search-suggestion__name">{trip.name}</span>
                      <span className="search-suggestion__meta">
                        {trip.country}{trip.duration ? ` · ${trip.duration}` : ''}
                      </span>
                    </div>
                    <span className="search-suggestion__price">
                      {trip.price ? `Des de ${trip.price.toLocaleString('ca')} €` : 'Preu a consultar'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
          ].map(({ n, l }, i) => (
            <div key={l} className={`trust-item reveal reveal-d${i}`}>
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
          <CatSlider entries={Object.entries(SUBCATS)} tripMap={tripMap} />
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
              <header className="cat-section__header reveal">
                {isNadal && <span className="season-tag">Temporada Nadal 2026</span>}
                <h2 className="section-title">{cat.label}</h2>
                <p className="section-subtitle">{cat.desc}</p>
              </header>

              <div className={`trips-grid${isNadal ? ' trips-grid--nadal' : ''} reveal reveal-d1`}>
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
            ].map((s, i) => (
              <div key={s.num} className={`why-card reveal reveal-d${i}`}>
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

    </main>
  )
}

// ── Cat Slider ────────────────────────────────────────────────────────────────
function CatSlider({ entries, tripMap }) {
  const viewportRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateArrows = () => {
    const el = viewportRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  const scroll = (dir) => {
    const el = viewportRef.current
    if (!el) return
    const tile = el.querySelector('.cat-tile')
    if (!tile) return
    el.scrollBy({ left: dir * (tile.offsetWidth + 16), behavior: 'smooth' })
  }

  return (
    <div className="cat-slider">
      <button className="cat-slider__btn" onClick={() => scroll(-1)} disabled={!canPrev} aria-label="Anterior">
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
          <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="cat-slider__viewport" ref={viewportRef} onScroll={updateArrows}>
        {entries.map(([key, cat], i) => {
          const count = cat.ids.filter(id => tripMap[id]).length
          return <CatTile key={key} catKey={key} cat={cat} count={count} index={i} />
        })}
      </div>
      <button className="cat-slider__btn" onClick={() => scroll(1)} disabled={!canNext} aria-label="Següent">
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
          <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

// ── Cat Tile ──────────────────────────────────────────────────────────────────
function CatTile({ catKey, cat, count, index }) {
  return (
    <a href={`#sec-${catKey}`} className={`cat-tile cat-tile--${catKey}`}>
      <div className="cat-tile__accent" />
      <span className="cat-tile__num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
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

