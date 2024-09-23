import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logoutStart } from '../redux/user/userSlice.js';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [profileOptions, setProfileOptions] = useState(false);
  const profileRef = useRef(null);

  const isActive = (path) => (pathname === path ? 'text-blue-500' : 'text-black');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleProfileOptions = () => {
    setProfileOptions((prev) => !prev);
  };

  const handleLogout = () => {
    axios.post('/api/v1/user/logout')
      .then((res) => {
        dispatch(logoutStart());
        navigate('/home');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

        <Link className={`hidden hover:bg-gray-200 hover:rounded px-1 lg:block ${isActive('/home')} ${isActive('/')}`} to='/home'>
          <button>Home</button>
        </Link>
        <Link className={`hidden hover:bg-gray-200 hover:rounded px-1 lg:block ${isActive('/about')}`} to='/about'>
          <button>About</button>
        </Link>
        <Link className={`hidden hover:bg-gray-200 hover:rounded px-1 lg:block ${isActive('/projects')}`} to='/projects'>
          <button>Projects</button>
        </Link>

        <div className="relative" ref={profileRef}>
          {currentUser && <button 
            className='px-2 py-1 rounded hover:bg-gray-200' 
            onClick={toggleProfileOptions}
          >
            {currentUser.user.userName}
          </button>}
          {currentUser && profileOptions && (
            <div className='absolute right-0 mt-2 w-50 bg-white border border-gray-200 shadow-lg'>
              <ul>
                <li>
                  <div className='h-20 w-20 flex items-center justify-center m-auto'>
                    <img 
                      src={currentUser.user.profilePhoto || 'https://th.bing.com/th/id/OIP.xo-BCC1ZKFpLL65D93eHcgHaGe?rs=1&pid=ImgDetMain'} 
                      alt="Profile" 
                    />
                  </div>
                </li>
                <li className='px-1.5 py-2 flex justify-center'>
                  <span>{currentUser.user.userName}</span>
                </li>
                <li className='px-1.5 py-2'>
                  <span>{currentUser.user.emailID}</span>
                </li>
                <li className={`hover:bg-gray-100 px-1.5 py-2 ${isActive('/settings')}`}>
                  <Link to='/settings'><button>Settings</button></Link>
                </li>
                <li className='hover:bg-gray-100 px-1.5 py-2'>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {!currentUser && (
          <Link to='/signin'>
            <button className={`text-black hover:bg-gray-200 hover:rounded px-1 active:text-blue-500 ${pathname === '/signin' ? 'hidden' : 'block'}`}>
              Sign In
            </button>
          </Link>
        )}

        <button 
          className='lg:hidden h-10 w-10 flex justify-center items-center' 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <GiHamburgerMenu className='text-2xl' />
        </button>
      </div>

      {isMenuOpen && (
        <div className='lg:hidden absolute top-16 right-4 bg-white shadow-md rounded-lg p-4 flex flex-col items-start space-y-2'>
          <Link className={`hover:bg-gray-200 hover:rounded px-1 ${isActive('/home')} ${isActive('/')}`} to='/home' onClick={() => setIsMenuOpen(false)}>
            <button>Home</button>
          </Link>
          <Link className={`hover:bg-gray-200 hover:rounded px-1 ${isActive('/about')}`} to='/about' onClick={() => setIsMenuOpen(false)}>
            <button>About</button>
          </Link>
          <Link className={`hover:bg-gray-200 hover:rounded px-1 ${isActive('/projects')}`} to='/projects' onClick={() => setIsMenuOpen(false)}>
            <button>Projects</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
