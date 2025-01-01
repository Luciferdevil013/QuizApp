import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Quiz App</h1>
        <p className="text-gray-400 text-sm mt-1">{user.username}</p>
      </div>

      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            isActive('/dashboard')
              ? 'bg-blue-500 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/quiz"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            isActive('/quiz')
              ? 'bg-blue-500 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Take Quiz
        </Link>

        <Link
          to="/scoreboard"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            isActive('/scoreboard')
              ? 'bg-blue-500 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Scoreboard
        </Link>

        {/* <Link
          to="/settings"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            isActive('/settings')
              ? 'bg-blue-500 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Settings
        </Link> */}

        {user.isAdmin && (
          <Link
            to="/admin"
            className={`block px-4 py-2 rounded-lg transition-colors ${
              location.pathname.startsWith('/admin')
                ? 'bg-blue-500 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Admin Panel
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors mt-4"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar; 