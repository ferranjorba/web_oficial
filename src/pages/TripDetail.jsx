import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  IconPlane, IconBuilding, IconToolsKitchen2, IconUserCheck,
  IconAward, IconMapPin, IconCamera, IconBus, IconTree,
  IconAnchor, IconCircleCheck,
} from '@tabler/icons-react'
import { destinations } from '../data/destinations'
import './TripDetail.css'

const EASE = [0.25, 0.1, 0.25, 1]
const itinContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const itinItemVariants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
}
const hlContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const hlCardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

function pickHlIcon(text) {
  const t = text.toLowerCase()
  if (/vol\b|aeroport|xàrter|charter/.test(t))                          return IconPlane
  if (/vaixell|ferry|creuer|naveg|travess|adriàtic/.test(t))            return IconAnchor
  if (/hotel|allotjament/.test(t))                                       return IconBuilding
  if (/dinar|àpat|sopar|degustació|menú|cuina|gastro/.test(t))          return IconToolsKitchen2
  if (/guia|acompany/.test(t))                                           return IconUserCheck
  if (/unesco|patrimoni/.test(t))                                        return IconAward
  if (/parc nacional|natura|llac\b|bosc|paisatge|jardí/.test(t))        return IconTree
  if (/autocar|trasllat|transport/.test(t))                              return IconBus
  if (/muralles|castell|fortalesa|palau|cova|museu|visita|catedral|basílica|temple|monument/.test(t)) return IconCamera
  if (/capital|ciutat|vila|poble|barri|port/.test(t))                   return IconMapPin
  return IconCircleCheck
}

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

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="trip-detail__hero">
        <div
          className="trip-detail__hero-img"
          style={trip.image ? { backgroundImage: `url(${trip.image})` } : undefined}
        />
        <div className="trip-detail__hero-overlay" />
        <motion.div
          className="container trip-detail__hero-content"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
        >
          <p className="trip-detail__eyebrow">
            {trip.country}{trip.duration ? <><span className="eyebrow-sep">·</span>{trip.duration}</> : ''}
          </p>
          <h1>{trip.name}</h1>
          {trip.tagline && <p className="trip-detail__tagline">{trip.tagline}</p>}
          <div className="trip-detail__hero-chips">
            {trip.departureCity  && <span>{trip.departureCity}</span>}
            {trip.departureDays  && <span>{trip.departureDays}</span>}
            {trip.hotelCategory  && <span>{trip.hotelCategory}</span>}
            {trip.meals          && <span>{trip.meals}</span>}
          </div>
        </motion.div>
      </div>

      {/* ── HIGHLIGHTS ───────────────────────────────────────────────────── */}
      {(trip.highlights?.length > 0 || trip.scenicRoutes?.length > 0) && (
        <div className="trip-detail__highlights">
          <div className="container trip-detail__highlights-inner">
            <p className="hl-label">Què inclou el viatge</p>
            <motion.div
              className="hl-grid"
              variants={hlContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {trip.highlights?.map(h => {
                const Icon = pickHlIcon(h)
                return (
                  <motion.div key={h} className="hl-card" variants={hlCardVariants}>
                    <Icon size={20} className="hl-card__icon" aria-hidden="true" />
                    <span className="hl-card__text">{h}</span>
                  </motion.div>
                )
              })}
              {trip.scenicRoutes?.map(r => {
                const Icon = pickHlIcon(r)
                return (
                  <motion.div key={r} className="hl-card hl-card--route" variants={hlCardVariants}>
                    <Icon size={20} className="hl-card__icon" aria-hidden="true" />
                    <span className="hl-card__text">{r}</span>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      )}

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="container trip-detail__body">

        {/* ── MAIN ─────────────────────────────────────────────────────── */}
        <div className="trip-detail__main">

          {/* PER QUÈ AQUEST CIRCUIT */}
          {trip.whyThisTour?.length > 0 && (
            <section className="trip-section">
              <h2 className="trip-section__title">Per què aquest circuit</h2>
              <div className="why-grid">
                {trip.whyThisTour.map((w, i) => (
                  <div key={w.title} className="why-card">
                    <span className="why-card__num">{String(i + 1).padStart(2,'0')}</span>
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
              <h2 className="trip-section__title">Itinerari dia a dia</h2>
              <motion.div
                className="itinerary"
                variants={itinContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
              >
                {trip.itinerary.map(day => (
                  <motion.div key={day.day} className="itinerary__day" variants={itinItemVariants}>
                    <div className="itinerary__day-num">
                      <span className="day-label">Dia</span>
                      <strong className="day-number">{day.day}</strong>
                    </div>
                    <div className="itinerary__day-content">
                      <h3>
                        {day.title}
                        {day.km && <span className="itinerary__km">{day.km} km</span>}
                      </h3>
                      <p>{day.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {/* QUÈ INCLOU */}
          {trip.included?.length > 0 && (
            <section className="trip-section">
              <h2 className="trip-section__title">Què inclou</h2>
              <ul className="trip-list trip-list--included">
                {trip.included.map(item => (
                  <li key={item}>
                    <span className="list-check" />
                    {item}
                  </li>
                ))}
              </ul>
              {trip.notIncluded?.length > 0 && (
                <>
                  <h3 className="trip-subheading">No inclou</h3>
                  <ul className="trip-list trip-list--excluded">
                    {trip.notIncluded.map(item => (
                      <li key={item}>
                        <span className="list-cross" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}

          {/* OPCIONALS */}
          {trip.optional?.length > 0 && (
            <section className="trip-section">
              <h2 className="trip-section__title">Activitats opcionals</h2>
              <div className="optional-list">
                {trip.optional.map(opt => (
                  <div key={opt.name} className="optional-card">
                    <div className="optional-card__info">
                      <strong>{opt.name}</strong>
                      <p>{opt.description}</p>
                    </div>
                    <div className="optional-card__price">
                      <span className="opt-price-label">Des de</span>
                      <span className="opt-price-value">{opt.price} €</span>
                      <span className="opt-price-unit">/ persona</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* NOTES */}
          {trip.notes?.length > 0 && (
            <section className="trip-section trip-section--notes">
              <h2 className="trip-section__title">Notes importants</h2>
              <ul className="notes-list">
                {trip.notes.map(note => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>
          )}

          {/* PRÒXIMAMENT */}
          {!trip.itinerary?.length && !trip.included?.length && (
            <section className="trip-section trip-section--coming-soon">
              <p>La informació detallada d'aquest circuit estarà disponible properament.</p>
              <Link to="/contacte" className="btn btn--primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
                Demanar informació
              </Link>
            </section>
          )}
        </div>

        {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
        <motion.aside
          className="trip-detail__sidebar"
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
        >
          <div className="booking-card">

            {/* Preu */}
            <div className="booking-card__price-block">
              <p className="booking-card__price-label">Preu per persona</p>
              {trip.price ? (
                <>
                  <div className="booking-price-main">
                    <span className="booking-price-type">Habitació doble</span>
                    <span className="booking-price-value">{trip.price.toLocaleString('ca')} €</span>
                  </div>
                  {trip.priceIndividual && (
                    <div className="booking-price-row">
                      <span>Individual</span>
                      <span>{trip.priceIndividual.toLocaleString('ca')} €</span>
                    </div>
                  )}
                  {trip.priceTriple && (
                    <div className="booking-price-row">
                      <span>Triple</span>
                      <span>{trip.priceTriple.toLocaleString('ca')} € <em>sota petició</em></span>
                    </div>
                  )}
                  {trip.taxesAereas && !trip.taxesIncluded && (
                    <div className="booking-price-row booking-price-row--taxes">
                      <span>+ Taxes aèries</span>
                      <span>{trip.taxesAereas} €</span>
                    </div>
                  )}
                  {trip.taxesIncluded && (
                    <p className="booking-taxes-note">Taxes aèries incloses</p>
                  )}
                </>
              ) : (
                <p className="booking-price-consult">Preu a consultar</p>
              )}
            </div>

            {/* CTA */}
            <div className="booking-card__ctas">
              <Link to={`/reserva/${trip.id}`} className="btn btn--primary btn--full">
                Reservar ara
              </Link>
              <Link to="/contacte" className="btn btn--outline btn--full">
                Demanar informació
              </Link>
            </div>

            {/* Vol */}
            {trip.flight && (
              <div className="booking-card__section">
                <h4 className="booking-card__section-title">Vol inclòs</h4>
                <p className="flight-airline">{trip.flight.airline}</p>
                <div className="flight-leg">
                  <span className="flight-route">{trip.flight.anada.origen} → {trip.flight.anada.desti}</span>
                  <span className="flight-detail">{trip.flight.anada.sortida} – {trip.flight.anada.arribada} · {trip.flight.anada.vol}</span>
                </div>
                <div className="flight-leg">
                  <span className="flight-route">{trip.flight.tornada.origen} → {trip.flight.tornada.desti}</span>
                  <span className="flight-detail">{trip.flight.tornada.sortida} – {trip.flight.tornada.arribada} · {trip.flight.tornada.vol}</span>
                </div>
                <p className="flight-season">{trip.flight.temporada}</p>
              </div>
            )}

            {/* Sortides */}
            <div className="booking-card__section">
              <h4 className="booking-card__section-title">Sortides 2026</h4>
              <div className="departures-list">
                {trip.departures.map(d => {
                  const isLegacy = d.status === undefined
                  const isClosed = d.status === 'CLOSED'
                  const isGuaranteed = d.status === 'GUARANTEED'
                  return (
                    <div
                      key={d.date}
                      className={`dep-item${isClosed ? ' dep-item--closed' : ''}${isLegacy && d.noAirQuota ? ' dep-item--no-quota' : ''}`}
                    >
                      <span className="dep-date">{formatDate(d.date)}</span>
                      <span className="dep-right">
                        {isLegacy && d.supplement > 0 && (
                          <span className="dep-supplement">+{d.supplement}€</span>
                        )}
                        {isLegacy && d.noAirQuota && (
                          <span className="dep-tag">Sense quotes aèries</span>
                        )}
                        {!isLegacy && (
                          <span className={`dep-status${isClosed ? ' dep-status--closed' : isGuaranteed ? ' dep-status--guaranteed' : ' dep-status--open'}`}>
                            {isClosed ? 'Complet' : isGuaranteed ? 'Garantida' : 'Disponible'}
                          </span>
                        )}
                        {d.flightStatus === 'OPEN' && isClosed && (
                          <span className="dep-flight-open">Vol lliure</span>
                        )}
                      </span>
                      {d.note && <span className="dep-note">{d.note}</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Garantia */}
            {trip.minParticipants && (
              <p className="booking-card__guarantee">
                Sortida garantida des de {trip.minParticipants} passatgers
                {trip.maxParticipants ? ` · Màxim ${trip.maxParticipants} places` : ''}
              </p>
            )}

          </div>
        </motion.aside>
      </div>
    </main>
  )
}
