import axios from 'axios';
import { supabase } from '../../supabase';

// Define API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Updated to match the actual server port

// Configure axios defaults
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds default timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth header interceptor
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error('Error retrieving auth token:', error);
  }
  return config;
});

// Response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response?.status === 429) {
      // Rate limiting
      return Promise.reject(new Error('Too many requests, please try again later.'));
    } else if (error.response?.status === 401) {
      // Unauthorized - potentially trigger auth refresh or redirect
      console.warn('Authentication required');
    } else if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please check your connection and try again.'));
    }
    
    return Promise.reject(error);
  }
);

// API endpoints with retry logic
export const scanUrl = async (input, retries = 2) => {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Properly encode the URL parameter to ensure special characters are handled correctly
      const encodedInput = encodeURIComponent(input);
      console.log(`Attempt ${attempt + 1}: Making request to /api/scan with input: ${encodedInput}`);
      
      const response = await api.get(`/api/scan?input=${encodedInput}`);
      console.log('Scan URL API response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      // Log detailed error information
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        console.error('No response received');
      } else {
        console.error('Error message:', error.message);
      }
      
      lastError = error;
      if (attempt < retries) {
        // Wait with exponential backoff before retry
        const delay = 1000 * Math.pow(2, attempt);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
};

export const scanFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post('/api/scan-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
    timeout: 120000, // Extended timeout for file uploads (2 minutes)
  }).then(response => response.data);
};

export const fetchNews = async () => {
  const response = await api.get('/api/news');
  return response.data;
};

export const fetchInsights = async () => {
  const response = await api.get('/api/insights');
  return response.data;
};

export default api;
