import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path ? 'text-blue-500' : 'text-black';

  return (
    <div className='flex justify-between items-center p-4'>
      <Link to='/' className='text-sm text-black sm:text-xl font-bold dark:text-white'>
        <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-900'>
          Thought Flow
        </span>
      </Link>

      <div className='flex items-center space-x-4'>
        <form className='relative'>
          <input 
            type="text" 
            placeholder='Search...'
            className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
          <AiOutlineSearch className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500' />
        </form>

        <button className='h-10 w-10 flex justify-center items-center'>
          <FaMoon className='text-2xl' />
        </button>

        <Link className={`hidden lg:block ${isActive('/home')}`} to='/home'>
          <button>Home</button>
        </Link>
        <Link className={`hidden lg:block ${isActive('/about')}`} to='/about'>
          <button>About</button>
        </Link>
        <Link className={`hidden lg:block ${isActive('/projects')}`} to='/projects'>
          <button>Projects</button>
        </Link>

        <Link to='/signin'>
          <button className={`text-black ${pathname === '/signin' ? 'hidden' : 'block'}`}>
            Sign In
          </button>
        </Link>

        <button 
          className='lg:hidden h-10 w-10 flex justify-center items-center' 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <GiHamburgerMenu className='text-2xl' />
        </button>
      </div>

      {isMenuOpen && (
        <div className='lg:hidden absolute top-16 right-4 bg-white shadow-md rounded-lg p-4 flex flex-col items-start space-y-2'>
          <Link className={`${isActive('/home')}`} to='/home' onClick={() => setIsMenuOpen(false)}>
            <button>Home</button>
          </Link>
          <Link className={`${isActive('/about')}`} to='/about' onClick={() => setIsMenuOpen(false)}>
            <button>About</button>
          </Link>
          <Link className={`${isActive('/projects')}`} to='/projects' onClick={() => setIsMenuOpen(false)}>
            <button>Projects</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
