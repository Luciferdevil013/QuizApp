import express from 'express';
import Question from '../models/Question';
import User from '../models/User';
import auth from '../middleware/auth';
import { demoQuestions } from '../utils/seedQuestions';

const router = express.Router();

// Test route to check if quiz routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Quiz routes are working!' });
});

// Get questions for quiz
router.get('/questions', auth, async (req, res) => {
  try {
    let questions = await Question.find().select('question options _id');
    console.log(`Initially found ${questions.length} questions`);
    
    // If no questions exist, create them
    if (questions.length === 0) {
      console.log('No questions found, creating demo questions...');
      await Question.create(demoQuestions);
      questions = await Question.find().select('question options _id');
      console.log(`Created and fetched ${questions.length} questions`);
    }

    // Double check we have questions to return
    if (questions.length === 0) {
      return res.status(500).json({ message: 'Failed to initialize questions' });
    }

    res.json(questions);
  } catch (error) {
    console.error('Error in /questions route:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Submit quiz answers
router.post('/submit', auth, async (req: any, res) => {
  try {
    const { answers } = req.body;
    console.log(`Received ${answers.length} answers for grading`);
    
    let score = 0;
    let totalQuestions = answers.length;
    let correctAnswers = 0;

    // Calculate score
    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score += 10;
        correctAnswers++;
      }
    }

    console.log(`User scored ${score} points with ${correctAnswers} correct answers`);

    // Update user's score
    const user = await User.findById(req.userId);
    if (user) {
      user.score = score;
      await user.save();
      console.log(`Updated user ${user.name}'s score to ${score}`);

      // Update rankings
      const users = await User.find().sort({ score: -1 });
      for (let i = 0; i < users.length; i++) {
        const currentUser = users[i];
        currentUser.rank = i + 1;
        await currentUser.save();
      }
    }

    res.json({
      score,
      totalQuestions,
      correctAnswers,
      message: `Quiz completed! You got ${correctAnswers} out of ${totalQuestions} questions correct and scored ${score} points.`
    });
  } catch (error) {
    console.error('Error in /submit route:', error);
    res.status(500).json({ message: 'Error submitting quiz' });
  }
});

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const leaderboard = await User.find()
      .select('name score rank')
      .sort({ score: -1 })
      .limit(10);
    console.log(`Returning leaderboard with ${leaderboard.length} entries`);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error in /leaderboard route:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Admin route to add questions
router.post('/questions', auth, async (req: any, res) => {
  try {
    // Check if user is admin
    if (!req.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { question, options, correctAnswer, points } = req.body;
    const newQuestion = await Question.create({
      question,
      options,
      correctAnswer,
      points: points || 10
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 