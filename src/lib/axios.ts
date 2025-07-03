// src/lib/axios.ts
import axios from 'axios';


import type { AxiosRequestConfig } from 'axios';

const instance = axios.create({
  baseURL: 'https://b2btender-backend.onrender.com',
});

// Add token from localStorage to every request
import type { InternalAxiosRequestConfig } from 'axios';

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default instance;
