import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';

function SignUp() {
  const userName = useRef(null);
  const fullName = useRef(null);
  const emailID = useRef(null);
  const password = useRef(null);

  const dispatch = useDispatch();

  const loading = useSelector((state) => state.user.loading);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const formData = {
      userName: userName.current.value,
      fullName: fullName.current.value,
      emailID: emailID.current.value,
      password: password.current.value,
    };

    dispatch(loginStart());

    axios
      .post('/api/v1/user/register', formData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        setSuccessMessage('Registration successful! Please log in with your credentials.');
        setErrorMessage('');
        dispatch(loginSuccess(response.data.user));
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
        setErrorMessage(errorMsg);
        setSuccessMessage('');
        dispatch(loginFailure(errorMsg));
      });
  };

  return (
    <div className='mt-10 m-auto p-5 w-full max-w-lg rounded-lg flex flex-col items-center justify-center shadow-lg text-black'>
      <h2 className='bg-clip-text text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-blue-900 mb-4'>Create your account here!</h2>

      <div className='flex items-center p-5 rounded-lg w-full shadow-md' style={{ backgroundColor: '#F5F7F8' }}>
        <form className='flex flex-col space-y-4 w-full' onSubmit={handleRegister}>
          <div>
            <label htmlFor='userName' className='font-medium text-gray-700'>
              User ID
            </label>
            <input
              type='text'
              id='userName'
              ref={userName}
              placeholder='johnsmith'
              required
              className='p-3 rounded-lg border border-gray-300 w-full'
            />
          </div>

          <div>
            <label htmlFor='fullName' className='font-medium text-gray-700'>
              Full Name
            </label>
            <input
              type='text'
              id='fullName'
              ref={fullName}
              placeholder='John Smith'
              required
              className='p-3 rounded-lg border border-gray-300 w-full'
            />
          </div>

          <div>
            <label htmlFor='emailID' className='font-medium text-gray-700'>
              Email ID
            </label>
            <input
              type='email'
              id='emailID'
              ref={emailID}
              placeholder='johnsmith@xyz.com'
              required
              className='p-3 rounded-lg border border-gray-300 w-full'
            />
          </div>

          <div>
            <label htmlFor='password' className='font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              id='password'
              ref={password}
              placeholder='at least 8 characters'
              required
              className='p-3 rounded-lg border border-gray-300 w-full'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`p-3 rounded-lg text-white w-full ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Registering...' : 'Sign up'}
          </button>
          <OAuth />
        </form>
      </div>

      {errorMessage && (
        <div className='mt-4 p-3 bg-red-200 text-red-800 rounded-lg'>
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className='mt-4 p-3 bg-green-200 text-green-800 rounded-lg'>
          {successMessage}
        </div>
      )}

      <div className='mt-6'>
        <span>Already have an account?</span>
        <Link to='/signin' className='ml-2 text-indigo-600 font-semibold hover:underline'>
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
