import { useSearchParams, Link } from 'react-router-dom'
import { destinations } from '../data/destinations'
import './SearchResults.css'

const MONTHS_CA = ['gen','feb','mar','abr','mai','jun','jul','ago','set','oct','nov','des']

function normalitza(str) {
  if (!str) return ''
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

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

export default function SearchResults() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const q = normalitza(query.trim())

  const results = q
    ? destinations.filter(d =>
        normalitza(d.name).includes(q) ||
        normalitza(d.country).includes(q) ||
        normalitza(d.category).includes(q) ||
        normalitza(d.tagline || '').includes(q) ||
        normalitza(d.description || '').includes(q)
      )
    : destinations

  return (
    <main className="search-page">
      <div className="search-page__header">
        <div className="container">
          <p className="section-tag" style={{ color: 'rgba(255,255,255,.6)' }}>Cerca</p>
          <h1 className="section-title" style={{ color: 'white' }}>
            {query ? `Resultats per "${query}"` : 'Totes les destinacions'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.6)', marginTop: '8px' }}>
            {results.length} {results.length === 1 ? 'viatge trobat' : 'viatges trobats'}
          </p>
        </div>
      </div>

      <div className="container search-page__grid">
        {results.length > 0 ? results.map(trip => {
          const nextDep = getNextDep(trip)
          const guaranteed = trip.departures?.some(d => d.status === 'GUARANTEED')
          return (
            <article key={trip.id} className="trip-card">
              <Link to={`/viatge/${trip.id}`} className="trip-card__img-wrap">
                <div
                  className={`trip-card__img${trip.image ? '' : ' trip-card__img--placeholder'}`}
                  style={trip.image ? { backgroundImage: `url(${trip.image})` } : undefined}
                />
                {guaranteed && <span className="trip-card__stamp">Sortida assegurada</span>}
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
        }) : (
          <div className="search-page__empty">
            <p>No hem trobat resultats per "<strong>{query}</strong>".</p>
            <p style={{ fontSize: '.9rem', color: 'var(--color-text-light)', marginTop: '-12px' }}>
              Prova amb un altre terme o{' '}
              <Link to="/contacte" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                parla amb nosaltres
              </Link>
              .
            </p>
            <Link to="/" className="btn btn--primary">Tornar a inici</Link>
          </div>
        )}
      </div>
    </main>
  )
}
