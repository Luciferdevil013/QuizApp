import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='w-1/4 h-3/4 bg-slate-200 rounded-md px-4 flex flex-col justify-center gap-4'>
        {error && <p className='text-red-500 text-center'>{error}</p>}
        
        <div className='w-full h-auto flex flex-col gap-2'>
          <p className='text-lg font-medium'>First and Last Name</p>
          <input 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className='w-full text-lg font-medium p-1 rounded border-none outline-none' 
            type="text" 
            placeholder='Enter Your Name' 
            required
          />
        </div>

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
            Sign Up
          </button>
        </div>

        <div className='w-full h-auto flex mt-4'>
          <Link to="/login" className='text-blue-600 hover:text-blue-800 text-lg'>
            Back to Login Page
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;