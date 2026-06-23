import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { LangProvider } from './context/LangContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import './App.css'

const ContactPage   = lazy(() => import('./pages/ContactPage'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const TripDetail    = lazy(() => import('./pages/TripDetail'))
const BookingPage   = lazy(() => import('./pages/BookingPage'))
const CategoryPage  = lazy(() => import('./pages/CategoryPage'))
const AvisLegal     = lazy(() => import('./pages/AvisLegal'))
const ResultsPage   = lazy(() => import('./pages/ResultsPage'))

function PageShell() {
  return <div style={{ minHeight: '100vh', background: '#FAFAF8' }} />
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <LangProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<PageShell />}>
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/contacte"       element={<ContactPage />} />
          <Route path="/cerca"          element={<SearchResults />} />
          <Route path="/viatge/:id"     element={<TripDetail />} />
          <Route path="/reserva/:id"    element={<BookingPage />} />
          <Route path="/categoria/:cat" element={<CategoryPage />} />
          <Route path="/avis-legal"     element={<AvisLegal />} />
          <Route path="/resultats"      element={<ResultsPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
    </LangProvider>
    </MotionConfig>
  )
}
