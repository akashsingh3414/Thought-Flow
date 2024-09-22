import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/user/userSlice.js';

function SignIn() {
  const userName = useRef(null);
  const emailID = useRef(null);
  const password = useRef(null);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
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

    axios.post('/api/v1/user/login', formData, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then((res) => {
      if (res.status === 200) {
        dispatch(loginSuccess(res.data));
        navigate('/');
      } else {
        setLocalErrorMessage(res.data.message);
        dispatch(loginFailure(res.data.message));
      }
    })
    .catch((error) => {
      if (error.response) {
        console.log("Error response:", error.response);
        setLocalErrorMessage(error.response.data.message || "Something went wrong");
        dispatch(loginFailure(error.response.data.message || "Something went wrong"));
      } else {
        console.log("Error:", error.message);
        setLocalErrorMessage(error.message);
        dispatch(loginFailure(error.message));
      }
    });
  };

  return (
    <div className='mt-10 m-auto p-5 h-auto w-1/2 rounded-lg flex flex-col items-center justify-center bg-blue-100 shadow-lg'>
      <span className='bg-clip-text text-xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-blue-900'>
        Welcome back, Login
      </span>

      <div className='flex items-center mt-5 p-5 rounded w-full bg-white shadow-md'>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-4 w-full'>
          <div className='flex items-center gap-5 w-full'>
            <label htmlFor="userName" className='w-1/3 font-medium text-gray-700'>User ID</label>
            <input 
              type="text" 
              placeholder='johnsmith123' 
              id='userName'
              ref={userName}
              autoComplete="username"
              className='p-2 rounded border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          <div className='flex items-center gap-5 w-full'>
            <label htmlFor="emailID" className='w-1/3 font-medium text-gray-700'>Email ID</label>
            <input 
              type="email" 
              placeholder='johnsmith@xyz.com' 
              id='emailID'
              ref={emailID} 
              autoComplete="email"
              className='p-2 rounded border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          <div className='flex items-center gap-5 w-full'>
            <label htmlFor="password" className='w-1/3 font-medium text-gray-700'>Password</label>
            <input 
              type="password" 
              placeholder='Enter your password' 
              id='password'
              ref={password} 
              autoComplete="current-password"
              className='p-2 rounded border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          <button type='submit' disabled={loading} className='p-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition-colors w-full'>
            {loading && !localErrorMessage ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>

      {localErrorMessage && (
        <div className='mt-4 p-3 bg-red-200 text-red-800 border border-red-400 rounded'>
          {localErrorMessage}
        </div>
      )}

      <div>
        <span>New to</span>
        <Link to='/about' className='ml-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-900'>
          Thought Flow
        </Link>
        <span>?</span>
        <Link to='/signup' className='ml-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-900'>
          Register Me
        </Link>
      </div>
    </div>
  );
}

export default SignIn;