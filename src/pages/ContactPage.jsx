import { useState } from 'react'
import { useLang } from '../context/LangContext'
import './ContactPage.css'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const { t } = useLang()

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSent(false); e.target.reset() }, 3000)
  }

  return (
    <main className="contact-page">
      <div className="contact-page__hero">
        <div className="container">
          <p className="section-tag">{t('contact.tag')}</p>
          <h1 className="section-title" style={{ color: 'white' }}>
            {t('contact.title').split('\n').map((l, i) => (
              <span key={i}>{l}{i === 0 && <br />}</span>
            ))}
          </h1>
        </div>
      </div>

      <section className="contact">
        <div className="container contact__grid">
          <div className="contact__info">
            <p>{t('contact.desc')}</p>
            <div className="contact__details">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div><strong>{t('contact.phone')}</strong><span>935 87 20 79</span></div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div><strong>{t('contact.office')}</strong><span>C/ Llobateras, 49 — 08191 Rubí, Barcelona</span></div>
              </div>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('contact.emailLabel') === 'Email' ? 'Nom' : 'Nombre'}</label>
                <input type="text" placeholder={t('contact.namePlaceholder')} required />
              </div>
              <div className="form-group">
                <label>{t('contact.emailLabel')}</label>
                <input type="email" placeholder="correu@exemple.com" required />
              </div>
            </div>
            <div className="form-group">
              <label>{t('contact.destination')}</label>
              <input type="text" placeholder={t('contact.destPlaceholder')} />
            </div>
            <div className="form-group">
              <label>{t('contact.message')}</label>
              <textarea rows="4" placeholder={t('contact.msgPlaceholder')} />
            </div>
            <button type="submit" className="btn btn--primary btn--full">
              {sent ? t('contact.sent') : t('contact.submit')}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
