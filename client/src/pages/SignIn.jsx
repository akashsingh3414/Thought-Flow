import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';

function SignIn() {
  const userName = useRef(null);
  const emailID = useRef(null);
  const password = useRef(null);

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const navigate = useNavigate();

  const [localErrorMessage, setLocalErrorMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      userName: userName.current.value,
      emailID: emailID.current.value,
      password: password.current.value,
    };

    setLocalErrorMessage(null);
    dispatch(loginStart());

    axios
      .post('/api/v1/user/signin', formData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        dispatch(loginSuccess(res.data));
        navigate('/');
      })
      .catch((error) => {
        const serverErrorMessage = error.response?.data?.message || error.message;
        setLocalErrorMessage(serverErrorMessage);
        dispatch(loginFailure(serverErrorMessage));
      });
  };

  return (
    <div className='mt-10 m-auto p-5 w-full max-w-lg rounded-lg flex flex-col items-center justify-center shadow-lg text-black'>
      <span className='bg-clip-text text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-blue-900 mb-4'>
        Welcome back, Signin
      </span>

      <div className='flex items-center p-5 rounded-lg w-full shadow-md' style={{ backgroundColor: '#F5F7F8' }}>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
          <div className="flex flex-col gap-2">
            <label htmlFor="userName" className='font-medium text-gray-700'>
              User ID
            </label>
            <input
              type="text"
              placeholder="johnsmith123"
              id="userName"
              ref={userName}
              autoComplete="username"
              className='p-3 rounded-lg border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="emailID" className='font-medium text-gray-700'>
              Email ID
            </label>
            <input
              type="email"
              placeholder="johnsmith@xyz.com"
              id="emailID"
              ref={emailID}
              autoComplete="email"
              className='p-3 rounded-lg border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className='font-medium text-gray-700'>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              id="password"
              ref={password}
              autoComplete="current-password"
              className='p-3 rounded-lg border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`p-3 rounded-lg text-white font-semibold transition w-full ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Loading...' : 'Signin'}
          </button>

          <OAuth />
        </form>
      </div>

      {localErrorMessage && (
        <div className="mt-4 p-3 bg-red-200 text-red-800 border border-red-400 rounded-lg">
          {localErrorMessage}
        </div>
      )}

      <div className='mt-6 text-gray-700'>
        <span>New to</span>
        <Link to="/about" className="ml-2 text-indigo-600 font-semibold hover:underline">
          Thought Flow
        </Link>
        <span>?</span>
        <Link to="/signup" className="ml-2 text-indigo-600 font-semibold hover:underline">
          Register Me
        </Link>
      </div>
    </div>
  );
}

export default SignIn;
