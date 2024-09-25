import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { logoutStart } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function Profile() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get('tab') || 'profile';
    setActiveTab(tabUrl);
  }, [location.search]);

  const { theme } = useSelector((state) => state.theme.theme);
  const {currentUser} = useSelector((state) => state.user)

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
    <div className="flex flex-col md:flex-row justify-center gap-4 w-full px-5 mt-5 mb-5">
      <div className={`flex flex-col items-start flex-grow rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}>
        <ul className="flex flex-col gap-2 w-full justify-center">
          <Link
            to="/profile?tab=profile"
            className={`w-full py-2 pl-5 rounded-md ${activeTab === 'profile' ? 'bg-blue-700 text-white' : 'hover:bg-gray-200'}`}
            aria-label="Profile Tab"
          >
            Profile
          </Link>
          <Link
            to="/profile?tab=settings"
            className={`w-full py-2 pl-5 rounded-md ${activeTab === 'settings' ? 'bg-blue-700 text-white' : 'hover:bg-gray-200'}`}
            aria-label="Settings Tab"
          >
            Settings
          </Link>
          <button
            className="text-red-500 hover:bg-gray-200 w-full py-2 pl-5 rounded-md text-left"
            onClick={handleLogout}
            aria-label="Logout Button"
          >
            Logout
          </button>
        </ul>
      </div>

      <div className={`flex flex-col flex-grow items-center justify-center flex-grow w-full p-4 rounded-lg ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'light bg-gray-300 text-black'}`}>
        {activeTab === 'profile' && <div>
          <h1>{currentUser.user.userName}</h1>
          <h1>Full Name: {currentUser.user.fullName}</h1>
          <h1>Email ID: {currentUser.user.emailID}</h1>
        </div>}
        {activeTab === 'settings' && <div>Settings Content</div>}
      </div>
    </div>
  );
}

export default Profile;
