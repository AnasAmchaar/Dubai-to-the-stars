import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import '../styles/TripDetails.css';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);
  const [selectedClass, setSelectedClass] = useState('economy');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await api.get(`/api/trips/${id}`);
        setTrip(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load trip details');
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/trips/${id}` } });
    } else {
      navigate(`/booking/${id}?class=${selectedClass}`);
    }
  };

  if (loading) return <div className="loading">Loading trip details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!trip) return <div className="not-found">Trip not found</div>;

  return (
    <div className="trip-details">
      <div className="trip-header">
        <h1>{trip.destination}</h1>
        <div className="trip-meta">
          <span>Departure: {new Date(trip.departureDate).toLocaleDateString()}</span>
          <span>Duration: {trip.duration} days</span>
        </div>
      </div>

      <div className="trip-content">
        <div className="trip-image">
          <img src={`/images/${trip.imageUrl}`} alt={trip.destination} />
        </div>

        <div className="trip-info">
          <div className="description">
            <h2>About This Trip</h2>
            <p>{trip.description}</p>
          </div>

          <div className="booking-options">
            <h2>Select Your Seat Class</h2>
            <div className="seat-classes">
              <div className={`seat-class ${selectedClass === 'economy' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  id="economy"
                  name="seatClass"
                  value="economy"
                  checked={selectedClass === 'economy'}
                  onChange={handleClassChange}
                />
                <label htmlFor="economy">
                  <h3>Orbital Economy</h3>
                  <p className="price">${trip.prices.economy.toLocaleString()}</p>
                  <p className="seats-left">{trip.availableSeats.economy} seats left</p>
                  <ul className="features">
                    <li>Standard cabin accommodations</li>
                    <li>Basic space meals</li>
                    <li>Shared viewing deck access</li>
                  </ul>
                </label>
              </div>

              <div className={`seat-class ${selectedClass === 'luxury' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  id="luxury"
                  name="seatClass"
                  value="luxury"
                  checked={selectedClass === 'luxury'}
                  onChange={handleClassChange}
                />
                <label htmlFor="luxury">
                  <h3>Lunar Luxury</h3>
                  <p className="price">${trip.prices.luxury.toLocaleString()}</p>
                  <p className="seats-left">{trip.availableSeats.luxury} seats left</p>
                  <ul className="features">
                    <li>Private cabin with panoramic views</li>
                    <li>Gourmet space cuisine</li>
                    <li>Priority access to viewing decks</li>
                    <li>One guided space walk</li>
                  </ul>
                </label>
              </div>

              <div className={`seat-class ${selectedClass === 'vip' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  id="vip"
                  name="seatClass"
                  value="vip"
                  checked={selectedClass === 'vip'}
                  onChange={handleClassChange}
                />
                <label htmlFor="vip">
                  <h3>Galactic VIP</h3>
                  <p className="price">${trip.prices.vip.toLocaleString()}</p>
                  <p className="seats-left">{trip.availableSeats.vip} seats left</p>
                  <ul className="features">
                    <li>Luxury suite with 360° views</li>
                    <li>Personal concierge</li>
                    <li>Chef-prepared custom meals</li>
                    <li>Multiple guided space walks</li>
                    <li>Zero-gravity spa treatments</li>
                  </ul>
                </label>
              </div>
            </div>

            <button 
              className="btn btn-primary book-now" 
              onClick={handleBookNow}
              disabled={
                (selectedClass === 'economy' && trip.availableSeats.economy === 0) ||
                (selectedClass === 'luxury' && trip.availableSeats.luxury === 0) ||
                (selectedClass === 'vip' && trip.availableSeats.vip === 0)
              }
            >
              {user ? 'Continue to Booking' : 'Login to Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;