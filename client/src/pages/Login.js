import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo);
    }
  }, [user, navigate, location.state]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      const { email, password } = formData;
      const success = await login(email, password);
      
      if (success) {
        const redirectTo = location.state?.from || '/dashboard';
        navigate(redirectTo);
      }
      
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to access your space travel account</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? 'error' : ''}
              />
              {formErrors.email && <span className="error-message">{formErrors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                className={formErrors.password ? 'error' : ''}
              />
              {formErrors.password && <span className="error-message">{formErrors.password}</span>}
            </div>
            
            {error && <div className="auth-error">{error}</div>}
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
          </div>
        </div>
        
        <div className="auth-image">
          <div className="auth-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;