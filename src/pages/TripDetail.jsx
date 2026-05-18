import { useParams, Link } from 'react-router-dom'
import { destinations } from '../data/destinations'
import './TripDetail.css'

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
      <div className="trip-detail__hero">
        <div className="trip-detail__hero-img" />
        <div className="trip-detail__hero-overlay" />
        <div className="container trip-detail__hero-content">
          <span className="dest-card__country">{trip.country}</span>
          <h1>{trip.name}</h1>
          <p>{trip.description}</p>
          <div className="trip-detail__rating">★ {trip.rating} · Molt recomanat</div>
        </div>
      </div>

      <div className="container trip-detail__body">
        <div className="trip-detail__main">
          <h2>Sobre aquest viatge</h2>
          <p>Aquí aniria la descripció completa del viatge, l'itinerari dia a dia, inclòs i exclòs, etc. Tot pendent d'omplir amb el contingut real.</p>
          <h3>Itinerari</h3>
          <p>Contingut de l'itinerari pendent.</p>
        </div>
        <aside className="trip-detail__sidebar">
          <div className="trip-booking-card">
            <div className="trip-booking-card__price">Des de <strong>{trip.price}€</strong> <span>per persona</span></div>
            <Link to={`/reserva/${trip.id}`} className="btn btn--primary btn--full">Reservar ara</Link>
            <Link to="/contacte" className="btn btn--outline btn--full" style={{ marginTop: '12px' }}>Demanar info</Link>
          </div>
        </aside>
      </div>
    </main>
  )
}
