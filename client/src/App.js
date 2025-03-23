import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TripSearch from './pages/TripSearch';
import TripDetails from './pages/TripDetails';
import Booking from './pages/Booking';
import AccommodationSearch from './pages/AccommodationSearch';
import Dashboard from './pages/Dashboard';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<TripSearch />} />
              <Route path="/trips/:id" element={<TripDetails />} />
              <Route path="/accommodations" element={<AccommodationSearch />} />
              <Route path="/booking/:tripId" element={
                <PrivateRoute>
                  <Booking />
                </PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <footer className="footer">
            <p>© 2023 Dubai to the Stars - Your Gateway to Space</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;