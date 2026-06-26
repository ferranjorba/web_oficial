import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { destinations } from '../data/destinations'
import { useLang } from '../context/LangContext'
import './ResultsPage.css'
import './CategoryPage.css'

// ── Animation ─────────────────────────────────────────────────────────────────
const EASE = [0.25, 0.1, 0.25, 1]
const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const cardVariants = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

// ── Labels ────────────────────────────────────────────────────────────────────
const MES_LABELS_CA = {
  '2026-06': 'Juny 2026',
  '2026-07': 'Juliol 2026',
  '2026-08': 'Agost 2026',
  '2026-09': 'Setembre 2026',
  '2026-10': 'Octubre 2026',
  '2026-11': 'Novembre 2026',
  '2026-12': 'Desembre 2026',
}
const MES_LABELS_ES = {
  '2026-06': 'Junio 2026',
  '2026-07': 'Julio 2026',
  '2026-08': 'Agosto 2026',
  '2026-09': 'Septiembre 2026',
  '2026-10': 'Octubre 2026',
  '2026-11': 'Noviembre 2026',
  '2026-12': 'Diciembre 2026',
}
const PREU_LABELS = {
  '1000': 'Fins 1.000 €',
  '1500': 'Fins 1.500 €',
  '2000': 'Fins 2.000 €',
  '3000': 'Fins 3.000 €',
}
const PREU_LABELS_ES = {
  '1000': 'Hasta 1.000 €',
  '1500': 'Hasta 1.500 €',
  '2000': 'Hasta 2.000 €',
  '3000': 'Hasta 3.000 €',
}
const DURADA_LABELS_CA = { '5-': 'Fins 5 dies', '6-8': '6-8 dies', '9+': '9+ dies' }
const DURADA_LABELS_ES = { '5-': 'Hasta 5 días', '6-8': '6-8 días', '9+': '9+ días' }

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS_CA = ['gen','feb','mar','abr','mai','jun','jul','ago','set','oct','nov','des']

function normalitza(str) {
  if (!str) return ''
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}
function parseDate(str) {
  if (!str) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return new Date(str + 'T00:00:00')
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
function parseDays(duration) {
  if (!duration) return null
  const m = /^(\d+)/.exec(duration)
  return m ? parseInt(m[1]) : null
}
function tripHasMonth(trip, monthStr) {
  if (!monthStr) return true
  const [year, month] = monthStr.split('-').map(Number)
  if (!trip.departures?.length) return false
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return trip.departures.some(d => {
    const dt = parseDate(d.date)
    if (!dt || dt < today) return false
    return dt.getFullYear() === year && (dt.getMonth() + 1) === month
  })
}

// ── Filtering & sorting ───────────────────────────────────────────────────────
function filterTrips(trips, { q, mes, preu, durada }) {
  return trips.filter(trip => {
    if (q) {
      const qn = normalitza(q)
      const match =
        normalitza(trip.name).includes(qn) ||
        normalitza(trip.country).includes(qn) ||
        normalitza(trip.tagline || '').includes(qn)
      if (!match) return false
    }
    if (mes && !tripHasMonth(trip, mes)) return false
    if (preu) {
      const max = parseInt(preu)
      if (!trip.price || trip.price > max) return false
    }
    if (durada) {
      const days = parseDays(trip.duration)
      if (!days) return false
      if (durada === '5-'  && days > 5)            return false
      if (durada === '6-8' && (days < 6 || days > 8)) return false
      if (durada === '9+'  && days < 9)            return false
    }
    return true
  })
}
function sortTrips(trips, sortBy) {
  const arr = [...trips]
  switch (sortBy) {
    case 'preu-asc':
      return arr.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
    case 'preu-desc':
      return arr.sort((a, b) => (b.price ?? -1) - (a.price ?? -1))
    case 'durada-asc':
      return arr.sort((a, b) => (parseDays(a.duration) ?? 99) - (parseDays(b.duration) ?? 99))
    default:
      return arr
  }
}

// ── Card helpers ──────────────────────────────────────────────────────────────
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
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
)
function CardIncludes({ trip, isEs }) {
  const items = []
  const hasFlight = trip.includesFlight || trip.highlights?.some(h => /vol direct|vol inclòs/i.test(h))
  if (hasFlight) items.push({ icon: 'plane', label: isEs ? 'Vuelo incluido' : 'Vol inclòs' })
  items.push({ icon: 'bed', label: isEs ? 'Hotel incluido' : 'Hotel inclòs' })
  const hasMeals = trip.highlights?.some(h => /sopar|esmorzar|pensió|dinar/i.test(h))
  if (hasMeals) items.push({ icon: 'fork', label: 'Àpats inclosos' })
  return (
    <div className="ctc-includes">
      {items.map(item => (
        <span key={item.icon} className="ctc-includes-item">
          {item.icon === 'plane' ? <PlaneIcon /> : item.icon === 'bed' ? <BedIcon /> : <ForkIcon />}
          <span>{item.label}</span>
        </span>
      ))}
    </div>
  )
}

