import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './Pages/Login';
import AdminLogin from './Pages/AdminLogin';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import AdminPanel from './Pages/AdminPanel';
import QuizSection from './Pages/QuizSection';
import Scoreboard from './Pages/Scoreboard';
import Settings from './Pages/Settings';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected user routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/quiz" element={
            <PrivateRoute>
              <QuizSection />
            </PrivateRoute>
          } />
          <Route path="/scoreboard" element={
            <PrivateRoute>
              <Scoreboard />
            </PrivateRoute>
          } />
          {/* <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } /> */}
          
          {/* Admin routes */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />
          
          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;