import { useParams, Link } from 'react-router-dom'
import { destinations } from '../data/destinations'
import './SearchResults.css'

const CAT_LABELS = { europa: 'Europa', asia: 'Àsia', america: 'Amèrica', africa: 'Àfrica', oceania: 'Oceania' }

export default function CategoryPage() {
  const { cat } = useParams()
  const results = destinations.filter(d => d.category === cat)
  const label = CAT_LABELS[cat] || cat

  return (
    <main className="search-page">
      <div className="search-page__header">
        <div className="container">
          <p className="section-tag" style={{ color: 'var(--color-gold)' }}>Destinacions</p>
          <h1 className="section-title" style={{ color: 'white' }}>{label}</h1>
          <p style={{ color: 'rgba(255,255,255,.7)' }}>{results.length} destinacions disponibles</p>
        </div>
      </div>
      <div className="container search-page__grid">
        {results.length > 0 ? results.map(dest => (
          <article key={dest.id} className="dest-card">
            <div className="dest-card__img dest-card__img--placeholder" />
            <div className="dest-card__info">
              <div className="dest-card__meta">
                <span className="dest-card__country">{dest.country}</span>
                <span className="dest-card__rating">★ {dest.rating}</span>
              </div>
              <h3 className="dest-card__name">{dest.name}</h3>
              <p className="dest-card__desc">{dest.description}</p>
              <div className="dest-card__footer">
                <span className="dest-card__price">Des de <strong>{dest.price}€</strong></span>
                <Link to={`/viatge/${dest.id}`} className="btn btn--sm btn--primary">Descobrir</Link>
              </div>
            </div>
          </article>
        )) : (
          <div className="search-page__empty">
            <p>Aviat afegirem destinacions a {label}.</p>
            <Link to="/" className="btn btn--primary">Tornar a inici</Link>
          </div>
        )}
      </div>
    </main>
  )
}
