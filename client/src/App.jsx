import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import UserLogin from './pages/UserLogin'
import Register from './pages/Register'
import PropertyDetails from './pages/PropertyDetails'
import Favorites from './pages/Favorites'
import About from './pages/About'
import Contact from './pages/Contact'
import { ToastProvider } from './components/Toast'

// Protected Route Component for Admin
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/user-login" replace />;
  }
  return children;
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Auth Routes */}
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />

          {/* Info Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* App Routes */}
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/favorites" element={<Favorites />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
