import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import QuizSection from './Pages/QuizSection';
import ScoreBoard from './Pages/ScroreBoard';
import Setting from './Pages/Setting';
import AdminPanel from './Pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <QuizProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route index element={<QuizSection />} />
            <Route path="quiz" element={<QuizSection />} />
            <Route path="scoreboard" element={<ScoreBoard />} />
            <Route path="settings" element={<Setting />} />
          </Route>

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </QuizProvider>
    </BrowserRouter>
  );
}

export default App;