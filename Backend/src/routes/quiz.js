import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const questionsPath = path.join(__dirname, '../data/questions.json');
const scoreboardPath = path.join(__dirname, '../data/scoreboard.json');

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const user = jwt.verify(token, 'your-secret-key'); // Use the same secret key as in auth.js
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Helper function to read questions
async function readQuestions() {
  try {
    const data = await fs.readFile(questionsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(questionsPath, '[]');
      return [];
    }
    throw error;
  }
}

// Helper function to write questions
async function writeQuestions(questions) {
  await fs.writeFile(questionsPath, JSON.stringify(questions, null, 2));
}

// Helper function to read scoreboard
async function readScoreboard() {
  try {
    const data = await fs.readFile(scoreboardPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(scoreboardPath, '[]');
      return [];
    }
    throw error;
  }
}

// Helper function to write scoreboard
async function writeScoreboard(scores) {
  await fs.writeFile(scoreboardPath, JSON.stringify(scores, null, 2));
}

// Get all questions
router.get('/questions', authenticateToken, async (req, res) => {
  try {
    const questions = await readQuestions();
    // Remove correct answers before sending to client
    const questionsWithoutAnswers = questions.map(({ correctAnswer, ...rest }) => rest);
    res.json(questionsWithoutAnswers);
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({ message: 'Error getting questions' });
  }
});

// Add a new question (admin only)
router.post('/questions', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { question, options, correctAnswer } = req.body;

    if (!question || !options || !correctAnswer) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: 'Four options are required' });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ message: 'Correct answer must be one of the options' });
    }

    const questions = await readQuestions();
    const newQuestion = {
      _id: Date.now().toString(),
      question,
      options,
      correctAnswer
    };

    questions.push(newQuestion);
    await writeQuestions(questions);

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Error adding question' });
  }
});

// Submit quiz answers
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid answers format' });
    }

    const questions = await readQuestions();
    
    // Validate that all questions are answered
    if (answers.length !== questions.length) {
      return res.status(400).json({ message: 'All questions must be answered' });
    }

    let correctCount = 0;

    // Check each answer
    answers.forEach(answer => {
      const question = questions.find(q => q._id === answer.questionId);
      if (!question) {
        throw new Error(`Question not found: ${answer.questionId}`);
      }
      if (question.correctAnswer === answer.selectedAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);

    // Update scoreboard
    const scoreboard = await readScoreboard();
    scoreboard.push({
      userId: req.user.id,
      username: req.user.username,
      score,
      date: new Date().toISOString()
    });

    // Sort scoreboard by score (descending) and date (ascending)
    scoreboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.date) - new Date(b.date);
    });

    await writeScoreboard(scoreboard);

    res.json({ score });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: error.message || 'Error submitting quiz' });
  }
});

// Get scoreboard
router.get('/scoreboard', authenticateToken, async (req, res) => {
  try {
    const scoreboard = await readScoreboard();
    res.json(scoreboard);
  } catch (error) {
    console.error('Error getting scoreboard:', error);
    res.status(500).json({ message: 'Error getting scoreboard' });
  }
});

export default router; 