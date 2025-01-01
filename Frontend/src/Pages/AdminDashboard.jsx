import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestions, addQuestion, deleteQuestion } from '../services/api';

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

function AdminDashboard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 10
  });

  useEffect(() => {
    // Check admin status
    if (!localStorage.getItem('isAdmin')) {
      navigate('/admin');
      return;
    }
    loadQuestions();
  }, [navigate]);

  const loadQuestions = async () => {
    try {
      const response = await getQuestions();
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewQuestion({
      ...newQuestion,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewQuestion({
      ...newQuestion,
      [e.target.name]: e.target.value
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: newOptions
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      
      // Validate all options are filled
      if (newQuestion.options.some(opt => !opt.trim())) {
        setError('All options must be filled');
        return;
      }

      // Validate correct answer is selected
      if (!newQuestion.correctAnswer) {
        setError('Please select a correct answer');
        return;
      }

      const response = await addQuestion(newQuestion);
      if (response.data) {
        // Reset form
        setNewQuestion({
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          points: 10
        });
        // Reload questions
        await loadQuestions();
      }
    } catch (err) {
      console.error('Error adding question:', err);
      setError('Failed to add question. Please try again.');
    }
  };

  const handleDelete = async (questionId: string) => {
    try {
      await deleteQuestion(questionId);
      loadQuestions();
    } catch (err) {
      setError('Failed to delete question');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add New Question Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <textarea
              name="question"
              value={newQuestion.question}
              onChange={handleQuestionChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Options</label>
            {newQuestion.options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="w-full p-2 border rounded"
                required
              />
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Correct Answer</label>
            <select
              name="correctAnswer"
              value={newQuestion.correctAnswer}
              onChange={handleSelectChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select correct answer</option>
              {newQuestion.options.map((option, index) => (
                option && <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Points</label>
            <input
              type="number"
              name="points"
              value={newQuestion.points}
              onChange={handleQuestionChange}
              className="w-full p-2 border rounded"
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Question
          </button>
        </form>
      </div>

      {/* Existing Questions List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Questions</h2>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question._id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">Question {index + 1}: {question.question}</div>
                  <div className="ml-4 mt-2">
                    <div className="text-sm text-gray-600">Options:</div>
                    <ul className="list-disc ml-8">
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex} className={option === question.correctAnswer ? 'text-green-600 font-medium' : ''}>
                          {option} {option === question.correctAnswer && '(Correct)'}
                        </li>
                      ))}
                    </ul>
                    <div className="text-sm text-gray-600 mt-1">Points: {question.points}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(question._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 