import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { getQuestions, submitQuiz } from '../services/api';

interface Question {
  _id: string;
  question: string;
  options: string[];
}

function QuizSection() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    message: string;
  } | null>(null);
  const { currentQuestion, setCurrentQuestion, answers, setAnswers } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getQuestions();
      setQuestions(response.data);
      
      // Reset quiz state
      setCurrentQuestion(0);
      setAnswers([]);
      setQuizSubmitted(false);
      setQuizResult(null);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (!questions[currentQuestion]) return;

    setAnswers([...answers, {
      questionId: questions[currentQuestion]._id,
      selectedAnswer
    }]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizSubmit();
    }
  };

  const handleQuizSubmit = async () => {
    try {
      const response = await submitQuiz(answers);
      setQuizSubmitted(true);
      setQuizResult(response.data);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      console.error('Error submitting quiz:', err);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizSubmitted(false);
    setQuizResult(null);
    loadQuestions();
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-xl">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 text-xl">{error}</div>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (quizSubmitted && quizResult) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-6">
        <div className="text-3xl font-bold">Quiz Completed!</div>
        <div className="text-xl text-center space-y-2">
          <p>You got {quizResult.correctAnswers} out of {quizResult.totalQuestions} questions correct!</p>
          <p className="font-bold">Score: {quizResult.score} points</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Take Quiz Again
          </button>
          <button
            onClick={() => navigate('/dashboard/scoreboard')}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-xl">No questions available.</div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  if (!currentQ) return null;

  return (
    <div className="w-full max-w-3xl mx-auto p-8">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">Question {currentQuestion + 1} of {questions.length}</div>
          <div className="h-2 bg-gray-200 rounded">
            <div 
              className="h-full bg-blue-500 rounded" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6">{currentQ.question}</h2>
        
        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full p-4 text-left rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizSection;
