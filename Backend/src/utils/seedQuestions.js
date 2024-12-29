import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';

dotenv.config();

const sampleQuestions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    points: 10
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    points: 10
  },
  // Add more sample questions as needed
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Question.deleteMany({}); // Clear existing questions
    await Question.insertMany(sampleQuestions);
    console.log('Sample questions added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
};

seedQuestions(); 