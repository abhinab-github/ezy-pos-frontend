import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ezy-pos-33678b34786e.herokuapp.com', // Adjust the base URL to your backend
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
