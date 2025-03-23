import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Check for booking confirmation from state
  useEffect(() => {
    if (location.state?.bookingConfirmed) {
      setShowConfirmation(true);
      
      // Hide confirmation after 5 seconds
      const timer = setTimeout(() => {
        setShowConfirmation(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  
  // Fetch user's bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/bookings/my-bookings');
        setBookings(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load your bookings');
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  // Calculate time remaining until launch
  const calculateTimeRemaining = (departureDate) => {
    const now = new Date();
    const departure = new Date(departureDate);
    const difference = departure - now;
    
    if (difference <= 0) {
      return { expired: true };
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds, expired: false };
  };
  
  // Countdown timer component
  const CountdownTimer = ({ departureDate }) => {
    const [timeRemaining, setTimeRemaining] = useState(
      calculateTimeRemaining(departureDate)
    );
    
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(departureDate));
      }, 1000);
      
      return () => clearInterval(timer);
    }, [departureDate]);
    
    if (timeRemaining.expired) {
      return <div className="countdown expired">Trip has departed</div>;
    }
    
    return (
      <div className="countdown">
        <div className="countdown-item">
          <span className="countdown-value">{timeRemaining.days}</span>
          <span className="countdown-label">Days</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeRemaining.hours}</span>
          <span className="countdown-label">Hours</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeRemaining.minutes}</span>
          <span className="countdown-label">Minutes</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeRemaining.seconds}</span>
          <span className="countdown-label">Seconds</span>
        </div>
      </div>
    );
  };
  
  if (loading) return <div className="loading">Loading your dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="dashboard">
      {showConfirmation && (
        <div className="booking-confirmation">
          <i className="fas fa-check-circle"></i>
          <p>Booking confirmed! Get ready for your space adventure.</p>
        </div>
      )}
      
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}</h1>
        <p>Manage your space travel bookings and prepare for your journey.</p>
      </div>
      
      <div className="dashboard-content">
        <section className="my-bookings">
          <h2>My Space Journeys</h2>
          
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>You haven't booked any trips yet.</p>
              <a href="/search" className="btn btn-secondary">Explore Available Trips</a>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.tripId.destination}</h3>
                    <span className={`booking-status ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="booking-details">
                    <div className="booking-info">
                      <p><strong>Departure:</strong> {new Date(booking.tripId.departureDate).toLocaleDateString()}</p>
                      <p><strong>Seat Class:</strong> {
                        booking.seatClass === 'economy' ? 'Orbital Economy' :
                        booking.seatClass === 'luxury' ? 'Lunar Luxury' : 'Galactic VIP'
                      }</p>
                      {booking.accommodationId && (
                        <p><strong>Accommodation:</strong> {booking.accommodationId.name}</p>
                      )}
                      <p><strong>Booked on:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                      <p><strong>Total Price:</strong> ${booking.totalPrice.toLocaleString()}</p>
                    </div>
                    
                    <div className="countdown-container">
                      <h4>Time Until Launch</h4>
                      <CountdownTimer departureDate={booking.tripId.departureDate} />
                    </div>
                  </div>
                  
                  {booking.travelTips && booking.travelTips.length > 0 && (
                    <div className="travel-tips">
                      <h4>Travel Tips</h4>
                      <ul>
                        {booking.travelTips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;