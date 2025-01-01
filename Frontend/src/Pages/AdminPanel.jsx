import React, { useState, useEffect } from 'react';
import { addQuestion, getQuestions } from '../services/api';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';

function AdminPanel() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

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
      toast.error('Failed to fetch questions');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.question.trim()) {
      toast.error('Question is required');
      return;
    }

    if (formData.options.some(option => !option.trim())) {
      toast.error('All options are required');
      return;
    }

    if (!formData.correctAnswer.trim()) {
      toast.error('Correct answer is required');
      return;
    }

    if (!formData.options.includes(formData.correctAnswer)) {
      toast.error('Correct answer must be one of the options');
      return;
    }

    try {
      await addQuestion(formData);
      toast.success('Question added successfully');
      
      // Reset form
      setFormData({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      });
      
      // Refresh questions list
      fetchQuestions();
    } catch (err) {
      console.error('Error adding question:', err);
      toast.error(err.response?.data?.message || 'Failed to add question');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage quiz questions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Question Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Question</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your question"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                {formData.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <input
                  type="text"
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the correct answer"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Add Question
              </button>
            </form>
          </div>

          {/* Questions List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Existing Questions</h2>
            
            {loading ? (
              <div className="text-center text-gray-500">Loading questions...</div>
            ) : questions.length === 0 ? (
              <div className="text-center text-gray-500">No questions available</div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question._id} className="border rounded p-4">
                    <div className="font-medium mb-2">
                      {index + 1}. {question.question}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex}>
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel; 