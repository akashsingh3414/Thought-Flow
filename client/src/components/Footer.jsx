import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='flex flex-col md:flex-row justify-center items-center p-6 gap-8 bg-black text-white w-full mt-5'>
      <div className='flex flex-col space-y-3 font-bold'>
        <Link to='/home'>
          <button className='hover:text-gray-400 transition'>Home</button>
        </Link>
        <Link to='/about'>
          <button className='hover:text-gray-400 transition'>About</button>
        </Link>
        <Link to='/projects'>
          <button className='hover:text-gray-400 transition'>Projects</button>
        </Link>
      </div>

      <div className='flex flex-col items-center font-bold'>
        <div className='mb-3'>Follow Us</div>
        <div className='grid grid-cols-2 gap-x-5 gap-y-2 text-sm font-semibold'>
          <a href='#' className='hover:text-gray-400 transition'>Facebook</a>
          <a href='#' className='hover:text-gray-400 transition'>Discord</a>
          <a href='#' className='hover:text-gray-400 transition'>Instagram</a>
          <a href='#' className='hover:text-gray-400 transition'>Github</a>
          <a href='#' className='hover:text-gray-400 transition'>LinkedIn</a>
          <a href='#' className='hover:text-gray-400 transition'>X (Twitter)</a>
        </div>
      </div>

      <div className='flex flex-col items-center font-bold'>
        <div className='mb-3'>Policies</div>
        <a href='#' className='text-sm font-semibold hover:text-gray-400 transition'>Privacy Policy</a>
        <a href='#' className='text-sm font-semibold hover:text-gray-400 transition'>Terms and Conditions</a>
        <a href='#' className='text-sm font-semibold hover:text-gray-400 transition'>Legal</a>
      </div>

      <div className='flex items-center'>
        <Link to='/' className='text-white text-sm sm:text-xl font-bold'>
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-100'>
            Thought Flow
          </span>
        </Link>
        <span className='ml-3 text-gray-400'>
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}

export default Footer;
