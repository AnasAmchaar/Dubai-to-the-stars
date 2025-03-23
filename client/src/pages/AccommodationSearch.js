import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/AccommodationSearch.css';

const AccommodationSearch = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    amenities: []
  });
  
  // Available amenities
  const availableAmenities = [
    'Zero-gravity pool',
    'Panoramic Earth view',
    'Space walk experience',
    'Low-gravity spa',
    'Crater view rooms',
    'Oxygen bar',
    'Gourmet freeze-dried cuisine',
    'Terraformed gardens',
    'Martian rover excursions',
    'Research lab tours'
  ];
  
  // Fetch all accommodations on initial load
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/accommodations');
        setAccommodations(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load accommodations');
        setLoading(false);
      }
    };
    
    fetchAccommodations();
  }, []);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle amenity checkbox changes
  const handleAmenityChange = (amenity) => {
    setFilters(prev => {
      const updatedAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      
      return { ...prev, amenities: updatedAmenities };
    });
  };
  
  // Apply filters
  const applyFilters = async () => {
    try {
      setLoading(true);
      const res = await api.post('/api/accommodations/filter', filters);
      setAccommodations(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to filter accommodations');
      setLoading(false);
    }
  };
  
  // Reset filters
  const resetFilters = async () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      amenities: []
    });
    
    try {
      setLoading(true);
      const res = await api.get('/api/accommodations');
      setAccommodations(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to reset accommodations');
      setLoading(false);
    }
  };
  
  return (
    <div className="accommodation-search">
      <div className="search-header">
        <h1>Space Accommodations</h1>
        <p>Find the perfect place to stay during your space journey</p>
      </div>
      
      <div className="search-container">
        <div className="filter-panel">
          <h2>Filter Options</h2>
          
          <div className="filter-group">
            <label htmlFor="location">Location</label>
            <select
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">All Locations</option>
              <option value="International Space Station">International Space Station</option>
              <option value="Lunar Base Alpha">Lunar Base Alpha</option>
              <option value="Mars Colony">Mars Colony</option>
              <option value="Earth Orbit">Earth Orbit</option>
              <option value="Orbital Hotel">Orbital Hotel</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="minPrice">Min Price ($ per night)</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="Minimum price"
              value={filters.minPrice}
              onChange={handleFilterChange}
              min="0"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price ($ per night)</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="Maximum price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              min="0"
            />
          </div>
          
          <div className="filter-group amenities-filter">
            <label>Amenities</label>
            <div className="amenities-list">
              {availableAmenities.map(amenity => (
                <div key={amenity} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    id={amenity.replace(/\s+/g, '-').toLowerCase()}
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <label htmlFor={amenity.replace(/\s+/g, '-').toLowerCase()}>
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="filter-actions">
            <button onClick={applyFilters} className="btn btn-primary">
              Apply Filters
            </button>
            <button onClick={resetFilters} className="btn btn-secondary">
              Reset
            </button>
          </div>
        </div>
        
        <div className="results-panel">
          {loading ? (
            <div className="loading-results">Loading accommodations...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : accommodations.length === 0 ? (
            <div className="no-results">
              <p>No accommodations found matching your criteria.</p>
              <button onClick={resetFilters} className="btn btn-secondary">Reset Filters</button>
            </div>
          ) : (
            <div className="accommodation-grid">
              {accommodations.map(accommodation => (
                <div key={accommodation._id} className="accommodation-card">
                  <div className="accommodation-image">
                    <img 
                      src={`/images/${accommodation.imageUrl}`} 
                      alt={accommodation.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/accommodation-placeholder.jpg';
                      }}
                    />
                    <div className="price-tag">
                      ${accommodation.pricePerNight.toLocaleString()} <span>per night</span>
                    </div>
                  </div>
                  
                  <div className="accommodation-details">
                    <h3>{accommodation.name}</h3>
                    <p className="location">
                      <i className="fas fa-map-marker-alt"></i> {accommodation.location}
                    </p>
                    
                    <div className="rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <i 
                          key={star}
                          className={`fas fa-star ${star <= accommodation.rating ? 'filled' : ''}`}
                        ></i>
                      ))}
                    </div>
                    
                    <p className="description">
                      {accommodation.description.length > 120
                        ? `${accommodation.description.substring(0, 120)}...`
                        : accommodation.description}
                    </p>
                    
                    <div className="amenities">
                      {accommodation.amenities.slice(0, 3).map(amenity => (
                        <span key={amenity} className="amenity-tag">
                          {amenity}
                        </span>
                      ))}
                      {accommodation.amenities.length > 3 && (
                        <span className="amenity-tag more">
                          +{accommodation.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <button className="btn btn-secondary view-details">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccommodationSearch;