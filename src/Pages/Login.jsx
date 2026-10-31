import React, { useState } from 'react';
import '../App.css'
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../services/authService';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const newErrors = { username: '', password: '' };
    if (!username.trim()) newErrors.username = 'Please enter your username';
    if (!password.trim()) newErrors.password = 'Please enter your password';

    setErrors(newErrors);

    // If no errors, proceed
    if (!newErrors.username && !newErrors.password) {
      setLoading(true);
      try {
        await signIn(username, password);
        navigate('/home');
      } catch (loginError) {
        setError(loginError.message || 'Could not sign in. Check your email and password.');
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    // <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center px-4 py-10">
          <div className="bg-[#f0f0f0] w-full max-w-[1400px] rounded border-2 p-6 md:p-12 flex flex-col md:flex-row border-none mx-auto mt-5 gap-10 h-[100vh]">
                  
                  <div className="absolute top-4 left-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-black hover:text-red-500 font-semibold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Back
            </button>
          </div>

        {/* Left Side */}
        <div className="md:w-1/2 flex flex-col justify-center text-center md:text-left">
          <h1 className="text-[40px] sm:text-[50px] md:text-[65px] lg:text-[75px] font-extrabold text-black leading-tight">
            Welcome Back
          </h1>
          <h2
          id='strokeText'
            className="text-[40px] sm:text-[50px] md:text-[65px] lg:text-[75px] font-extrabold text-transparent"
            style={{ WebkitTextStroke: '1px black' }}
          >
            User!!
          </h2>
          <p className="mt-6 sm:mt-10 text-[18px] sm:text-[20px] md:text-[24px] font-semibold text-black">
            Are You New Here?{' '}
            <Link
              to="/register"
              className="text-red-500 hover:underline inline-flex items-center font-semibold"
            >
              Register Here <span className="ml-1">→</span>
            </Link>
          </p>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 flex items-center justify-center">
          <form
            onSubmit={handleLogin}
            className="bg-black text-white px-6 py-8 sm:p-10 md:p-12 rounded-3xl w-full max-w-[600px] space-y-6 flex flex-col justify-center"
          >
            {error && <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}
            {/* Email */}
            <div>
              <label className="block text-[18px] sm:text-[20px] font-semibold mb-2">Email</label>
              <div className={`flex items-center bg-white rounded-md px-4 py-3 ${errors.username ? 'border-2 border-red-500' : ''}`}>
                <span className="text-black mr-2">👤</span>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full outline-none text-black text-base sm:text-lg bg-transparent"
                />
              </div>
              {errors.username && <p className="text-red-500 mt-1 text-sm">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[18px] sm:text-[20px] font-semibold mb-2">Password</label>
              <div className={`flex items-center bg-white rounded-md px-4 py-3 ${errors.password ? 'border-2 border-red-500' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full outline-none text-black text-base sm:text-lg bg-transparent"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-black ml-2 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
              </div>
              {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password}</p>}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md text-base sm:text-lg font-bold"
              >
              {loading ? 'Signing in…' : 'Login'}
            </button>

           
          </form>
        </div>
      </div>
    // </div>
  );
};

export default Login;
