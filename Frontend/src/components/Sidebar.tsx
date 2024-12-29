import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className='w-3/12 h-full bg-slate-200 flex flex-col gap-5'>
      <div className='logo w-full pt-16 flex items-center justify-center'>
        <img className='w-20 h-20' src="/quiz-logo.jpg" alt="logo" />
      </div>
      <div className='userinfo text-xl px-4 py-4 border-b-2 border-solid border-slate-800'>
        User Account
      </div>
      <Link to="/dashboard" className='w-full h-fit bg-black text-white text-xl py-4 px-4'>
        Quiz
      </Link>
      <Link to="/dashboard/scoreboard" className='w-full h-fit bg-black text-white text-xl py-4 px-4'>
        Score Board
      </Link>
      <Link to="/dashboard/settings" className='w-full h-fit bg-black text-white text-xl py-4 px-4'>
        Settings
      </Link>
      <button 
        onClick={handleLogout}
        className='w-full h-fit bg-red-600 text-white text-xl py-4 px-4 mt-auto mb-8'
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar; 