import React, { useState, useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logoutStart } from '../redux/user/userSlice.js';

const ProfileOptions = ({ user, toggleOptions, onLogout }) => (
  <div className="absolute right-0 mt-2 w-48 border border-gray-200 bg-white text-black rounded-lg shadow-lg z-10">
    <div className="text-center">
      <div className="px-4 py-3">
        <img
          src={user.profilePhoto}
          alt="Profile"
          className="h-12 w-12 rounded-full object-cover m-auto"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg';
          }}
        />
        <span className="block font-semibold mt-2">{user.userName}</span>
        <span className="block text-sm text-gray-600">{user.emailID}</span>
      </div>

      <Link
        to="/dashboard"
        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
        onClick={toggleOptions}
      >
        Dashboard
      </Link>

      <button
        onClick={onLogout}
        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-500 hover:text-white"
      >
        Logout
      </button>
    </div>
  </div>
);

const SearchInput = () => (
  <form className="relative flex-1 max-w-72">
    <input
      type="text"
      placeholder="Search..."
      className="pl-10 pr-4 py-2 w-full border border-gray-300 bg-gray-100 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-lg bg-opacity-60"
      style={{ backdropFilter: 'blur(10px)' }}
    />
    <AiOutlineSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
  </form>
);

function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const [profileOptions, setProfileOptions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = useCallback((path) => (pathname === path ? 'text-indigo-500 font-semibold' : ''), [pathname]);

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

  useEffect(() => {
    if (currentUser) {
      setProfileOptions(false);
    }
  }, [currentUser]);

  return (
    <header className="flex justify-between items-center h-16 p-4 bg-white shadow-md rounded-lg fixed top-0 left-0 right-0 z-20">
      <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-indigo-700">
        <span>Thought Flow</span>
      </Link>

      <div className="flex items-center space-x-4 flex-grow justify-end">
        <SearchInput />

        <nav className="hidden lg:flex space-x-6">
          <Link className={`hover:bg-gray-100 px-4 py-2 rounded-md ${isActive('/home')} text-gray-800`} to="/home">
            Home
          </Link>
          <Link className={`hover:bg-gray-100 px-4 py-2 rounded-md ${isActive('/about')} text-gray-800`} to="/about">
            About
          </Link>
        </nav>

        <div className="relative">
          {currentUser && currentUser.user ? (
            <>
              <button
                className="w-10 h-10 rounded-full overflow-hidden hover:bg-gray-200"
                onClick={toggleProfileOptions}
                aria-label="Profile Options"
              >
                <img
                  src={currentUser.user.profilePhoto}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg';
                  }}
                />
              </button>

              {profileOptions && (
                <ProfileOptions user={currentUser.user} toggleOptions={toggleProfileOptions} onLogout={handleLogout} />
              )}
            </>
          ) : (
            <Link to="/signin">
              <button className="px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md">Sign In</button>
            </Link>
          )}
        </div>

        <button className="lg:hidden h-10 w-10 flex items-center justify-center" onClick={toggleMenuOptions}>
          <GiHamburgerMenu className="text-2xl text-gray-800" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute right-4 top-16 bg-white shadow-md rounded-lg py-2 px-2 flex flex-col space-y-1 lg:hidden">
          <Link className={`hover:bg-gray-200 px-4 py-2 rounded-md ${isActive('/home')} text-gray-800`} to="/home" onClick={toggleMenuOptions}>
            Home
          </Link>
          <Link className={`hover:bg-gray-200 px-4 py-2 rounded-md ${isActive('/about')} text-gray-800`} to="/about" onClick={toggleMenuOptions}>
            About
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;