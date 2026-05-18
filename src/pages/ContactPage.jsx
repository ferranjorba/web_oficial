import { useState } from 'react'
import './ContactPage.css'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSent(false); e.target.reset() }, 3000)
  }

  return (
    <main className="contact-page">
      <div className="contact-page__hero">
        <div className="container">
          <p className="section-tag">Parla amb nosaltres</p>
          <h1 className="section-title" style={{ color: 'white' }}>Comencem a planificar<br />el teu viatge</h1>
        </div>
      </div>

      <section className="contact">
        <div className="container contact__grid">
          <div className="contact__info">
            <p>El nostre equip d'experts t'assessorarà sense compromís per dissenyar el viatge perfecte per a tu.</p>
            <div className="contact__details">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div><strong>Telèfon</strong><span>+34 000 000 000</span></div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div><strong>Email</strong><span>hola@nomAgencia.com</span></div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div><strong>Oficina</strong><span>Carrer Exemple, 00 — Barcelona</span></div>
              </div>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nom</label>
                <input type="text" placeholder="El teu nom" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="correu@exemple.com" required />
              </div>
            </div>
            <div className="form-group">
              <label>Destinació d'interès</label>
              <input type="text" placeholder="On vols anar?" />
            </div>
            <div className="form-group">
              <label>Missatge</label>
              <textarea rows="4" placeholder="Explica'ns el teu viatge ideal..." />
            </div>
            <button type="submit" className="btn btn--primary btn--full">
              {sent ? 'Missatge enviat! ✓' : 'Enviar consulta'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
