import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quiz.js';
import userRoutes from './routes/users.js';
import { demoQuestions } from './utils/seedQuestions.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizapp';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Initialize questions after DB connection
    try {
      const Question = mongoose.model('Question');
      const existingQuestions = await Question.find();
      console.log(`Found ${existingQuestions.length} existing questions`);
      
      if (existingQuestions.length === 0) {
        console.log('No questions found, initializing demo questions...');
        const createdQuestions = await Question.create(demoQuestions);
        console.log(`Successfully created ${createdQuestions.length} demo questions`);
      }
    } catch (error) {
      console.error('Error initializing questions:', error);
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Wait for MongoDB connection before starting server
const startServer = async () => {
  await connectDB();
  
  // Register routes
  console.log('Registering routes...');
  
  // Auth routes
  app.use('/api/auth', authRoutes);
  console.log('Auth routes registered at /api/auth');
  
  // User routes - must come before quiz routes
  app.use('/api/users', userRoutes);
  console.log('User routes registered at /api/users');
  
  // Quiz routes
  app.use('/api/quiz', quizRoutes);
  console.log('Quiz routes registered at /api/quiz');

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  // 404 handler
  app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.url);
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`MongoDB URI: ${MONGODB_URI}`);
    console.log('Available routes:');
    console.log('- GET  /api/test');
    console.log('- POST /api/auth/login');
    console.log('- POST /api/auth/register');
    console.log('- GET  /api/users/profile');
    console.log('- PUT  /api/users/profile');
    console.log('- GET  /api/quiz/questions');
    console.log('- POST /api/quiz/submit');
    console.log('- GET  /api/quiz/leaderboard');
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app; 