function ResultCard({ trip, isEs }) {
  const nextDep    = getNextDep(trip)
  const guaranteed = trip.departures?.some(d => d.status === 'GUARANTEED')
  const desc       = trip.tagline || null

  return (
    <motion.article className="cat-trip-card" variants={cardVariants}>
      <Link to={`/viatge/${trip.id}`} className="cat-trip-card__img-wrap">
        <div
          className={`cat-trip-card__img${trip.image ? '' : ' cat-trip-card__img--placeholder'}`}
          style={trip.image ? { backgroundImage: `url(${trip.image})` } : undefined}
        />
        {guaranteed && (
          <span className="ctc-stamp">
            {isEs ? 'Salida asegurada' : 'Sortida assegurada'}
          </span>
        )}
      </Link>
      <div className="cat-trip-card__body">
        <p className="ctc-kicker">
          {trip.country}
          {trip.duration && <><span className="ctc-sep"> · </span>{trip.duration}</>}
        </p>
        <h3 className="ctc-name">
          <Link to={`/viatge/${trip.id}`}>{trip.name}</Link>
        </h3>
        {desc && <p className="ctc-desc">{desc}</p>}
        <CardIncludes trip={trip} isEs={isEs} />
        <div className="ctc-bottom">
          {nextDep && (
            <p className="ctc-dep">
              <span className="dep-dot" />
              {isEs ? 'Próxima salida' : 'Pròxima sortida'} — <strong>{formatShortDate(nextDep.date)}</strong>
              {nextDep.status === 'GUARANTEED' && (
                <span className="dep-gtd"> · {isEs ? 'garantizada' : 'assegurada'}</span>
              )}
            </p>
          )}
          <div className="ctc-foot">
            <div className="ctc-price">
              {trip.price ? (
                <>
                  <span className="ctc-price-lbl">{isEs ? 'Desde' : 'Des de'}</span>
                  <span className="ctc-price-val">{trip.price.toLocaleString('ca')} €</span>
                </>
              ) : (
                <span className="ctc-price-consult">
                  {isEs ? 'Precio a consultar' : 'Preu a consultar'}
                </span>
              )}
            </div>
            <Link to={`/viatge/${trip.id}`} className="ctc-cta">
              {isEs ? 'Descubrir' : 'Descobrir'} <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

// ── Filter sidebar component ───────────────────────────────────────────────────
function FilterSidebar({ mes, preu, durada, onApply, lang }) {
  const isEs = lang === 'es'
  const [localMes, setLocalMes]       = useState(mes)
  const [localPreu, setLocalPreu]     = useState(preu)
  const [localDurada, setLocalDurada] = useState(durada)

  useEffect(() => { setLocalMes(mes) }, [mes])
  useEffect(() => { setLocalPreu(preu) }, [preu])
  useEffect(() => { setLocalDurada(durada) }, [durada])

  return (
    <aside className="results-sidebar">
      <h3 className="results-sidebar__title">{isEs ? 'Filtrar por' : 'Filtrar per'}</h3>

      <div className="results-sidebar__group">
        <label className="results-sidebar__label">
          {isEs ? 'Mes de salida' : 'Mes de sortida'}
        </label>
        <select className="results-sidebar__select" value={localMes} onChange={e => setLocalMes(e.target.value)}>
          <option value="">{isEs ? 'Cualquier mes' : 'Qualsevol mes'}</option>
          <option value="2026-06">{isEs ? 'Junio 2026' : 'Juny 2026'}</option>
          <option value="2026-07">{isEs ? 'Julio 2026' : 'Juliol 2026'}</option>
          <option value="2026-08">{isEs ? 'Agosto 2026' : 'Agost 2026'}</option>
          <option value="2026-09">{isEs ? 'Septiembre 2026' : 'Setembre 2026'}</option>
          <option value="2026-10">{isEs ? 'Octubre 2026' : 'Octubre 2026'}</option>
          <option value="2026-11">{isEs ? 'Noviembre 2026' : 'Novembre 2026'}</option>
          <option value="2026-12">{isEs ? 'Diciembre 2026' : 'Desembre 2026'}</option>
        </select>
      </div>

      <div className="results-sidebar__group">
        <label className="results-sidebar__label">
          {isEs ? 'Precio máximo' : 'Preu màxim'}
        </label>
        <select className="results-sidebar__select" value={localPreu} onChange={e => setLocalPreu(e.target.value)}>
          <option value="">{isEs ? 'Cualquier precio' : 'Qualsevol preu'}</option>
          <option value="1000">{isEs ? 'Hasta 1.000 €' : 'Fins 1.000 €'}</option>
          <option value="1500">{isEs ? 'Hasta 1.500 €' : 'Fins 1.500 €'}</option>
          <option value="2000">{isEs ? 'Hasta 2.000 €' : 'Fins 2.000 €'}</option>
          <option value="3000">{isEs ? 'Hasta 3.000 €' : 'Fins 3.000 €'}</option>
        </select>
      </div>

      <div className="results-sidebar__group">
        <label className="results-sidebar__label">
          {isEs ? 'Duración' : 'Durada'}
        </label>
        <select className="results-sidebar__select" value={localDurada} onChange={e => setLocalDurada(e.target.value)}>
          <option value="">{isEs ? 'Cualquier duración' : 'Qualsevol durada'}</option>
          <option value="5-">{isEs ? 'Hasta 5 días' : 'Fins 5 dies'}</option>
          <option value="6-8">6-8 {isEs ? 'días' : 'dies'}</option>
          <option value="9+">9+ {isEs ? 'días' : 'dies'}</option>
        </select>
      </div>

      <button
        className="btn btn--primary results-sidebar__apply"
        onClick={() => onApply({ mes: localMes, preu: localPreu, durada: localDurada })}
      >
        {isEs ? 'Aplicar filtros' : 'Aplicar filtres'}
      </button>
    </aside>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { lang } = useLang()
  const isEs = lang === 'es'

  const q      = searchParams.get('q')      || ''
  const mes    = searchParams.get('mes')    || ''
  const preu   = searchParams.get('preu')   || ''
  const durada = searchParams.get('durada') || ''

  const [sortBy, setSortBy]         = useState('recomanats')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(q)
  useEffect(() => { setSearchInput(q) }, [q])

  function handleSearch(e) {
    e.preventDefault()
    const next = new URLSearchParams(searchParams)
    const v = searchInput.trim()
    v ? next.set('q', v) : next.delete('q')
    setSearchParams(next)
  }

  useEffect(() => {
    document.title = q
      ? `Resultats per "${q}" — Good Travels`
      : 'Cerca de circuits — Good Travels'
    return () => { document.title = 'Good Travels — 747 Viatges' }
  }, [q])

  const filtered = useMemo(
    () => filterTrips(destinations, { q, mes, preu, durada }),
    [q, mes, preu, durada]
  )
  const sorted = useMemo(() => sortTrips(filtered, sortBy), [filtered, sortBy])

  const removeFilter = (key) => {
    const next = new URLSearchParams(searchParams)
    next.delete(key)
    setSearchParams(next)
  }

  const applyFilters = ({ mes: m, preu: p, durada: d }) => {
    const next = new URLSearchParams(searchParams)
    m ? next.set('mes', m) : next.delete('mes')
    p ? next.set('preu', p) : next.delete('preu')
    d ? next.set('durada', d) : next.delete('durada')
    setSearchParams(next)
    setDrawerOpen(false)
  }

  const MES_LABELS    = isEs ? MES_LABELS_ES    : MES_LABELS_CA
  const PREU_LBL      = isEs ? PREU_LABELS_ES   : PREU_LABELS
  const DURADA_LBL    = isEs ? DURADA_LABELS_ES : DURADA_LABELS_CA

  const activePills = [
    q      && { key: 'q',      label: q },
    mes    && { key: 'mes',    label: MES_LABELS[mes]  || mes },
    preu   && { key: 'preu',   label: PREU_LBL[preu]   || preu },
    durada && { key: 'durada', label: DURADA_LBL[durada] || durada },
  ].filter(Boolean)

  const countLabel = isEs
    ? `${sorted.length} resultado${sorted.length === 1 ? '' : 's'} encontrado${sorted.length === 1 ? '' : 's'}`
    : `${sorted.length} resultat${sorted.length === 1 ? '' : 's'} trobat${sorted.length === 1 ? '' : 's'}`

  return (
    <main className="results-page">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <section className="results-header">
        <div className="container">
          <p className="results-breadcrumb">
            <Link to="/">{isEs ? 'Inicio' : 'Inici'}</Link>
            {' › '}
            {isEs ? 'Resultados de búsqueda' : 'Resultats de cerca'}
          </p>
          <div className="results-header__row">
            <h1 className="results-title">{countLabel}</h1>
            <form className="results-searchbar" onSubmit={handleSearch}>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder={isEs ? 'Islandia, Eslovenia…' : 'Islàndia, Eslovènia…'}
                aria-label={isEs ? 'Buscar destino' : 'Cercar destinació'}
              />
              <button type="submit">
                {isEs ? 'Buscar' : 'Cercar'}
              </button>
            </form>
          </div>
          {activePills.length > 0 && (
            <div className="results-pills">
              {activePills.map(pill => (
                <button key={pill.key} className="results-pill" onClick={() => removeFilter(pill.key)}>
                  {pill.label} <span className="results-pill__x">×</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="container results-body">

        <FilterSidebar
          mes={mes} preu={preu} durada={durada}
          onApply={applyFilters} lang={lang}
        />

        <div className="results-main">

          {/* Mobile filters button */}
          <button
            className="results-mobile-filter-btn"
            onClick={() => setDrawerOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            {isEs ? 'Filtros' : 'Filtres'}
            {activePills.length > 0 && (
              <span className="results-mobile-filter-btn__badge">{activePills.length}</span>
            )}
          </button>

          {/* Sort bar */}
          <div className="results-sort-bar">
            <span className="results-sort-bar__label">
              {isEs ? 'Ordenar por:' : 'Ordenar per:'}
            </span>
            <select
              className="results-sort-bar__select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="recomanats">{isEs ? 'Recomendados' : 'Recomanats'}</option>
              <option value="preu-asc">{isEs ? 'Precio: menor a mayor' : 'Preu: menor a major'}</option>
              <option value="preu-desc">{isEs ? 'Precio: mayor a menor' : 'Preu: major a menor'}</option>
              <option value="durada-asc">{isEs ? 'Duración: menos días primero' : 'Durada: menys dies primer'}</option>
            </select>
          </div>

          {/* Grid or empty state */}
          {sorted.length === 0 ? (
            <div className="results-empty">
              <svg className="results-empty__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
              <h2 className="results-empty__title">
                {isEs ? 'No hemos encontrado ningún circuit' : 'No hem trobat cap circuit'}
              </h2>
              <p className="results-empty__sub">
                {isEs ? 'Prueba con otros filtros o ' : 'Prova amb altres filtres o '}
                <Link to="/" className="results-empty__link">
                  {isEs ? 'explora todos los destinos' : 'explora tots els destins'}
                </Link>
              </p>
            </div>
          ) : (
            <motion.div
              className="results-grid"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
            >
              {sorted.map(trip => (
                <ResultCard key={trip.id} trip={trip} isEs={isEs} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="results-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="results-drawer" onClick={e => e.stopPropagation()}>
            <div className="results-drawer__header">
              <span>{isEs ? 'Filtros' : 'Filtres'}</span>
              <button className="results-drawer__close" onClick={() => setDrawerOpen(false)}>×</button>
            </div>
            <FilterSidebar
              mes={mes} preu={preu} durada={durada}
              onApply={applyFilters} lang={lang}
            />
          </div>
        </div>
      )}

    </main>
  )
}
