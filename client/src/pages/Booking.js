import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import '../styles/Booking.css';

const Booking = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSeatClass = queryParams.get('class') || 'economy';

  const [trip, setTrip] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    seatClass: initialSeatClass,
    accommodationId: '',
    totalPrice: 0
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch trip details
        const tripRes = await api.get(`/api/trips/${tripId}`);
        setTrip(tripRes.data);

        // Fetch accommodations for the destination
        const accomRes = await api.post('/api/accommodations/filter', {
          location: tripRes.data.destination
        });
        setAccommodations(accomRes.data);

        // Set initial total price
        setBookingData(prev => ({
          ...prev,
          totalPrice: tripRes.data.prices[initialSeatClass]
        }));

        setLoading(false);
      } catch (err) {
        setError('Failed to load booking information');
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId, initialSeatClass]);

  const handleSeatClassChange = (e) => {
    const newSeatClass = e.target.value;
    setBookingData(prev => ({
      ...prev,
      seatClass: newSeatClass,
      totalPrice: calculateTotalPrice(newSeatClass, prev.accommodationId)
    }));
  };

  const handleAccommodationChange = (e) => {
    const newAccommodationId = e.target.value;
    setBookingData(prev => ({
      ...prev,
      accommodationId: newAccommodationId,
      totalPrice: calculateTotalPrice(prev.seatClass, newAccommodationId)
    }));
  };

  const calculateTotalPrice = (seatClass, accommodationId) => {
    if (!trip) return 0;
    
    let total = trip.prices[seatClass];
    
    if (accommodationId) {
      const accommodation = accommodations.find(acc => acc._id === accommodationId);
      if (accommodation) {
        total += accommodation.pricePerNight * trip.duration;
      }
    }
    
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      const response = await api.post('/api/bookings', {
        tripId,
        seatClass: bookingData.seatClass,
        accommodationId: bookingData.accommodationId || null
      });
      
      navigate('/dashboard', { state: { bookingConfirmed: true, bookingId: response.data._id } });
    } catch (err) {
      setError('Failed to complete booking. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) return <div className="loading">Loading booking information...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!trip) return <div className="not-found">Trip information not found</div>;

  return (
    <div className="booking-page">
      <h1>Complete Your Booking</h1>
      
      <div className="booking-container">
        <div className="booking-summary">
          <h2>Trip Summary</h2>
          <div className="summary-details">
            <p><strong>Destination:</strong> {trip.destination}</p>
            <p><strong>Departure:</strong> {new Date(trip.departureDate).toLocaleDateString()}</p>
            <p><strong>Duration:</strong> {trip.duration} days</p>
            <p><strong>Selected Class:</strong> {
              bookingData.seatClass === 'economy' ? 'Orbital Economy' :
              bookingData.seatClass === 'luxury' ? 'Lunar Luxury' : 'Galactic VIP'
            }</p>
            {bookingData.accommodationId && (
              <p><strong>Accommodation:</strong> {
                accommodations.find(acc => acc._id === bookingData.accommodationId)?.name
              }</p>
            )}
            <p className="total-price"><strong>Total Price:</strong> ${bookingData.totalPrice.toLocaleString()}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-section">
            <h2>Seat Class</h2>
            <div className="seat-selection">
              <div className="radio-option">
                <input
                  type="radio"
                  id="economy"
                  name="seatClass"
                  value="economy"
                  checked={bookingData.seatClass === 'economy'}
                  onChange={handleSeatClassChange}
                  disabled={trip.availableSeats.economy === 0}
                />
                <label htmlFor="economy">
                  <span className="option-name">Orbital Economy</span>
                  <span className="option-price">${trip.prices.economy.toLocaleString()}</span>
                </label>
              </div>
              
              <div className="radio-option">
                <input
                  type="radio"
                  id="luxury"
                  name="seatClass"
                  value="luxury"
                  checked={bookingData.seatClass === 'luxury'}
                  onChange={handleSeatClassChange}
                  disabled={trip.availableSeats.luxury === 0}
                />
                <label htmlFor="luxury">
                  <span className="option-name">Lunar Luxury</span>
                  <span className="option-price">${trip.prices.luxury.toLocaleString()}</span>
                </label>
              </div>
              
              <div className="radio-option">
                <input
                  type="radio"
                  id="vip"
                  name="seatClass"
                  value="vip"
                  checked={bookingData.seatClass === 'vip'}
                  onChange={handleSeatClassChange}
                  disabled={trip.availableSeats.vip === 0}
                />
                <label htmlFor="vip">
                  <span className="option-name">Galactic VIP</span>
                  <span className="option-price">${trip.prices.vip.toLocaleString()}</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Accommodation</h2>
            <div className="accommodation-selection">
              <div className="radio-option">
                <input
                  type="radio"
                  id="no-accommodation"
                  name="accommodationId"
                  value=""
                  checked={bookingData.accommodationId === ''}
                  onChange={handleAccommodationChange}
                />
                <label htmlFor="no-accommodation">
                  <span className="option-name">No accommodation needed</span>
                  <span className="option-price">$0</span>
                </label>
              </div>
              
              {accommodations.map(acc => (
                <div key={acc._id} className="radio-option">
                  <input
                    type="radio"
                    id={acc._id}
                    name="accommodationId"
                    value={acc._id}
                    checked={bookingData.accommodationId === acc._id}
                    onChange={handleAccommodationChange}
                  />
                  <label htmlFor={acc._id}>
                    <span className="option-name">{acc.name}</span>
                    <span className="option-price">${acc.pricePerNight.toLocaleString()} per night</span>
                    <span className="option-details">
                      {acc.amenities.slice(0, 2).join(', ')}
                      {acc.amenities.length > 2 ? ', ...' : ''}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="booking-actions">
            <button type="submit" className="btn btn-primary" disabled={processing}>
              {processing ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;