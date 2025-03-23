src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Dubai to the Stars</h1>
        <h2>The Premier Gateway to Commercial Space Travel</h2>
        <p>Experience the future of travel with trips to space stations, lunar bases, and Mars colonies.</p>
        <div className="cta-buttons">
          <Link to="/search" className="btn btn-primary">Book Your Trip</Link>
          <Link to="/about" className="btn btn-secondary">Learn More</Link>
        </div>
      </div>

      <section className="features">
        <h2>Why Choose Dubai to the Stars?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <i className="fas fa-rocket"></i>
            <h3>Cutting-Edge Spacecraft</h3>
            <p>Travel in the latest spacecraft with state-of-the-art technology and safety features.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-hotel"></i>
            <h3>Luxury Accommodations</h3>
            <p>Stay in premium space hotels with zero-gravity pools and panoramic Earth views.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-user-astronaut"></i>
            <h3>Expert Crew</h3>
            <p>Our experienced astronauts and crew ensure a safe and memorable journey.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-globe"></i>
            <h3>Unique Destinations</h3>
            <p>Choose from the ISS, Lunar Base Alpha, or even Mars Colony for your adventure.</p>
          </div>
        </div>
      </section>

      <section className="destinations">
        <h2>Popular Destinations</h2>
        <div className="destination-grid">
          <div className="destination-card">
            <img src="/images/iss.jpg" alt="International Space Station" />
            <h3>International Space Station</h3>
            <p>Starting at $50,000</p>
            <Link to="/search" className="btn btn-small">Explore</Link>
          </div>
          <div className="destination-card">
            <img src="/images/lunar-base.jpg" alt="Lunar Base Alpha" />
            <h3>Lunar Base Alpha</h3>
            <p>Starting at $120,000</p>
            <Link to="/search" className="btn btn-small">Explore</Link>
          </div>
          <div className="destination-card">
            <img src="/images/mars-colony.jpg" alt="Mars Colony" />
            <h3>Mars Colony</h3>
            <p>Starting at $500,000</p>
            <Link to="/search" className="btn btn-small">Explore</Link>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Travelers Say</h2>
        <div className="testimonial-slider">
          <div className="testimonial">
            <p>"The most incredible experience of my life. Seeing Earth from space changed my perspective forever."</p>
            <div className="testimonial-author">- Sarah J., ISS Visitor</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;