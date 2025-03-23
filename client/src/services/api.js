import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set auth token for all requests if available
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['x-auth-token'] = token;
}

export default api;