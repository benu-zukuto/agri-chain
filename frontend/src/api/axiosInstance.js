import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('agri_user'));
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Something went wrong. Please try again.';
    
    if (!error.response) {
      message = 'Network Error: Cannot connect to server.';
    } else {
      switch (error.response.status) {
        case 400:
          message = error.response.data.message || 'Bad Request';
          break;
        case 401:
          message = 'Unauthorized. Please login again.';
          // Clear local storage and redirect
          localStorage.removeItem('agri_user');
          window.location.href = '/login';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 500:
          message = 'Internal Server Error.';
          break;
        default:
          message = error.response.data.message || 'An unexpected error occurred.';
      }
    }
    
    // Show toast notification for errors
    toast.error(message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
