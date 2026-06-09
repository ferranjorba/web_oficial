import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { destinations, SUBCATS } from '../data/destinations'
import { useLang } from '../context/LangContext'
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
  const { lang, t } = useLang()

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
          <p className="hero__eyebrow">{t('home.hero.eyebrow')}</p>
          <h1 className="hero__title">{t('home.hero.title')[0]}<br />{t('home.hero.title')[1]}</h1>
          <p className="hero__subtitle">
            {t('home.hero.subtitle').split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
          </p>
          <div className="hero__actions">
            <a href="#categories" className="btn btn--primary">{t('home.hero.cta1')}</a>
            <Link to="/contacte" className="btn btn--ghost">{t('home.hero.cta2')}</Link>
          </div>
          <div className="hero__search-wrap" ref={searchWrapRef}>
            <form className="hero__search" onSubmit={handleSearch}>
              <div className="search-field">
                <label>{t('home.hero.searchLabel')}</label>
                <input
                  type="text"
                  placeholder={t('home.hero.searchPlaceholder')}
                  value={searchWhere}
                  onChange={handleSearchChange}
                  onFocus={() => searchWhere.length > 0 && setShowSuggestions(true)}
                  onKeyDown={e => e.key === 'Escape' && setShowSuggestions(false)}
                  autoComplete="off"
                />
              </div>
              <button type="submit" className="btn btn--primary search-btn">{t('home.hero.searchBtn')}</button>
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
          {t('home.trust').map(({ v, l }, i) => (
            <div key={l} className={`trust-item reveal reveal-d${i}`}>
              <span className="trust-value">{v}</span>
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
            <p className="section-tag">{t('home.catNav.tag')}</p>
            <h2 className="section-title">{t('home.catNav.title')}</h2>
            <p className="section-subtitle">{t('home.catNav.subtitle')}</p>
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
                {isNadal && <span className="season-tag">{t('trip.seasonTag')}</span>}
                <h2 className="section-title">{lang === 'es' ? (cat.label_es || cat.label) : cat.label}</h2>
                <p className="section-subtitle">{lang === 'es' ? (cat.desc_es || cat.desc) : cat.desc}</p>
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
            <p className="section-tag">{t('home.whyUs.tag')}</p>
            <h2 className="section-title">{t('home.whyUs.title')}</h2>
          </header>
          <div className="why-grid">
            {t('home.whyUs.items').map((s, i) => (
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
            <p className="section-tag">{t('home.about.tag')}</p>
            <h2 className="section-title">{t('home.about.title')}</h2>
            <p>{t('home.about.desc')}</p>
            <p>{t('home.about.address').split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</p>
            <Link to="/contacte" className="btn btn--primary" style={{ marginTop: '28px', display: 'inline-flex' }}>
              {t('home.about.cta')}
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
  const { lang, t } = useLang()
  const label = lang === 'es' ? (cat.label_es || cat.label) : cat.label
  const desc  = lang === 'es' ? (cat.desc_es  || cat.desc)  : cat.desc
  return (
    <a href={`#sec-${catKey}`} className={`cat-tile cat-tile--${catKey}`}>
      <div className="cat-tile__accent" />
      <span className="cat-tile__num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <strong className="cat-tile__name">{label}</strong>
      <p className="cat-tile__desc">{desc}</p>
      <div className="cat-tile__foot">
        <span className="cat-tile__count">{count} {t('trip.circuits')}</span>
        <span className="cat-tile__arrow">→</span>
      </div>
    </a>
  )
}

// ── Featured Section: Eslovènia i Croàcia ─────────────────────────────────────
function FeaturedSection({ tripMap }) {
  const { lang, t } = useLang()
  const cat   = SUBCATS['eslovenia-croacia']
  const trips = cat.ids.map(id => tripMap[id]).filter(Boolean).slice(0, 4)
  const title = lang === 'es' ? (cat.label_es || cat.label) : cat.label

  return (
    <section className="featured-section">
      <div className="container">

        {/* Franja vol directe */}
        <div className="featured-flight-strip">
          <span className="flight-strip__dot" />
          <span>{t('home.featured.strip')}</span>
          <Link to="/categoria/eslovenia-croacia" className="flight-strip__link">
            {t('home.featured.stripLink')}
          </Link>
        </div>

        {/* Capçalera */}
        <div className="featured-section__head">
          <div>
            <p className="section-tag">{t('home.featured.tag')}</p>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{t('home.featured.subtitle')}</p>
          </div>
          <Link to="/categoria/eslovenia-croacia" className="featured-section__all">
            {t('home.featured.allLink', { n: cat.ids.length })}
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
  const { t } = useLang()
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
          <span className="trip-card__stamp">{t('trip.guaranteed')}</span>
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
            {t('trip.nextDep')} — <strong>{formatShortDate(nextDep.date)}</strong>
            {nextDep.status === 'GUARANTEED' && !guaranteed && (
              <span className="dep-gtd"> · {t('trip.depAssured')}</span>
            )}
          </p>
        )}

        <div className="trip-card__foot">
          <div className="trip-card__price">
            {trip.price ? (
              <>
                <span className="price-label">{t('trip.from')}</span>
                <span className="price-value">{trip.price.toLocaleString('ca')} €</span>
              </>
            ) : (
              <span className="price-consult">{t('trip.priceConsult')}</span>
            )}
          </div>
          <Link to={`/viatge/${trip.id}`} className="trip-card__cta">
            {t('trip.discover')} <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

