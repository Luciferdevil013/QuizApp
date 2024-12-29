import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { login } from '../services/api';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      
      // Store credentials in Redux
      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.token
      }));

      // Store token in localStorage for persistence
      localStorage.setItem('token', response.data.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='w-1/4 h-3/4 bg-slate-200 rounded-md px-4 flex flex-col justify-center gap-4'>
        {error && <p className='text-red-500 text-center'>{error}</p>}
        
        <div className='w-full h-auto flex flex-col gap-2'>
          <p className='text-lg font-medium'>Email</p>
          <input 
            name="email"
            value={formData.email}
            onChange={handleChange}
            className='w-full text-lg font-medium p-1 rounded border-none outline-none' 
            type="email" 
            placeholder='Enter Your Email'
            required 
          />
        </div>

        <div className='w-full h-auto flex flex-col gap-2'>
          <p className='text-lg font-medium'>Password</p>
          <input 
            name="password"
            value={formData.password}
            onChange={handleChange}
            className='w-full text-lg font-medium p-1 rounded border-none outline-none' 
            type="password" 
            placeholder='Enter Your Password'
            required
          />
        </div>

        <div className='w-full h-auto flex items-center justify-center mt-4'>
          <button type="submit" className='w-auto h-auto px-20 py-2 bg-slate-100 rounded-full hover:bg-slate-300 transition-colors'>
            Login
          </button>
        </div>

        <div className='w-full h-auto flex mt-4'>
          <Link to="/signup" className='text-blue-600 hover:text-blue-800 text-lg'>
            Register Now! Sign Up Page
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;