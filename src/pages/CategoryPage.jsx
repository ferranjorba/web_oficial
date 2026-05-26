import { Link, useParams } from 'react-router-dom'
import { destinations, SUBCATS } from '../data/destinations'
import './SearchResults.css'
import './CategoryPage.css'

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

const OLD_CAT_LABELS = { europa: 'Europa', asia: 'Àsia', america: 'Amèrica', africa: 'Àfrica', oceania: 'Oceania' }

export default function CategoryPage() {
  const { cat } = useParams()

  let results, label, desc
  if (SUBCATS[cat]) {
    const catData = SUBCATS[cat]
    label   = catData.label
    desc    = catData.desc
    results = catData.ids.map(id => destinations.find(d => d.id === id)).filter(Boolean)
  } else {
    label   = OLD_CAT_LABELS[cat] || cat
    desc    = null
    results = destinations.filter(d => d.category === cat)
  }

  return (
    <main className="search-page">
      <div className="search-page__header">
        <div className="container">
          <p className="section-tag" style={{ color: 'rgba(255,255,255,.4)' }}>Destinacions</p>
          <h1 className="section-title" style={{ color: 'var(--color-white)' }}>{label}</h1>
          {desc && (
            <p style={{ color: 'rgba(255,255,255,.55)', marginTop: '10px', maxWidth: '500px', lineHeight: 1.7 }}>
              {desc}
            </p>
          )}
          <p style={{ color: 'rgba(255,255,255,.3)', marginTop: '16px', fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {results.length} circuit{results.length !== 1 ? 's' : ''} disponible{results.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container search-page__grid">
        {results.length > 0 ? results.map(trip => (
          <article key={trip.id} className="cat-trip-card">
            <Link to={`/viatge/${trip.id}`} className="cat-trip-card__img-wrap">
              <div
                className={`cat-trip-card__img${trip.image ? '' : ' cat-trip-card__img--placeholder'}`}
                style={trip.image ? { backgroundImage: `url(${trip.image})` } : undefined}
              />
              {hasGuaranteed(trip) && (
                <span className="ctc-stamp">Sortida assegurada</span>
              )}
            </Link>

            <div className="cat-trip-card__body">
              <p className="ctc-kicker">
                {trip.country}
                {trip.duration && <><span className="ctc-sep">·</span>{trip.duration}</>}
              </p>
              <h3 className="ctc-name">
                <Link to={`/viatge/${trip.id}`}>{trip.name}</Link>
              </h3>
              {trip.description && <p className="ctc-desc">{trip.description}</p>}

              {(() => {
                const next = getNextDep(trip)
                return next ? (
                  <p className="ctc-dep">
                    <span className="dep-dot" />
                    Pròxima sortida — <strong>{formatShortDate(next.date)}</strong>
                    {next.status === 'GUARANTEED' && <span className="dep-gtd"> · assegurada</span>}
                  </p>
                ) : null
              })()}

              <div className="ctc-foot">
                <div className="ctc-price">
                  {trip.price ? (
                    <>
                      <span className="ctc-price-lbl">Des de</span>
                      <span className="ctc-price-val">{trip.price.toLocaleString('ca')} €</span>
                    </>
                  ) : (
                    <span className="ctc-price-consult">Preu a consultar</span>
                  )}
                </div>
                <Link to={`/viatge/${trip.id}`} className="ctc-cta">
                  Descobrir <span>→</span>
                </Link>
              </div>
            </div>
          </article>
        )) : (
          <div className="search-page__empty">
            <p style={{ fontSize: '1rem', color: 'var(--color-text-light)' }}>
              Aviat afegirem circuits a {label}.
            </p>
            <Link to="/" className="btn btn--primary" style={{ marginTop: '8px' }}>Tornar a inici</Link>
          </div>
        )}
      </div>
    </main>
  )
}
