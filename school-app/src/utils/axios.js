// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // Opcional: tiempo máximo de espera (10 segundos)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Opcional: Interceptores para manejar tokens o errores globalmente
api.interceptors.request.use((config) => {
  // Ejemplo: const token = localStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;