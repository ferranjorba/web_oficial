import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'
import './ContactPage.css'

const EASE = [0.25, 0.1, 0.25, 1]
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: EASE, delay },
})

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.4 10.8 19.79 19.79 0 01.36 2.18 2 2 0 012.34 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.9a16 16 0 006.19 6.19l1.25-1.25a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const { t, lang } = useLang()
  const isEs = lang === 'es'

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSent(false); e.target.reset() }, 3000)
  }

  return (
    <main className="contact-page">
      <div className="contact-page__hero">
        <div className="container">
          <motion.div {...fadeUp(0)}>
            <p className="section-tag" style={{ color: 'var(--color-primary)' }}>
              {t('contact.tag')}
            </p>
          </motion.div>
          <motion.h1 className="section-title" style={{ color: 'white' }} {...fadeUp(0.1)}>
            {t('contact.title').split('\n').map((l, i) => (
              <span key={i}>{l}{i === 0 && <br />}</span>
            ))}
          </motion.h1>
        </div>
      </div>

      <section className="contact">
        <div className="container contact__grid">

          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p>{t('contact.desc')}</p>
            <div className="contact__details">
              <div className="contact-item">
                <span className="contact-icon"><PhoneIcon /></span>
                <div>
                  <strong>{t('contact.phone')}</strong>
                  <span>935 87 20 79</span>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon"><PinIcon /></span>
                <div>
                  <strong>{t('contact.office')}</strong>
                  <span>C/ Llobateras, 49 — 08191 Rubí, Barcelona</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            className="contact__form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          >
            <div className="form-row">
              <div className="form-group">
                <label>{isEs ? 'Nombre' : 'Nom'}</label>
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
          </motion.form>

        </div>
      </section>
    </main>
  )
}
