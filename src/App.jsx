import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ContactPage from './pages/ContactPage'
import SearchResults from './pages/SearchResults'
import TripDetail from './pages/TripDetail'
import BookingPage from './pages/BookingPage'
import CategoryPage from './pages/CategoryPage'
import AvisLegal from './pages/AvisLegal'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/contacte"       element={<ContactPage />} />
        <Route path="/cerca"          element={<SearchResults />} />
        <Route path="/viatge/:id"     element={<TripDetail />} />
        <Route path="/reserva/:id"    element={<BookingPage />} />
        <Route path="/categoria/:cat" element={<CategoryPage />} />
        <Route path="/avis-legal"     element={<AvisLegal />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
