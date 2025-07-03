// src/lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://b2btender-backend.onrender.com/', // your backend base URL
});

// Add token from localStorage to every request
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
