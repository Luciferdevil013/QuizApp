import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token in interceptor:', token); // Debug log
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
}

interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
}

interface NewQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

interface UpdateProfileData {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Auth endpoints
export const login = (credentials: LoginData) => api.post('/auth/login', credentials);
export const register = (userData: RegisterData) => api.post('/auth/register', userData);

// Quiz endpoints
export const createQuestions = () => api.post('/quiz/questions/create');
export const addQuestion = (question: NewQuestion) => api.post('/quiz/questions', question);
export const getQuestions = () => api.get('/quiz/questions');
export const deleteQuestion = (questionId: string) => api.delete(`/quiz/questions/${questionId}`);
export const submitQuiz = (answers: QuizAnswer[]) => api.post('/quiz/submit', { answers });

// User endpoints
export const getLeaderboard = () => api.get('/quiz/leaderboard');
export const updateProfile = (data: UpdateProfileData) => api.put('/users/profile', data); 