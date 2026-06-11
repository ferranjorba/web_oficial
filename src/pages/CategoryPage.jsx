import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { destinations, SUBCATS } from '../data/destinations'
import { useLang } from '../context/LangContext'
import './SearchResults.css'
import './CategoryPage.css'

const EASE = [0.25, 0.1, 0.25, 1]
const cardContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}
const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
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

const OLD_CAT_LABELS    = { europa: 'Europa', asia: 'Àsia', america: 'Amèrica', africa: 'Àfrica', oceania: 'Oceania' }
const OLD_CAT_LABELS_ES = { europa: 'Europa', asia: 'Asia', america: 'América', africa: 'África', oceania: 'Oceanía' }

export default function CategoryPage() {
  const { cat } = useParams()
  const { lang } = useLang()
  const isEs = lang === 'es'

  let results, label, desc
  if (SUBCATS[cat]) {
    const catData = SUBCATS[cat]
    label   = isEs ? (catData.label_es || catData.label) : catData.label
    desc    = isEs ? (catData.desc_es  || catData.desc)  : catData.desc
    results = catData.ids.map(id => destinations.find(d => d.id === id)).filter(Boolean)
  } else {
    label   = (isEs ? OLD_CAT_LABELS_ES[cat] : OLD_CAT_LABELS[cat]) || cat
    desc    = null
    results = destinations.filter(d => d.category === cat)
  }

  const countText = isEs
    ? `${results.length} circuito${results.length !== 1 ? 's' : ''} disponible${results.length !== 1 ? 's' : ''}`
    : `${results.length} circuit${results.length !== 1 ? 's' : ''} disponible${results.length !== 1 ? 's' : ''}`

  return (
    <main className="search-page">

      {/* Header */}
      <div className="search-page__header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <p className="section-tag" style={{ color: 'var(--color-primary)' }}>
              {isEs ? 'Destinos' : 'Destinacions'}
            </p>
            <h1 className="section-title" style={{ color: '#fff' }}>{label}</h1>
            {desc && (
              <p style={{ color: 'rgba(255,255,255,.55)', marginTop: '10px', maxWidth: '520px', lineHeight: 1.75, fontSize: '1rem' }}>
                {desc}
              </p>
            )}
            <p style={{ color: 'rgba(255,255,255,.3)', marginTop: '18px', fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase' }}>
              {countText}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        className="container search-page__grid"
        variants={cardContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {results.length > 0 ? results.map(trip => (
          <CategoryCard key={trip.id} trip={trip} isEs={isEs} />
        )) : (
          <div className="search-page__empty">
            <p>{isEs ? `Pronto añadiremos circuitos a ${label}.` : `Aviat afegirem circuits a ${label}.`}</p>
            <Link to="/" className="btn btn--primary">
              {isEs ? 'Volver al inicio' : 'Tornar a inici'}
            </Link>
          </div>
        )}
      </motion.div>
    </main>
  )
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
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
)
function CardIncludes({ trip, isEs }) {
  const items = []
  const hasFlight = trip.includesFlight || trip.highlights?.some(h => /vol direct|vol inclòs/i.test(h))
  if (hasFlight) items.push({ icon: 'plane', label: isEs ? 'Vuelo incluido' : 'Vol inclòs' })
  items.push({ icon: 'bed', label: isEs ? 'Hotel incluido' : 'Hotel inclòs' })
  const hasMeals = trip.highlights?.some(h => /sopar|esmorzar|pensió|dinar/i.test(h))
  if (hasMeals) items.push({ icon: 'fork', label: isEs ? 'Àpats inclosos' : 'Àpats inclosos' })
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
function CategoryCard({ trip, isEs }) {
  const nextDep    = getNextDep(trip)
  const guaranteed = hasGuaranteed(trip)
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
