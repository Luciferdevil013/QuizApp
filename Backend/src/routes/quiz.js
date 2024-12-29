import express from 'express';
import Question from '../models/Question.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get random questions for quiz
router.get('/questions', auth, async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $sample: { size: 10 } },
      { $project: { correctAnswer: 0 } } // Don't send correct answer to frontend
    ]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit quiz answers
router.post('/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    let score = 0;

    for (let answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (question.correctAnswer === answer.selectedAnswer) {
        score += question.points;
      }
    }

    // Update user score
    await User.findByIdAndUpdate(req.userId, {
      $inc: { score: score }
    });

    res.json({ score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaders = await User.find()
      .sort({ score: -1 })
      .limit(10)
      .select('name score');
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin route to add questions
router.post('/add-question', auth, async (req, res) => {
  try {
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