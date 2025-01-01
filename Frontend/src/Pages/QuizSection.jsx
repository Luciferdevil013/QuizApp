import React, { useState, useEffect } from 'react';
import { getQuestions, submitQuiz } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function QuizSection() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await getQuestions();
      setQuestions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to fetch questions');
      setLoading(false);
      toast.error('Failed to fetch questions');
    }
  };

  const handleAnswer = (questionId, selectedAnswer) => {
    setAnswers({
      ...answers,
      [questionId]: selectedAnswer
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    try {
      const formattedAnswers = {
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer
        }))
      };

      const response = await submitQuiz(formattedAnswers);
      toast.success(`Quiz submitted successfully! Your score: ${response.data.score}%`);
      navigate('/scoreboard');
    } catch (err) {
      console.error('Error submitting quiz:', err);
      toast.error(err.response?.data?.message || 'Failed to submit quiz');
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">No questions available.</div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Question {currentQuestion + 1} of {questions.length}</h2>
            <div className="text-sm text-gray-500">
              {Object.keys(answers).length} of {questions.length} answered
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question._id, option)}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  answers[question._id] === option
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-4 py-2 rounded ${
              currentQuestion === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Previous
          </button>
          
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizSection;
