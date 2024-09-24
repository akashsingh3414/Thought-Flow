import React, { useState, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logoutStart } from '../redux/user/userSlice.js';
import { toggleTheme } from '../redux/theme/themeSlice.js';

function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.theme);

  const [profileOptions, setProfileOptions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const profileRef = useRef(null);
  const menuRef = useRef(null);

  const isActive = useCallback(
    (path) => (pathname === path ? 'text-blue-500' : 'text-black'),
    [pathname]
  );

  const toggleProfileOptions = useCallback(() => {
    setProfileOptions((prev) => !prev);
  }, []);

  const toggleMenuOptions = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/v1/user/logout');
      dispatch(logoutStart());
      navigate('/home');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <header
      className={`flex justify-between items-center p-4 bg-blue-100 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'text-black'}`}
    >
      <Link to="/" className="text-xl font-bold">
      <span className={`bg-clip-text text-xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-blue-900`}>
          Thought Flow
        </span>
      </Link>


      <div className="flex items-center space-x-4">
        <form className="relative">
          <input
            type="text"
            placeholder="Search..."
            className={`pl-10 pr-4 py-2 rounded-full border text-black ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-100'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <AiOutlineSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </form>

        <nav className="hidden lg:flex space-x-4">
          <Link
            className={`hover:bg-white px-2 py-1 rounded ${isActive('/home')} ${theme === 'dark' ? 'text-white hover:text-black': 'text-black'}`}
            to="/home"
          >
            Home
          </Link>
          <Link
            className={`hover:bg-white px-2 py-1 rounded ${isActive('/about')} ${theme === 'dark' ? 'text-white hover:text-black' : 'text-black'}`}
            to="/about"
          >
            About
          </Link>
          <Link
            className={`hover:bg-white px-2 py-1 rounded ${isActive('/projects')} ${theme === 'dark' ? 'text-white hover:text-black' : 'text-black'}`}
            to="/projects"
          >
            Projects
          </Link>
        </nav>

        <button
          className="hidden sm:inline-block"
          aria-label="Toggle Theme"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </button>

        <div className="relative" ref={profileRef}>
          {currentUser ? (
            <button
              className="w-10 h-10 rounded-full overflow-hidden hover:bg-gray-200"
              onClick={toggleProfileOptions}
              aria-label="Profile Options"
            >
              <img
                className="object-cover h-full w-full"
                src={currentUser.user.profilePhoto || 'https://via.placeholder.com/150'}
                alt="Profile"
              />
            </button>
          ) : (
            <Link to="/signin" className={pathname === '/signin' ? 'hidden' : 'block'}>
              <button className={`px-2 py-1 rounded ${theme === 'dark' ? 'text-white hover:text-black hover:bg-gray-200' : 'hover:bg-gray-100'}`}>
                Sign In
              </button>
            </Link>
          )}

          {currentUser && profileOptions && (
            <div className={`absolute right-0 mt-2 w-56 bg-white border ${theme === 'dark' ? 'border-gray-700 bg-gray-900 text-white hover:text-black' : 'border-gray-200 bg-white text-black'} rounded-lg shadow-lg z-10`}>
              <ul className="text-center">
                <li className="px-4 py-3">
                  <img
                    className="rounded-full h-16 w-16 mx-auto mb-2 object-cover"
                    src={currentUser.user.profilePhoto || 'https://via.placeholder.com/150'}
                    alt="Profile"
                  />
                  <span className="block font-semibold">{currentUser.user.userName}</span>
                  <span className="block text-sm">{currentUser.user.emailID}</span>
                </li>
                <li className={`hover:bg-gray-100 px-4 py-2 ${isActive('/profile')}`}>
                  <Link to="/profile">Profile Page</Link>
                </li>
                <li className={`hover:bg-gray-100 px-4 py-2 ${isActive('/settings')}`}>
                  <Link to="/settings">Settings</Link>
                </li>
                <li className="hover:bg-gray-100 px-4 py-2">
                  <button onClick={handleLogout} className="w-full text-left text-red-500">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <button
          className="lg:hidden h-10 w-10 flex justify-center items-center"
          aria-label="Toggle Menu"
          onClick={toggleMenuOptions}
        >
          <GiHamburgerMenu className="text-2xl" />
        </button>
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className={`lg:hidden absolute top-16 right-4 bg-white shadow-md rounded-lg p-4 flex flex-col items-start space-y-2 z-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
        >
          <Link className={`hover:bg-gray-200 px-2 py-1 rounded ${isActive('/home')}`} to="/home" onClick={toggleMenuOptions}>
            Home
          </Link>
          <Link className={`hover:bg-gray-200 px-2 py-1 rounded ${isActive('/about')}`} to="/about" onClick={toggleMenuOptions}>
            About
          </Link>
          <Link className={`hover:bg-gray-200 px-2 py-1 rounded ${isActive('/projects')}`} to="/projects" onClick={toggleMenuOptions}>
            Projects
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;