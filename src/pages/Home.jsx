import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { destinations, SUBCATS } from '../data/destinations'
import { useLang } from '../context/LangContext'
import './Home.css'

// ── Animation helpers ─────────────────────────────────────────────────────────
const EASE = [0.25, 0.1, 0.25, 1]

const fadeUp = (delay = 0) => ({
  initial:  { opacity: 0, y: 20 },
  animate:  { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: EASE },
})

const fadeUpView = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true, margin: '-40px' },
  transition: { duration: 0.4, delay, ease: EASE },
})

const cardContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const cardVariants = {
  hidden:   { opacity: 0, y: 24 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

// ── Data helpers ──────────────────────────────────────────────────────────────
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
  const [filterMes, setFilterMes] = useState('')
  const [filterPreu, setFilterPreu] = useState('')
  const [filterDurada, setFilterDurada] = useState('')
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
    const params = new URLSearchParams()
    if (searchWhere.trim()) params.set('q', searchWhere.trim())
    if (filterMes)    params.set('mes', filterMes)
    if (filterPreu)   params.set('preu', filterPreu)
    if (filterDurada) params.set('durada', filterDurada)
    navigate(`/resultats?${params.toString()}`)
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
          <motion.p className="hero__eyebrow" {...fadeUp(0)}>
            {t('home.hero.eyebrow')}
          </motion.p>
          <motion.h1 className="hero__title" {...fadeUp(0.12)}>
            {t('home.hero.title')[0]}<br />{t('home.hero.title')[1]}
          </motion.h1>
          <motion.p className="hero__subtitle" {...fadeUp(0.24)}>
            {t('home.hero.subtitle').split('\n').map((l, i) => (
              <span key={i}>{l}{i === 0 && <br />}</span>
            ))}
          </motion.p>
          <motion.div className="hero__actions" {...fadeUp(0.36)}>
            <a href="#categories" className="btn btn--primary btn--lg">{t('home.hero.cta1')}</a>
            <Link to="/contacte" className="btn btn--ghost btn--lg">{t('home.hero.cta2')}</Link>
          </motion.div>

          <motion.div className="hero__search-wrap" ref={searchWrapRef} {...fadeUp(0.46)}>
            <form className="hero__search-card" onSubmit={handleSearch}>
              <div className="hero__search-top">
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
                <button type="submit" className="btn btn--primary search-btn">
                  {t('home.hero.searchBtn')}
                </button>
              </div>

              <div className="hero__filters-row">
                <div className="hero__filter-group">
                  <label className="hero__filter-label">
                    {lang === 'es' ? 'Mes de salida' : 'Mes de sortida'}
                  </label>
                  <select className="hero__filter-select" value={filterMes} onChange={e => setFilterMes(e.target.value)}>
                    <option value="">{lang === 'es' ? 'Cualquier mes' : 'Qualsevol mes'}</option>
                    <option value="2026-06">{lang === 'es' ? 'Junio 2026' : 'Juny 2026'}</option>
                    <option value="2026-07">{lang === 'es' ? 'Julio 2026' : 'Juliol 2026'}</option>
                    <option value="2026-08">{lang === 'es' ? 'Agosto 2026' : 'Agost 2026'}</option>
                    <option value="2026-09">{lang === 'es' ? 'Septiembre 2026' : 'Setembre 2026'}</option>
                    <option value="2026-10">{lang === 'es' ? 'Octubre 2026' : 'Octubre 2026'}</option>
                    <option value="2026-11">{lang === 'es' ? 'Noviembre 2026' : 'Novembre 2026'}</option>
                    <option value="2026-12">{lang === 'es' ? 'Diciembre 2026' : 'Desembre 2026'}</option>
                  </select>
                </div>

                <div className="hero__filter-group">
                  <label className="hero__filter-label">
                    {lang === 'es' ? 'Precio máximo' : 'Preu màxim'}
                  </label>
                  <select className="hero__filter-select" value={filterPreu} onChange={e => setFilterPreu(e.target.value)}>
                    <option value="">{lang === 'es' ? 'Cualquier precio' : 'Qualsevol preu'}</option>
                    <option value="1000">{lang === 'es' ? 'Hasta 1.000 €' : 'Fins 1.000 €'}</option>
                    <option value="1500">{lang === 'es' ? 'Hasta 1.500 €' : 'Fins 1.500 €'}</option>
                    <option value="2000">{lang === 'es' ? 'Hasta 2.000 €' : 'Fins 2.000 €'}</option>
                    <option value="3000">{lang === 'es' ? 'Hasta 3.000 €' : 'Fins 3.000 €'}</option>
                  </select>
                </div>

                <div className="hero__filter-group">
                  <label className="hero__filter-label">
                    {lang === 'es' ? 'Duración' : 'Durada'}
                  </label>
                  <select className="hero__filter-select" value={filterDurada} onChange={e => setFilterDurada(e.target.value)}>
                    <option value="">{lang === 'es' ? 'Cualquier duración' : 'Qualsevol durada'}</option>
                    <option value="5-">{lang === 'es' ? 'Hasta 5 días' : 'Fins 5 dies'}</option>
                    <option value="6-8">6-8 {lang === 'es' ? 'días' : 'dies'}</option>
                    <option value="9+">9+ {lang === 'es' ? 'días' : 'dies'}</option>
                  </select>
                </div>
              </div>
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
                      {trip.price
                        ? `Des de ${trip.price.toLocaleString('ca')} €`
                        : t('trip.priceConsult')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>

        {/* Stats bar bottom of hero */}
        <div className="hero__stats">
          <div className="hero__stats-inner">
            {t('home.trust').map(({ v, l }) => (
              <div key={l} className="hero__stat">
                <span className="hero__stat-val">{v}</span>
                <span className="hero__stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNOUNCEMENT BAR ─────────────────────────────────────────────── */}
      <div className="announce-bar">
        <div className="container">
          <div className="announce-bar__inner">
            <span className="announce-bar__dot" />
            <span className="announce-bar__text">
              <strong>{lang === 'es' ? 'Vuelo directo exclusivo — ' : 'Vol directe exclusiu — '}</strong>
              {lang === 'es'
                ? 'BCN → Ljubljana con Trade Air, todos los viernes de junio a septiembre 2026'
                : 'BCN → Ljubljana amb Trade Air, tots els divendres de juny a setembre 2026'}
            </span>
            <Link to="/categoria/eslovenia-croacia" className="announce-bar__link">
              {lang === 'es' ? 'Ver salidas →' : 'Veure sortides →'}
            </Link>
          </div>
        </div>
      </div>

      {/* ── QUI SOM ──────────────────────────────────────────────────────── */}
      <QuiSomSection />
      <GroupPhotosStrip />

      {/* ── EXPERIÈNCIES REALS ───────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── DESTACATS: ESLOVÈNIA I CROÀCIA ──────────────────────────────── */}
      <FeaturedSection tripMap={tripMap} />

      {/* ── CATEGORIES NAV ───────────────────────────────────────────────── */}
      <section className="cat-nav home-section--cream" id="categories">
        <div className="container">
          <motion.div className="section-head" {...fadeUpView()}>
            <div className="section-head__text">
              <p className="section-tag">{t('home.catNav.tag')}</p>
              <h2 className="section-title">{t('home.catNav.title')}</h2>
              <p className="section-subtitle">{t('home.catNav.subtitle')}</p>
            </div>
          </motion.div>
          <CatSlider entries={Object.entries(SUBCATS)} tripMap={tripMap} />
        </div>
      </section>

      {/* ── CATEGORY SECTIONS ────────────────────────────────────────────── */}
      {Object.entries(SUBCATS).map(([key, cat], i) => {
        const trips = cat.ids.map(id => tripMap[id]).filter(Boolean)
        const isNadal = key === 'nadal'
        const isAlt   = i % 2 === 1
        const meta    = CAT_META[key]

        return (
          <section
            key={key}
            id={`sec-${key}`}
            className={`cat-section${isNadal ? ' cat-section--nadal' : isAlt ? ' cat-section--alt' : ''}`}
          >
            <div className="container">
              <motion.header className="cat-section__header" {...fadeUpView()}>
                <div className="cat-section__header-left">
                  {!isNadal && meta && (
                    <p className="cat-section__eyebrow">
                      {meta.icon}
                      <span>{lang === 'es' ? (meta.eyebrow_es || meta.eyebrow) : meta.eyebrow}</span>
                    </p>
                  )}
                  {isNadal && <span className="season-tag">{t('trip.seasonTag')}</span>}
                  <h2 className="section-title">
                    {lang === 'es' ? (cat.label_es || cat.label) : cat.label}
                  </h2>
                  <p className="section-subtitle">
                    {lang === 'es' ? (cat.desc_es || cat.desc) : cat.desc}
                  </p>
                </div>
                <Link to={`/categoria/${key}`} className="cat-section__view-all">
                  {trips.length} {t('trip.circuits')} <span aria-hidden="true">→</span>
                </Link>
              </motion.header>

              <motion.div
                className={`trips-grid${isNadal ? ' trips-grid--nadal' : ''}`}
                variants={cardContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
              >
                {trips.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </motion.div>
            </div>
          </section>
        )
      })}

    </main>
  )
}

// ── Cat Slider ────────────────────────────────────────────────────────────────
const GAP = 16

function CatSlider({ entries, tripMap }) {
  const viewportRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)
  const total = entries.length

  const updateState = () => {
    const el = viewportRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    const tile = el.querySelector('.cat-tile')
    if (tile) {
      setActiveIdx(Math.round(el.scrollLeft / (tile.offsetWidth + GAP)))
    }
  }
  const scroll = (dir) => {
    const el = viewportRef.current
    if (!el) return
    const tile = el.querySelector('.cat-tile')
    if (!tile) return
    el.scrollBy({ left: dir * (tile.offsetWidth + GAP), behavior: 'smooth' })
  }
  const scrollToIdx = (i) => {
    const el = viewportRef.current
    if (!el) return
    const tile = el.querySelector('.cat-tile')
    if (!tile) return
    el.scrollTo({ left: i * (tile.offsetWidth + GAP), behavior: 'smooth' })
  }

  return (
    <div className="cat-slider-wrap">
      <div className="cat-slider__viewport" ref={viewportRef} onScroll={updateState}>
        {entries.map(([key, cat]) => {
          const count = cat.ids.filter(id => tripMap[id]).length
          return <CatTile key={key} catKey={key} cat={cat} count={count} />
        })}
      </div>
      <button className="cat-slider__btn cat-slider__btn--prev" onClick={() => scroll(-1)} disabled={!canPrev} aria-label="Anterior">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button className="cat-slider__btn cat-slider__btn--next" onClick={() => scroll(1)} disabled={!canNext} aria-label="Següent">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
      <div className="cat-slider__dots" role="tablist" aria-label="Navegació carousel">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeIdx}
            className={`cat-slider__dot${i === activeIdx ? ' cat-slider__dot--active' : ''}`}
            onClick={() => scrollToIdx(i)}
            aria-label={`Anar a ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ── Cat Tile ──────────────────────────────────────────────────────────────────
function CatTile({ catKey, cat, count }) {
  const { lang, t } = useLang()
  const label = lang === 'es' ? (cat.label_es || cat.label) : cat.label
  return (
    <a href={`#sec-${catKey}`} className={`cat-tile cat-tile--${catKey}`}>
      <div className="cat-tile__content">
        <span className="cat-tile__badge">{count} {t('trip.circuits')}</span>
        <strong className="cat-tile__name">{label}</strong>
      </div>
      <span className="cat-tile__cta-btn" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </span>
    </a>
  )
}

// ── Featured Section ──────────────────────────────────────────────────────────
function FeaturedSection({ tripMap }) {
  const { lang, t } = useLang()
  const cat   = SUBCATS['eslovenia-croacia']
  const trips = cat.ids.map(id => tripMap[id]).filter(Boolean).slice(0, 2)
  const title = lang === 'es' ? (cat.label_es || cat.label) : cat.label

  return (
    <section className="cat-section home-section--orange">
      <div className="container">
        <motion.div className="section-head" {...fadeUpView()}>
          <div className="section-head__text">
            <p className="section-tag">{t('home.featured.tag')}</p>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{t('home.featured.subtitle')}</p>
          </div>
          <Link to="/categoria/eslovenia-croacia" className="section-head__link">
            {t('home.featured.allLink', { n: cat.ids.length })}
          </Link>
        </motion.div>

        <motion.div
          className="trips-grid--featured"
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {trips.map((trip, i) => (
            <TripCard key={trip.id} trip={trip} isFeaturedCard={i === 0} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Trip card helpers ─────────────────────────────────────────────────────────
const PlaneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011 2v0a1.5 1.5 0 00-1.5 1.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
)
const BedIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v6H2"/><path d="M2 16h20"/><path d="M6 8v-2a2 2 0 012-2h8a2 2 0 012 2v2"/>
  </svg>
)
const ForkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
)

// ── Section header meta ───────────────────────────────────────────────────────
const CatIconNadal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="2" x2="12" y2="22"/><path d="m8 6 4-4 4 4"/><path d="m8 18 4 4 4-4"/>
    <line x1="2" y1="12" x2="22" y2="12"/><path d="m6 8-4 4 4 4"/><path d="m18 8 4 4-4 4"/>
  </svg>
)
const CatIconMountain = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
  </svg>
)
const CatIconAirplane = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011 2v0a1.5 1.5 0 00-1.5 1.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
)
const CatIconWave = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
  </svg>
)
const CatIconSun = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
)
const CatIconGlobe = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
)
const CAT_META = {
  nadal:               { eyebrow: 'Tardor / Hivern 2026',          eyebrow_es: 'Otoño / Invierno 2026',          icon: <CatIconNadal /> },
  islandia:            { eyebrow: 'Volcans i Aurores Boreals',     eyebrow_es: 'Volcanes y Auroras Boreales',    icon: <CatIconMountain /> },
  'eslovenia-croacia': { eyebrow: 'Vol directe des de BCN',        eyebrow_es: 'Vuelo directo desde BCN',        icon: <CatIconAirplane /> },
  noruega:             { eyebrow: 'Fiords Patrimoni UNESCO',        eyebrow_es: 'Fiordos Patrimonio UNESCO',      icon: <CatIconWave /> },
  mediterrani:         { eyebrow: 'De la Provença a Turquia',       eyebrow_es: 'De la Provenza a Turquía',      icon: <CatIconSun /> },
  asia:                { eyebrow: 'Temples, Safaris i Mar Índic',   eyebrow_es: 'Templos, Safaris y Mar Índico', icon: <CatIconGlobe /> },
}

function IncludesRow({ trip, isEs }) {
  const items = []
  const hasFlight = trip.includesFlight || trip.highlights?.some(h => /vol direct|vol inclòs/i.test(h))
  if (hasFlight) items.push({ icon: 'plane', label: isEs ? 'Vuelo incluido' : 'Vol inclòs' })
  items.push({ icon: 'bed', label: isEs ? 'Hotel incluido' : 'Hotel inclòs' })
  const hasMeals = trip.highlights?.some(h => /sopar|esmorzar|pensió|dinar/i.test(h))
  if (hasMeals) items.push({ icon: 'fork', label: isEs ? 'Àpats inclosos' : 'Àpats inclosos' })
  return (
    <div className="trip-card__includes">
      {items.map(item => (
        <span key={item.icon} className="includes-item">
          {item.icon === 'plane' ? <PlaneIcon /> : item.icon === 'bed' ? <BedIcon /> : <ForkIcon />}
          <span>{item.label}</span>
        </span>
      ))}
    </div>
  )
}

// ── Trip Card ─────────────────────────────────────────────────────────────────
function TripCard({ trip, isFeaturedCard = false }) {
  const { t, lang } = useLang()
  const isEs       = lang === 'es'
  const nextDep    = getNextDep(trip)
  const guaranteed = hasGuaranteed(trip)
  const desc       = trip.tagline || null

  return (
    <motion.article className="trip-card" variants={cardVariants}>
      <Link to={`/viatge/${trip.id}`} className="trip-card__img-wrap">
        <div
          className={`trip-card__img${trip.image ? '' : ' trip-card__img--placeholder'}`}
          style={trip.image ? { backgroundImage: `url(${trip.image})` } : undefined}
        />
        <div className="trip-card__img-overlay" />
        {isFeaturedCard && (
          <span className="trip-card__badge-featured">{t('home.featured.tag')}</span>
        )}
        {!isFeaturedCard && trip.country && (
          <span className="trip-card__country">{trip.country}</span>
        )}
        {trip.featured && (
          <span className="trip-card__badge">★ Popular</span>
        )}
        {guaranteed && (
          <span className="trip-card__stamp">{t('trip.guaranteed')}</span>
        )}
      </Link>

      <div className="trip-card__body">
        <p className="trip-card__kicker">
          {trip.country}
          {trip.duration && <><span className="kicker-sep"> · </span>{trip.duration}</>}
        </p>
        <h3 className="trip-card__name">
          <Link to={`/viatge/${trip.id}`}>{trip.name}</Link>
        </h3>
        {desc && <p className="trip-card__desc">{desc}</p>}
        <IncludesRow trip={trip} isEs={isEs} />

        <div className="trip-card__bottom">
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
      </div>
    </motion.article>
  )
}

// ── Why Us Section ────────────────────────────────────────────────────────────
const WHY_ITEMS = [
  {
    num: '01',
    title: 'Sortida garantida des de 2 persones',
    desc: 'No perdràs el viatge per falta de grup.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4"/>
        <circle cx="12" cy="12" r="9"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Grups de màxim 25 persones',
    desc: 'Experiència íntima, mai massificada.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="4"/>
        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
        <path d="M21 21v-2a4 4 0 00-3-3.87"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Vol directe BCN → Ljubljana',
    desc: 'Tots els divendres de juny a setembre 2026.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011 2v0a1.5 1.5 0 00-1.5 1.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    ),
  },
]

const ES_WHY_ITEMS = [
  { num: '01', title: 'Salida garantizada desde 2 personas', desc: 'No perderás el viaje por falta de grupo.' },
  { num: '02', title: 'Grupos de máximo 25 personas', desc: 'Experiencia íntima, nunca masificada.' },
  { num: '03', title: 'Vuelo directo BCN → Ljubljana', desc: 'Todos los viernes de junio a septiembre 2026.' },
]

function WhyUsSection() {
  const { lang, t } = useLang()
  const items = lang === 'es'
    ? WHY_ITEMS.map((w, i) => ({ ...w, ...ES_WHY_ITEMS[i] }))
    : WHY_ITEMS

  return (
    <section className="why-us" id="services">
      <div className="container">
        <motion.div className="section-head section-head--center" {...fadeUpView()}>
          <div>
            <p className="section-tag">{t('home.whyUs.tag')}</p>
            <h2 className="section-title">{t('home.whyUs.title')}</h2>
            <p className="section-subtitle">{lang === 'es'
              ? 'Más de 10 años organizando circuitos. Licencia GC-2061. Oficina física en Rubí, Barcelona.'
              : 'Més de 10 anys organitzant circuits. Llicència GC-2061. Oficina física a Rubí, Barcelona.'
            }</p>
          </div>
        </motion.div>

        <motion.div
          className="why-features"
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {items.map((item) => (
            <motion.div key={item.num} className="why-feature" variants={cardVariants}>
              <span className="why-feature__bg-num" aria-hidden="true">{item.num}</span>
              <div className="why-feature__icon">{item.icon}</div>
              <h3 className="why-feature__title">{item.title}</h3>
              <p className="why-feature__desc">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Group Photos Strip ────────────────────────────────────────────────────────
function GroupPhotosStrip() {
  return (
    <div className="group-photos">
      <img
        src="/images/469555407_1493234761362904_5868655219185168799_n.jpg"
        alt="Grup de viatgers de Good Travels a Vitòria"
        loading="lazy"
      />
      <img
        src="/images/472821694_1116127486782483_5179414144763462547_n.jpg"
        alt="Grup de Good Travels a la Guinness Storehouse de Dublín"
        loading="lazy"
      />
      <img
        src="/images/472983479_1116133466781885_4160463814950503366_n.jpg"
        alt="Grup de Good Travels als penya-segats de Slieve League, Irlanda"
        loading="lazy"
      />
    </div>
  )
}

// ── Qui Som Section ───────────────────────────────────────────────────────────
function QuiSomSection() {
  const { lang } = useLang()
  const isEs = lang === 'es'
  return (
    <section className="qui-som" id="about">
      <div className="container qui-som__grid">

        <motion.div className="qui-som__text" {...fadeUpView()}>
          <p className="qui-som__eyebrow">
            {isEs ? 'SOBRE NOSOTROS' : 'SOBRE NOSALTRES'}
          </p>
          <h2 className="qui-som__title">
            {isEs ? 'Una agencia pequeña con mucha experiencia' : 'Una agència petita amb molta experiència'}
          </h2>
          <div className="qui-som__accent" />
          <p className="qui-som__body">
            {isEs
              ? 'Viajar en grupo no debería significar perder la intimidad. En Good Travels hemos construido una manera diferente de hacer circuitos: grupos reducidos, salidas garantizadas y atención personalizada desde el primer contacto. Más de diez años organizando viajes que la gente repite.'
              : 'Viatjar en grup no hauria de significar perdre la intimitat. A Good Travels hem construït una manera diferent de fer circuits: grups reduïts, sortides garantides i atenció personalitzada des del primer contacte. Més de deu anys organitzant viatges que la gent repeteix.'}
          </p>
          <p className="qui-som__body">
            {isEs
              ? 'Trabajamos con guías locales que conocen cada rincón del país, hoteles con carácter y vuelos directos desde Barcelona. El resultado es un viaje que se siente hecho para ti, aunque viajes con otros.'
              : 'Treballem amb guies locals que coneixen cada racó del país, hotels amb caràcter i vols directes des de Barcelona. El resultat és un viatge que se sent fet per a tu, encara que viatgis amb altres.'}
          </p>
          <div className="qui-som__stats">
            <div className="qui-som__stat">
              <span className="qui-som__stat-val">10+</span>
              <span className="qui-som__stat-label">{isEs ? "años de experiencia" : "anys d'experiència"}</span>
            </div>
            <div className="qui-som__stat-divider" />
            <div className="qui-som__stat">
              <span className="qui-som__stat-val">+2.000</span>
              <span className="qui-som__stat-label">{isEs ? 'viajeros satisfechos' : 'viatgers satisfets'}</span>
            </div>
            <div className="qui-som__stat-divider" />
            <div className="qui-som__stat">
              <span className="qui-som__stat-val">25</span>
              <span className="qui-som__stat-label">{isEs ? 'personas máximo por grupo' : 'persones màxim per grup'}</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="qui-som__visual" {...fadeUpView(0.12)}>
          <div className="qui-som__img-wrap">
            <img
              className="qui-som__img"
              src="/images/informativa.jpg"
              alt="Good Travels — Cada viatge és una nova pàgina del teu relat"
              loading="lazy"
              width="600"
              height="800"
            />
            <div className="qui-som__badge">
              <svg className="qui-som__badge-star" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <div className="qui-som__badge-text">
                <span className="qui-som__badge-score">4.5 / 5</span>
                <span className="qui-som__badge-label">{isEs ? 'Valoración media' : 'Valoració mitjana'}</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

// ── Testimonials Section ──────────────────────────────────────────────────────
const TESTIMONIALS_CA = [
  {
    quote: 'La que millor cuida els seus clients... Si vols un viatge únic i personalitzat, aquest és el teu lloc. En Francesc estarà encantat d\'atendre\'t.',
    author: 'Graci P.',
    location: 'Guia Local de Google',
    trip: 'Google Reviews',
    initials: 'GP',
    thumb: '/images/469555407_1493234761362904_5868655219185168799_n.jpg',
  },
  {
    quote: 'Agència de viatge on el personal sempre està per la feina i pels seus clients. Mai he tingut cap problema, per això tots els viatges, tant nacionals com internacionals, els faig amb aquesta agència.',
    author: 'Rafael B.',
    location: 'Guia Local de Google',
    trip: 'Google Reviews',
    initials: 'RB',
    thumb: '/images/472821694_1116127486782483_5179414144763462547_n.jpg',
  },
  {
    quote: 'Molt contenta d\'haver fet un viatge amb aquesta agència, era la primera vegada però repetiré. Molt bona organització, molt professionals i un bon tracte personal.',
    author: 'Victoria M.',
    location: 'Google Reviews',
    trip: 'Google Reviews',
    initials: 'VM',
    thumb: '/images/472983479_1116133466781885_4160463814950503366_n.jpg',
  },
]
const TESTIMONIALS_ES = [
  {
    quote: 'La que mejor cuida a sus clientes... Si quieres un viaje único y personalizado, este es tu sitio. Francesc estará encantado de atenderte.',
    author: 'Graci P.',
    location: 'Guía Local de Google',
    trip: 'Google Reviews',
    initials: 'GP',
    thumb: '/images/469555407_1493234761362904_5868655219185168799_n.jpg',
  },
  {
    quote: 'Agencia de viaje donde el personal siempre está por la labor y por sus clientes. Nunca he tenido ningún problema, por eso todos mis viajes, nacionales e internacionales, los hago con esta agencia.',
    author: 'Rafael B.',
    location: 'Guía Local de Google',
    trip: 'Google Reviews',
    initials: 'RB',
    thumb: '/images/472821694_1116127486782483_5179414144763462547_n.jpg',
  },
  {
    quote: 'Muy contenta de haber hecho un viaje con esta agencia, era la primera vez pero volveré a repetir. Muy buena organización, muy profesionales y un buen trato personal.',
    author: 'Victoria M.',
    location: 'Google Reviews',
    trip: 'Google Reviews',
    initials: 'VM',
    thumb: '/images/472983479_1116133466781885_4160463814950503366_n.jpg',
  },
]

function TestimonialsSection() {
  const { lang } = useLang()
  const isEs = lang === 'es'
  const items = isEs ? TESTIMONIALS_ES : TESTIMONIALS_CA
  return (
    <section className="testimonials">
      <div className="container">
        <motion.div className="testimonials__header" {...fadeUpView()}>
          <p className="qui-som__eyebrow">
            {isEs ? 'LO QUE DICE LA GENTE' : 'EL QUE DIU LA GENT'}
          </p>
          <h2 className="testimonials__title">
            {isEs ? 'Experiencias reales' : 'Experiències reals'}
          </h2>
          <div className="qui-som__accent" />
          <p className="testimonials__subtitle">
            {isEs ? 'Más de 2.000 viajeros han confiado en nosotros' : 'Més de 2.000 viatgers han confiat en nosaltres'}
          </p>
        </motion.div>

        <motion.div
          className="testimonials__grid"
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {items.map((item) => (
            <motion.div key={item.author + item.trip} className="testimonial-card" variants={cardVariants}>
              <div className="testimonial-card__top">
                <span className="testimonial-card__stars">★★★★★</span>
                <span className="testimonial-card__trip">{item.trip}</span>
              </div>
              <div className="testimonial-card__body">
                <span className="testimonial-card__deco" aria-hidden="true">&ldquo;</span>
                <p className="testimonial-card__text">{item.quote}</p>
              </div>
              <div className="testimonial-card__divider" />
              <div className="testimonial-card__author-row">
                <div className="testimonial-card__avatar">{item.initials}</div>
                <div style={{ flex: 1 }}>
                  <span className="testimonial-card__name">{item.author}</span>
                  <span className="testimonial-card__location">{item.location}</span>
                </div>
                {item.thumb && (
                  <img
                    className="testimonial-card__thumb"
                    src={item.thumb}
                    alt={`Foto de viatge`}
                    loading="lazy"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
