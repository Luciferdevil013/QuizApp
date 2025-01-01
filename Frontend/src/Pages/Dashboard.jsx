import React from 'react';
import { Link } from 'react-router-dom';
import QuizSection from './QuizSection';
import Sidebar from '../components/Sidebar';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.username}!</h1>
            <p className="text-gray-600 mt-2">Ready to test your knowledge?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Questions</span>
                  <span className="font-semibold">10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Limit</span>
                  <span className="font-semibold">30 mins</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Passing Score</span>
                  <span className="font-semibold">70%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Navigation</h2>
              <div className="space-y-4">
                <Link
                  to="/quiz"
                  className="block w-full py-3 px-4 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600 transition-colors"
                >
                  Start Quiz
                </Link>
                <Link
                  to="/scoreboard"
                  className="block w-full py-3 px-4 bg-green-500 text-white rounded-lg text-center hover:bg-green-600 transition-colors"
                >
                  View Scoreboard
                </Link>
                <Link
                  to="/settings"
                  className="block w-full py-3 px-4 bg-gray-500 text-white rounded-lg text-center hover:bg-gray-600 transition-colors"
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Instructions</h2>
            <div className="prose max-w-none">
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>The quiz consists of multiple-choice questions.</li>
                <li>Each question has four options with only one correct answer.</li>
                <li>You can navigate between questions using the Previous and Next buttons.</li>
                <li>You must answer all questions before submitting the quiz.</li>
                <li>Your score will be displayed immediately after submission.</li>
                <li>You can view your ranking on the scoreboard after completing the quiz.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 