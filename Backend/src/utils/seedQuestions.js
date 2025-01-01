import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';

dotenv.config();

export const demoQuestions = [
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
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
    points: 10
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
    correctAnswer: "Da Vinci",
    points: 10
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: "Pacific",
    points: 10
  }
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Question.deleteMany({}); // Clear existing questions
    await Question.insertMany(demoQuestions);
    console.log('Sample questions added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
};

seedQuestions(); 