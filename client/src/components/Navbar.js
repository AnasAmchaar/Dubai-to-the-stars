import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-rocket"></i>
          <span>Dubai to the Stars</span>
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/search" className="nav-link">Trips</Link>
          </li>
          <li className="nav-item">
            <Link to="/accommodations" className="nav-link">Accommodations</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">About</Link>
          </li>
        </ul>

        <div className="auth-buttons">
          {user ? (
            <>
              <Link to="/dashboard" className="dashboard-link">
                <i className="fas fa-user-astronaut"></i>
                <span>My Dashboard</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-small">Login</Link>
              <Link to="/register" className="btn btn-primary btn-small">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;