import { useParams, Link } from 'react-router-dom'
import { destinations } from '../data/destinations'

export default function BookingPage() {
  const { id } = useParams()
  const trip = destinations.find(d => d.id === id)

  return (
    <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="container">
        <p className="section-tag">Reserva</p>
        <h1 className="section-title">{trip ? trip.name : 'Reserva el teu viatge'}</h1>
        <p style={{ color: 'var(--color-text-light)', marginTop: '16px' }}>
          Formulari de reserva pendent de desenvolupar. De moment, contacta'ns directament.
        </p>
        <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
          <Link to="/contacte" className="btn btn--primary">Contactar</Link>
          <Link to={trip ? `/viatge/${trip.id}` : '/'} className="btn btn--outline">Tornar enrere</Link>
        </div>
      </div>
    </main>
  )
}
