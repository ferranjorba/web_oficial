import { useParams, Link } from 'react-router-dom'
import { destinations } from '../data/destinations'
import './TripDetail.css'

function formatDate(dateStr) {
  if (!dateStr) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [, month, day] = dateStr.split('-')
    return `${day}/${month}`
  }
  return dateStr
}

export default function TripDetail() {
  const { id } = useParams()
  const trip = destinations.find(d => d.id === id)

  if (!trip) return (
    <main className="trip-not-found">
      <p>Viatge no trobat.</p>
      <Link to="/" className="btn btn--primary">Tornar a inici</Link>
    </main>
  )

  return (
    <main className="trip-detail">

      {/* HERO */}
      <div className="trip-detail__hero">
        <div
          className="trip-detail__hero-img"
          style={trip.image ? { backgroundImage: `url(${trip.image})` } : undefined}
        />
        <div className="trip-detail__hero-overlay" />
        <div className="container trip-detail__hero-content">
          <p className="trip-detail__country">{trip.country}{trip.duration ? ` · ${trip.duration}` : ''}</p>
          <h1>{trip.name}</h1>
          <p className="trip-detail__tagline">{trip.tagline}</p>
          <div className="trip-detail__hero-meta">
            <span>✈ {trip.departureCity}</span>
            <span>📅 {trip.departureDays}</span>
            {trip.duration && <span>⏱ {trip.duration}</span>}
            {trip.hotelCategory && <span>🏨 {trip.hotelCategory}</span>}
            {trip.meals && <span>🍽️ {trip.meals}</span>}
          </div>
        </div>
      </div>

      {/* HIGHLIGHTS */}
      {(trip.highlights?.length > 0 || trip.scenicRoutes?.length > 0) && (
        <div className="trip-detail__highlights">
          <div className="container">
            {trip.highlights?.map(h => (
              <div key={h} className="highlight-item">
                <span className="highlight-check">✓</span>
                <span>{h}</span>
              </div>
            ))}
            {trip.scenicRoutes?.map(r => (
              <div key={r} className="highlight-item">
                <span className="highlight-check highlight-check--route">🛤</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BODY */}
      <div className="container trip-detail__body">

        {/* MAIN CONTENT */}
        <div className="trip-detail__main">

          {/* PER QUÈ AQUEST CIRCUIT */}
          {trip.whyThisTour?.length > 0 && (
            <section className="trip-section">
              <h2>Per què aquest circuit</h2>
              <div className="why-grid">
                {trip.whyThisTour.map(w => (
                  <div key={w.title} className="why-card">
                    <h3>{w.title}</h3>
                    <p>{w.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ITINERARI */}
          {trip.itinerary?.length > 0 && (
            <section className="trip-section">
              <h2>Itinerari dia a dia</h2>
              <div className="itinerary">
                {trip.itinerary.map(day => (
                  <div key={day.day} className="itinerary__day">
                    <div className="itinerary__day-num">
                      <span>Dia</span>
                      <strong>{day.day}</strong>
                    </div>
                    <div className="itinerary__day-content">
                      <h3>{day.title}{day.km ? <span className="itinerary__km">{day.km} km</span> : null}</h3>
                      <p>{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* QUÈ INCLOU */}
          {trip.included?.length > 0 && (
            <section className="trip-section">
              <h2>Què inclou</h2>
              <ul className="trip-list trip-list--included">
                {trip.included.map(item => (
                  <li key={item}><span className="check-green">✓</span> {item}</li>
                ))}
              </ul>
              {trip.notIncluded?.length > 0 && (
                <>
                  <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>No inclou</h3>
                  <ul className="trip-list trip-list--excluded">
                    {trip.notIncluded.map(item => (
                      <li key={item}><span className="check-red">✕</span> {item}</li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}

          {/* OPCIONALS */}
          {trip.optional?.length > 0 && (
            <section className="trip-section">
              <h2>Activitats opcionals</h2>
              {trip.optional.map(opt => (
                <div key={opt.name} className="optional-card">
                  <div>
                    <strong>{opt.name}</strong>
                    <p>{opt.description}</p>
                  </div>
                  <span className="optional-price">{opt.price}€ / persona</span>
                </div>
              ))}
            </section>
          )}

          {/* NOTES */}
          {trip.notes?.length > 0 && (
            <section className="trip-section trip-section--notes">
              <h2>Notes importants</h2>
              <ul>
                {trip.notes.map(note => (
                  <li key={note}>• {note}</li>
                ))}
              </ul>
            </section>
          )}

          {/* PRÒXIMAMENT (quan no hi ha contingut) */}
          {!trip.itinerary?.length && !trip.included?.length && (
            <section className="trip-section trip-section--coming-soon">
              <p>La informació detallada d'aquest circuit estarà disponible properament.</p>
              <Link to="/contacte" className="btn btn--primary" style={{ marginTop: '16px', display: 'inline-block' }}>
                Demanar informació
              </Link>
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="trip-detail__sidebar">
          <div className="trip-booking-card">
            <p className="trip-booking-card__label">Preu per persona</p>
            <div className="trip-booking-card__prices">
              {trip.price ? (
                <>
                  <div className="price-row price-row--main">
                    <span>Doble</span>
                    <strong>{trip.price.toLocaleString('ca')}€</strong>
                  </div>
                  {trip.priceIndividual && (
                    <div className="price-row">
                      <span>Individual</span>
                      <span>{trip.priceIndividual.toLocaleString('ca')}€</span>
                    </div>
                  )}
                  {trip.priceTriple && (
                    <div className="price-row">
                      <span>Triple</span>
                      <span>{trip.priceTriple.toLocaleString('ca')}€ <em>(sota petició)</em></span>
                    </div>
                  )}
                  {trip.taxesAereas && (
                    <div className="price-row price-row--taxes">
                      <span>+ Taxes aèries</span>
                      <span>{trip.taxesAereas}€</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="price-row price-row--consult">
                  <span>Preu a consultar</span>
                </div>
              )}
            </div>

            <Link to={`/reserva/${trip.id}`} className="btn btn--primary btn--full">Reservar ara</Link>
            <Link to="/contacte" className="btn btn--outline btn--full" style={{ marginTop: '12px' }}>Demanar informació</Link>

            {/* VOL */}
            {trip.flight && (
              <div className="trip-flight-info">
                <h4>Informació del vol</h4>
                <p className="flight-airline">{trip.flight.airline}</p>
                <div className="flight-leg">
                  <span className="flight-route">{trip.flight.anada.origen} → {trip.flight.anada.desti}</span>
                  <span className="flight-times">{trip.flight.anada.sortida} – {trip.flight.anada.arribada}</span>
                  <span className="flight-number">Vol {trip.flight.anada.vol}</span>
                </div>
                <div className="flight-leg">
                  <span className="flight-route">{trip.flight.tornada.origen} → {trip.flight.tornada.desti}</span>
                  <span className="flight-times">{trip.flight.tornada.sortida} – {trip.flight.tornada.arribada}</span>
                  <span className="flight-number">Vol {trip.flight.tornada.vol}</span>
                </div>
                <p className="flight-season">{trip.flight.temporada}</p>
              </div>
            )}

            {/* SORTIDES */}
            <div className="trip-departures">
              <h4>Sortides 2026</h4>
              <div className="departures-list">
                {trip.departures.map(d => {
                  const isLegacy = d.status === undefined
                  const isClosed = d.status === 'CLOSED'
                  return (
                    <div
                      key={d.date}
                      className={`departure-item ${isLegacy && d.noAirQuota ? 'no-quota' : ''} ${isClosed ? 'is-closed' : ''}`}
                    >
                      <span className="departure-date">{formatDate(d.date)}</span>
                      {isLegacy && d.supplement > 0 && (
                        <span className="departure-supplement">+{d.supplement}€</span>
                      )}
                      {isLegacy && d.noAirQuota && (
                        <span className="departure-tag">Sense quotes aèries</span>
                      )}
                      {!isLegacy && (
                        <span className={`departure-status ${isClosed ? 'status-closed' : 'status-open'}`}>
                          {isClosed ? 'Complet' : 'Disponible'}
                        </span>
                      )}
                      {d.flightStatus === 'OPEN' && isClosed && (
                        <span className="departure-flight-open">Vol disponible</span>
                      )}
                      {d.note && <span className="departure-note">{d.note}</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* GARANTIA SORTIDES */}
            {trip.minParticipants && (
              <p className="trip-booking-card__guarantee">
                Sortida garantida amb un mínim de {trip.minParticipants} passatgers
                {trip.maxParticipants ? ` · Màxim ${trip.maxParticipants} places` : ''}
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}
