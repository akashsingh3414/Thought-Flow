import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const userName = useRef(null);
  const fullName = useRef(null);
  const emailID = useRef(null);
  const password = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      userName: userName.current.value,
      fullName: fullName.current.value,
      emailID: emailID.current.value,
      password: password.current.value,
    };

    try {
      const res = await axios.post('/api/v1/user/register', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 200) {
        navigate('/');
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error('Axios error:', error);
    }
  };

  return (
    <div className='mt-10 m-auto p-5 h-auto w-1/2 rounded-lg flex flex-col items-center justify-center bg-blue-100 shadow-lg'>
      <span className='bg-clip-text text-xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-blue-900'>
        Register Here!
      </span>

      <div className='flex items-center mt-5 p-5 rounded w-full bg-white shadow-md'>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-4 w-full'>
          <div className='flex items-center gap-5 w-full'>
            <label htmlFor='userName' className='w-1/3 font-medium text-gray-700'>User ID</label>
            <input
              type='text'
              placeholder='johnsmith123'
              id='userName'
              ref={userName}
              autoComplete='username'
              className='p-2 rounded border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>

          <div className='flex items-center gap-5 w-full'>
            <label htmlFor='emailID' className='w-1/3 font-medium text-gray-700'>Email ID</label>
            <input
              type='email'
              placeholder='johnsmith@xyz.com'
              id='emailID'
              ref={emailID}
              autoComplete='email'
              className='p-2 rounded border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>

          <div className='flex items-center gap-5 w-full'>
            <label htmlFor='fullName' className='w-1/3 font-medium text-gray-700'>Full Name</label>
            <input
              type='text'
              placeholder='John Smith'
              id='fullName'
              ref={fullName}
              autoComplete='name'
              className='p-2 rounded border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>

          <div className='flex items-center gap-5 w-full'>
            <label htmlFor='password' className='w-1/3 font-medium text-gray-700'>Password</label>
            <input
              type='password'
              placeholder='Enter your password'
              id='password'
              ref={password}
              autoComplete='new-password'
              className='p-2 rounded border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>

          <button type='submit' className='p-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition-colors w-full'>
            Register Me
          </button>
        </form>
      </div>

      <div>
        <span>Have an account?</span>
        <Link to='/signin' className='ml-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-900'>
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
