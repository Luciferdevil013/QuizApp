import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// Quiz endpoints
export const getQuestions = () => api.get('/quiz/questions');
export const submitQuiz = (answers) => api.post('/quiz/submit', answers);
export const getScoreboard = () => api.get('/quiz/scoreboard');

// Admin endpoints
export const addQuestion = (questionData) => api.post('/quiz/questions', questionData);

// User endpoints
export const updateProfile = (userData) => api.put('/users/profile', userData);
export const getProfile = () => api.get('/users/profile');

export default api; 