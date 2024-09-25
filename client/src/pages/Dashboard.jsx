import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { loginStart, loginSuccess, logoutStart } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { theme } = useSelector((state) => state.theme.theme);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get('tab') || 'profile';
    setActiveTab(tabUrl);

    if (currentUser) {
      setUsername(currentUser.user.userName);
      setFullName(currentUser.user.fullName);
      setEmail(currentUser.user.emailID);
      setOldPassword(currentUser.user.password);
    }
  }, [location.search, currentUser]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/v1/user/logout');
      dispatch(logoutStart());
      navigate('/home');
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSave = async () => {
    const formData = {
      userName: username,
      fullName: fullName,
      emailID: email,
      oldPassword: oldPassword,
      newPassword: newPassword
    };
    try {
      const res = await axios.patch('/api/v1/user/update', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(res)
      setUsername(res.data.user.userName);
      setFullName(res.data.user.fullName);
      setEmail(res.data.user.emailID);
      dispatch(loginSuccess(res.data));
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row justify-center gap-1 w-full px-2 mt-2 mb-2 ${theme}`}>
      <div className={`flex flex-col flex-grow items-center justify-center flex-grow w-full p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-300 text-black'}`}>
        {activeTab === 'profile' && (
          <div className="w-full max-w-md p-3 rounded-md">
            <div className="flex items-center mb-4">
            <img
                src={currentUser.user.profilePhoto || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg'}
                alt="Profile"
                className="h-1/4 w-1/4 border-8 border-[lightblue] rounded-full object-cover m-auto"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg';
                }}
            />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
                disabled={true}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
                disabled={!isEditing}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
                disabled={!isEditing}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                placeholder='Enter your old password here'
                onChange={(e) => setOldPassword(e.target.value)}
                className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
                disabled={!isEditing}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                placeholder='Enter your new password here'
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
                disabled={!isEditing}
              />
            </div>
            <div className="flex justify-between mt-4">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="bg-blue-500 w-full text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-500 w-full text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                  Update Account Details
                </button>
              )}
            </div>
            <div className="flex justify-between mt-2 rounded p-2 gap-2">
              <button className='text-white hover:bg-red-700 m-auto hover:text-white w-full py-2 px-2 rounded-md bg-red-500'>Delete Account</button>
              <button
                className="text-blue-500 hover:bg-blue-500 m-auto hover:text-white w-full py-2 px-2 rounded-md bg-white"
                onClick={handleLogout}
                aria-label="Logout Button"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
