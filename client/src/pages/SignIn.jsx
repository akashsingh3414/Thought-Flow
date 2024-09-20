import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function SignIn() {
  const [loggedIn, setLogin] = useState(false);

  const [formData, setFormData] = useState({
    userID: '',
    fullName: '',
    emailID: '',
    password: '',
  });

  const userID = useRef(null);
  const emailID = useRef(null);
  const password = useRef(null);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      userID: userID.current.value,
      emailID: emailID.current.value,
      password: password.current.value,
    });
    setLogin(true);
    navigate('/');
  };

  return (
    !loggedIn ? (
      <div className='mt-10 m-auto p-5 h-auto w-1/2 rounded-lg flex flex-col items-center justify-center bg-blue-100 shadow-lg'>
        <span className='bg-clip-text text-xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-blue-900'>
          Welcome back, Login
        </span>

        <div className='flex items-center mt-5 p-5 rounded w-full bg-white shadow-md'>
          <form onSubmit={handleLogin} className='flex flex-col space-y-4 w-full'>
            <div className='flex items-center gap-5 w-full'>
              <label htmlFor="userID" className='w-1/3 font-medium text-gray-700'>User ID</label>
              <input 
                type="text" 
                placeholder='johnsmith123' 
                id='userID'
                ref={userID}
                defaultValue={formData.userID}
                autoComplete="username"
                className='p-2 rounded border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
                required
              />
            </div>

            <div className='flex items-center gap-5 w-full'>
              <label htmlFor="emailID" className='w-1/3 font-medium text-gray-700'>Email ID</label>
              <input 
                type="email" 
                placeholder='johnsmith@xyz.com' 
                id='emailID'
                ref={emailID} 
                defaultValue={formData.emailID}
                autoComplete="email"
                className='p-2 rounded border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
                required
              />
            </div>

            <div className='flex items-center gap-5 w-full'>
              <label htmlFor="password" className='w-1/3 font-medium text-gray-700'>Password</label>
              <input 
                type="password" 
                placeholder='Enter your password' 
                id='password'
                ref={password} 
                defaultValue={formData.password}
                autoComplete="password"
                className='p-2 rounded border border-gray-300 text-black w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
                required
              />
            </div>

            <button type='submit' className='p-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition-colors w-full'>
              Login
            </button>
          </form>
        </div>
        <div>
          <span>New to</span>
          <Link to='/' className='ml-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-900'>
            Though Flow
          </Link>
          <span>?</span>
          <Link to='/signup' className='ml-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-900'>
            Register Me
          </Link>
        </div>
      </div>
    ) : null
  );
}

export default SignIn;