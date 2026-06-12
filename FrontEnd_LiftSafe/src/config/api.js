import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('liftsafe_token');
  console.log('Interceptor ejecutado. Token:', token ? 'EXISTS' : 'NULL');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Header Authorization set:', config.headers.Authorization.substring(0, 30) + '...');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;