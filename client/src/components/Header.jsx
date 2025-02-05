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
      <div className="px-2 py-3">
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
        className="block px-4 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-800 hover:text-white"
        onClick={toggleOptions}
      >
        Dashboard
      </Link>

      <button
        onClick={onLogout}
        className="w-full px-4 py-2 text-sm rounded-lg text-red-600 hover:bg-red-500 hover:text-white"
      >
        Logout
      </button>
    </div>
  </div>
);

const SearchInput = ({ searchTerm, setSearchTerm, handleSearch }) => (
  <form className="relative flex-1 max-w-72" onSubmit={handleSearch}>
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 pr-4 py-2 w-full border border-gray-300 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-lg bg-opacity-60"
      style={{ backdropFilter: 'blur(10px)' }}
    />
    <AiOutlineSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
  </form>
);

function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { currentUser } = useSelector((state) => state.user);
  const [profileOptions, setProfileOptions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const isActive = useCallback(
    (path) => (pathname === path ? 'text-indigo-700 text-md font-semibold' : ''),
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
      const res = await axios.post('/api/v1/user/logout');
      if(res.status === 200) {
        dispatch(logoutStart())
        navigate('/');
      }
    } catch (error) {
      dispatch(logoutStart());
      console.error(error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/posts?${searchQuery}`);
  };

  useEffect(() => {
    if (currentUser) {
      setProfileOptions(false);
    }
  }, [currentUser, currentUser?.user]);

  return (
    <header className="flex justify-between items-center h-16 p-4 bg-gray-200 bg-opacity-80 backdrop-blur-lg shadow-md rounded-lg fixed top-0 left-0 right-0 z-20">
      <Link to="/" className="flex items-center space-x-2 text-xl sm:text-2xl md:text-3xl font-bold text-indigo-700">
        <span>Thought Flow</span>
      </Link>

      <div className="flex items-center space-x-4 flex-grow justify-end">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />

        <nav className="hidden lg:flex space-x-6">
          <Link className={`hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md ${isActive('/')} text-gray-800`} to="/">
            Home
          </Link>
          <Link className={`hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md ${isActive('/about')} text-gray-800`} to="/about">
            About
          </Link>
        </nav>

        <div className="relative">
          {currentUser && currentUser?.user ? (
            <>
              <button
                className="w-10 h-10 rounded-full overflow-hidden hover:bg-gray-200"
                onClick={toggleProfileOptions}
                aria-label="Profile Options"
              >
                <img
                  src={currentUser?.user?.profilePhoto}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg';
                  }}
                />
              </button>

              {profileOptions && (
                <ProfileOptions user={currentUser?.user} toggleOptions={toggleProfileOptions} onLogout={handleLogout} />
              )}
            </>
          ) : (
            <Link to="/signin">
              <button className={`px-4 py-2 text-gray-800 hover:bg-gray-700 hover:text-white rounded-md ${isActive('/signin')}`}>
                Sign In
              </button>
            </Link>
          )}
        </div>

        <button className="lg:hidden h-10 w-10 flex items-center justify-center" onClick={toggleMenuOptions}>
          <GiHamburgerMenu className="text-2xl text-gray-800" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute right-4 top-16 bg-gray-200 bg-opacity-95 backdrop-blur-lg shadow-md rounded-lg py-2 px-2 flex flex-col space-y-1 lg:hidden">
          <Link className={`hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md ${isActive('/')} text-gray-800`} to="/" onClick={toggleMenuOptions}>
            Home
          </Link>
          <Link className={`hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md ${isActive('/about')} text-gray-800`} to="/about" onClick={toggleMenuOptions}>
            About
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
