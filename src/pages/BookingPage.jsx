import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { destinations } from '../data/destinations'
import { supabase } from '../lib/supabase'
import './BookingPage.css'

function formatDate(dateStr) {
  if (!dateStr) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [, month, day] = dateStr.split('-')
    return `${day}/${month}`
  }
  return dateStr
}

export default function BookingPage() {
  const { id } = useParams()
  const trip = destinations.find(d => d.id === id)

  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [form, setForm] = useState({
    nom: '',
    cognoms: '',
    email: '',
    telefon: '',
    passatgers: '2',
    habitacio: 'doble',
    sortida: '',
    bookingOption: '',
    notes: '',
  })

  if (!trip) return (
    <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="container">
        <p style={{ marginBottom: '24px' }}>Viatge no trobat.</p>
        <Link to="/" className="btn btn--primary">Tornar a inici</Link>
      </div>
    </main>
  )

  const availableDepartures = (trip.departures || []).filter(d => d.status !== 'CLOSED')

  const roomTypes = [
    { value: 'doble', label: 'Doble', price: trip.price },
    trip.priceIndividual ? { value: 'individual', label: 'Individual', price: trip.priceIndividual } : null,
    trip.priceTriple     ? { value: 'triple',     label: 'Triple',     price: trip.priceTriple }     : null,
  ].filter(Boolean)

  const pricePerPerson = () => {
    if (!trip.price) return null
    const base = form.habitacio === 'individual'
      ? (trip.priceIndividual || trip.price)
      : form.habitacio === 'triple'
        ? (trip.priceTriple || trip.price)
        : trip.price
    const taxes      = (!trip.taxesIncluded && trip.taxesAereas) ? trip.taxesAereas : 0
    const departure  = availableDepartures.find(d => d.date === form.sortida)
    const supplement = departure?.supplement || 0
    return base + taxes + supplement
  }

  const totalPrice = () => {
    const pp = pricePerPerson()
    return pp ? pp * parseInt(form.passatgers, 10) : null
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const toIsoDate = (dateStr) => {
    if (!dateStr) return null
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
    if (/^\d{2}\/\d{2}$/.test(dateStr)) {
      const [dd, mm] = dateStr.split('/')
      return `2026-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    const { error } = await supabase.from('bookings').insert({
      user_name:   `${form.nom} ${form.cognoms}`.trim(),
      user_email:  form.email,
      phone:       form.telefon,
      destination: trip.name,
      trip_id:     trip.id,
      travel_date: toIsoDate(form.sortida),
      num_people:  parseInt(form.passatgers, 10),
      room_type:   form.habitacio,
      total_price: totalPrice() ?? 0,
      notes:       form.notes || null,
    })

    setSubmitting(false)
    if (error) {
      setSubmitError('Hi ha hagut un error. Torna-ho a intentar o contacta\'ns directament.')
      console.error(error)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <main className="booking-page">
        <div className="booking-success">
          <div className="container booking-success__inner">
            <div className="booking-success__icon">✓</div>
            <h1>Sol·licitud enviada!</h1>
            <p>
              Hem rebut la teva sol·licitud de reserva per a <strong>{trip.name}</strong>.
              El nostre equip es posarà en contacte amb tu en les properes 24 hores per confirmar
              la disponibilitat i els detalls del pagament.
            </p>
            <div className="booking-success__actions">
              <Link to={`/viatge/${trip.id}`} className="btn btn--primary">Tornar al viatge</Link>
              <Link to="/" className="btn btn--outline">Inici</Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="booking-page">

      <div className="booking-page__hero">
        <div className="container">
          <p className="section-tag">Reserva</p>
          <h1 className="section-title" style={{ color: 'white' }}>{trip.name}</h1>
          {trip.duration && (
            <p className="booking-page__subtitle">
              {trip.duration}{trip.departureCity ? ` · Sortida des de ${trip.departureCity}` : ''}
            </p>
          )}
        </div>
      </div>

      <section className="booking-section">
        <div className="container booking-grid">

          {/* ── RESUM VIATGE ─────────────────────────────────────────── */}
          <aside className="booking-summary">
            <div className="booking-summary__card">
              <p className="booking-summary__eyebrow">Resum del viatge</p>

              {trip.image && (
                <div
                  className="booking-summary__img"
                  style={{ backgroundImage: `url(${trip.image})` }}
                />
              )}

              <div className="booking-summary__info">
                {trip.duration        && <div className="bsummary-row"><span>Durada</span><strong>{trip.duration}</strong></div>}
                {trip.departureCity   && <div className="bsummary-row"><span>Sortida des de</span><strong>{trip.departureCity}</strong></div>}
                {trip.departurePeriod && <div className="bsummary-row"><span>Temporada</span><strong>{trip.departurePeriod}</strong></div>}
              </div>

              {trip.price ? (
                <div className="booking-summary__prices">
                  <p className="bprices-title">Preus per persona</p>
                  {roomTypes.map(rt => (
                    <div key={rt.value} className="bprice-row">
                      <span>{rt.label}</span>
                      <strong>{rt.price?.toLocaleString('ca')} €</strong>
                    </div>
                  ))}
                  {!trip.taxesIncluded && trip.taxesAereas && (
                    <div className="bprice-row bprice-row--taxes">
                      <span>+ Taxes aèries</span>
                      <strong>+{trip.taxesAereas} €</strong>
                    </div>
                  )}
                  {trip.taxesIncluded && (
                    <p className="bprice-taxes-note">Taxes aèries incloses</p>
                  )}
                </div>
              ) : (
                <p className="bprice-consult">Preu a consultar — el nostre equip t'informarà.</p>
              )}

              <Link to="/contacte" className="btn btn--outline btn--full" style={{ marginTop: '20px' }}>
                Tens preguntes? Contacta'ns
              </Link>
            </div>
          </aside>

          {/* ── FORMULARI ────────────────────────────────────────────── */}
          <div className="booking-form-wrap">
            <form className="booking-form" onSubmit={handleSubmit}>

              <fieldset className="booking-fieldset">
                <legend>Dades de contacte</legend>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nom">Nom</label>
                    <input
                      id="nom" name="nom" type="text"
                      value={form.nom} onChange={handleChange}
                      placeholder="El teu nom" required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cognoms">Cognoms</label>
                    <input
                      id="cognoms" name="cognoms" type="text"
                      value={form.cognoms} onChange={handleChange}
                      placeholder="Els teus cognoms" required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email" name="email" type="email"
                      value={form.email} onChange={handleChange}
                      placeholder="correu@exemple.com" required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefon">Telèfon</label>
                    <input
                      id="telefon" name="telefon" type="tel"
                      value={form.telefon} onChange={handleChange}
                      placeholder="6XX XXX XXX" required
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="booking-fieldset">
                <legend>Detalls de la reserva</legend>

                {availableDepartures.length > 0 && (
                  <div className="form-group">
                    <label htmlFor="sortida">Data de sortida</label>
                    <select
                      id="sortida" name="sortida"
                      value={form.sortida} onChange={handleChange}
                      required
                    >
                      <option value="">— Selecciona una data —</option>
                      {availableDepartures.map(d => {
                        const parts = [formatDate(d.date)]
                        if (d.status === 'GUARANTEED') parts.push('· Garantida')
                        if (d.supplement)              parts.push(`· +${d.supplement} € suplement`)
                        if (d.note)                    parts.push(`· ${d.note}`)
                        return <option key={d.date} value={d.date}>{parts.join(' ')}</option>
                      })}
                    </select>
                  </div>
                )}

                {trip.bookingOptions && (
                  <div className="form-group">
                    <label htmlFor="bookingOption">Opció de reserva</label>
                    <select
                      id="bookingOption" name="bookingOption"
                      value={form.bookingOption} onChange={handleChange}
                      required
                    >
                      <option value="">— Selecciona una opció —</option>
                      {trip.bookingOptions.circuitAndFlight && <option value="circuitAndFlight">Circuit + vol</option>}
                      {trip.bookingOptions.circuitOnly      && <option value="circuitOnly">Només circuit (sense vol)</option>}
                      {trip.bookingOptions.flightOnly       && <option value="flightOnly">Només vol</option>}
                    </select>
                  </div>
                )}

                <div className={roomTypes.length > 1 ? 'form-row' : undefined}>
                  <div className="form-group">
                    <label htmlFor="passatgers">Passatgers</label>
                    <select id="passatgers" name="passatgers" value={form.passatgers} onChange={handleChange}>
                      {[1,2,3,4,5,6,7,8].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'persones'}</option>
                      ))}
                    </select>
                  </div>

                  {roomTypes.length > 1 && (
                    <div className="form-group">
                      <label htmlFor="habitacio">Habitació</label>
                      <select id="habitacio" name="habitacio" value={form.habitacio} onChange={handleChange}>
                        {roomTypes.map(rt => (
                          <option key={rt.value} value={rt.value}>
                            {rt.label}{rt.price ? ` — ${rt.price.toLocaleString('ca')} €` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes o peticions especials</label>
                  <textarea
                    id="notes" name="notes" rows="3"
                    value={form.notes} onChange={handleChange}
                    placeholder="Dietes especials, accessibilitat, celebracions..."
                  />
                </div>
              </fieldset>

              {/* ── TOTAL ESTIMAT ──────────────────────────────────────── */}
              {trip.price && totalPrice() !== null && (
                <div className="booking-total">
                  <div className="booking-total__row">
                    <span>Preu per persona (hab. {form.habitacio})</span>
                    <span>{pricePerPerson()?.toLocaleString('ca')} €</span>
                  </div>
                  <div className="booking-total__row booking-total__row--total">
                    <strong>Total estimat ({form.passatgers} {parseInt(form.passatgers) === 1 ? 'persona' : 'persones'})</strong>
                    <strong>{totalPrice()?.toLocaleString('ca')} €</strong>
                  </div>
                  <p className="booking-total__note">
                    Preu orientatiu. La reserva es confirmarà un cop verificada la disponibilitat.
                  </p>
                </div>
              )}

              {submitError && (
                <p className="booking-form__error">{submitError}</p>
              )}

              <button type="submit" disabled={submitting} className="btn btn--primary btn--full booking-submit">
                {submitting ? 'Enviant...' : 'Enviar sol·licitud de reserva'}
              </button>

              <p className="booking-form__disclaimer">
                En enviar aquest formulari, el nostre equip es posarà en contacte amb tu per confirmar
                la disponibilitat i els detalls del pagament. Sense cap compromís.
              </p>
            </form>
          </div>

        </div>
      </section>
    </main>
  )
}
