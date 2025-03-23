import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/TripSearch.css';

const TripSearch = () => {
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [searchParams, setSearchParams] = useState({
    destination: '',
    departureDate: '',
    seatClass: ''
  });

  // Load initial trips
  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/trips');
        setTrips(res.data);
      } catch (err) {
        console.error('Error fetching trips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/api/trips/search', searchParams);
      setTrips(res.data);
    } catch (err) {
      console.error('Error searching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-search">
      <h1>Find Your Space Adventure</h1>

      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <select
              id="destination"
              name="destination"
              value={searchParams.destination}
              onChange={handleChange}
            >
              <option value="">All Destinations</option>
              <option value="International Space Station">International Space Station</option>
              <option value="Lunar Base Alpha">Lunar Base Alpha</option>
              <option value="Mars Colony">Mars Colony</option>
              <option value="Orbital Hotel">Orbital Hotel</option>
              <option value="Saturn Ring Observatory">Saturn Ring Observatory</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="departureDate">Departure Date</label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={searchParams.departureDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="seatClass">Seat Class</label>
            <select
              id="seatClass"
              name="seatClass"
              value={searchParams.seatClass}
              onChange={handleChange}
            >
              <option value="">Any Class</option>
              <option value="economy">Orbital Economy</option>
              <option value="luxury">Lunar Luxury</option>
              <option value="vip">Galactic VIP</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Search Trips
          </button>
        </form>
      </div>

      <div className="results-container">
        <h2>Available Trips</h2>
        {loading ? (
          <div className="loading">Loading trips...</div>
        ) : trips.length > 0 ? (
          <div className="trip-grid">
            {trips.map(trip => (
              <div key={trip._id} className="trip-card">
                <div className="trip-image">
                  <img src={`/images/${trip.imageUrl}`} alt={trip.destination} />
                </div>
                <div className="trip-details">
                  <h3>{trip.destination}</h3>
                  <p>Departure: {new Date(trip.departureDate).toLocaleDateString()}</p>
                  <p>Duration: {trip.duration} days</p>
                  <div className="price-grid">
                    <div className="price-item">
                      <span className="seat-class">Economy</span>
                      <span className="price">${trip.prices.economy.toLocaleString()}</span>
                    </div>
                    <div className="price-item">
                      <span className="seat-class">Luxury</span>
                      <span className="price">${trip.prices.luxury.toLocaleString()}</span>
                    </div>
                    <div className="price-item">
                      <span className="seat-class">VIP</span>
                      <span className="price">${trip.prices.vip.toLocaleString()}</span>
                    </div>
                  </div>
                  <Link to={`/trips/${trip._id}`} className="btn btn-secondary">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">No trips found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default TripSearch;