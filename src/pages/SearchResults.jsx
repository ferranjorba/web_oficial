import { useSearchParams, Link } from 'react-router-dom'
import { destinations } from '../data/destinations'
import './SearchResults.css'

export default function SearchResults() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''

  const results = destinations.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.country.toLowerCase().includes(query.toLowerCase()) ||
    d.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <main className="search-page">
      <div className="search-page__header">
        <div className="container">
          <h1 className="section-title" style={{ color: 'white' }}>
            {query ? `Resultats per "${query}"` : 'Totes les destinacions'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.7)' }}>{results.length} destinacions trobades</p>
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
            <p>No hem trobat resultats per "<strong>{query}</strong>".</p>
            <Link to="/" className="btn btn--primary">Tornar a inici</Link>
          </div>
        )}
      </div>
    </main>
  )
}
