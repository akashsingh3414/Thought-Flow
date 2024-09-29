import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess, logoutStart } from '../redux/user/userSlice';

function Dashboard() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const { theme } = useSelector((state) => state.theme.theme);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get('tab') || 'profile';
    setActiveTab(tabUrl);

    if (currentUser && currentUser.user) {
      setUsername(currentUser.user.userName || '');
      setFullName(currentUser.user.fullName || '');
      setEmail(currentUser.user.emailID || '');
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

  const handleProfilePhotoUpload = async () => {
    if (!profilePhoto) {
      alert('Please choose a profile photo first')
      return;
    }

    const formData = new FormData();
    formData.append('file', profilePhoto);

    try {
      const res = await axios.patch('/api/v1/user/updateProfilePhoto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(loginSuccess(res.data));
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleSave = async () => {
    const formData = {
      userName: username,
      fullName: fullName,
      emailID: email,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      const res = await axios.patch('/api/v1/user/update', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      setUsername(res.data.user.userName);
      setFullName(res.data.user.fullName);
      setEmail(res.data.user.emailID);
      dispatch(loginSuccess(res.data));
      setIsEditing(false);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete('/api/v1/user/delete', {
        data: { password: oldPassword },
      });
      dispatch(logoutStart());
      navigate('/home');
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row justify-center gap-1 w-full px-2 mt-2 mb-2 ${theme}`}>
      <div className={`flex flex-col flex-grow items-center justify-center w-full p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-300 text-black'}`}>
        {activeTab === 'profile' && (
          <div className="w-full max-w-md p-3 rounded-md">
            <div className="flex items-center mb-4">
              <img
                src={currentUser?.user?.profilePhoto || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg'}
                alt="Profile"
                className="h-1/4 w-1/4 border-8 border-[lightblue] rounded-full object-cover m-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg';
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Upload Profile Photo</label>
              <input type="file" onChange={(e) => setProfilePhoto(e.target.files[0])} className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}/>
              <button onClick={handleProfilePhotoUpload} className={`mt-2 w-full py-2 rounded ${theme === 'dark' ? 'bg-blue-500 text-white hover:bg-blue-700' : 'bg-blue-400 text-white hover:bg-blue-600 active:bg-blue-500'}`}>
                Upload Photo
              </button>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`} disabled={true} />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`} disabled={!isEditing} />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`} disabled={!isEditing} />
            </div>

            {isEditing && (
              <>
                <div className="mb-4">
                  <label className="block mb-1">Old Password</label>
                  <input type="password" value={oldPassword} placeholder='Old Password Required for updation' onChange={(e) => setOldPassword(e.target.value)} className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`} />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">New Password</label>
                  <input type="password" value={newPassword} placeholder='Optional (only if you want to change password)' onChange={(e) => setNewPassword(e.target.value)} className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`} />
                </div>
              </>
            )}

            <div className="flex justify-between mt-4">
              {isEditing ? (
                <button onClick={handleSave} className="bg-green-500 w-full text-white py-2 px-4 rounded hover:bg-green-700">Save</button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="bg-gray-500 w-full text-white py-2 px-4 rounded hover:bg-gray-700">Update Account Details</button>
              )}
            </div>
            <div className="flex justify-between mt-4 gap-2">
              <button className='text-white hover:bg-red-700 m-auto hover:text-white w-full py-2 px-2 rounded-md bg-red-500' onClick={() => setConfirmDelete(true)}>
                Delete Account
              </button>
              <button className="text-blue-500 hover:bg-blue-500 m-auto hover:text-white w-full py-2 px-2 rounded-md bg-white" onClick={handleLogout} aria-label="Logout Button">
                Logout
              </button>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-1/3">
              <h2 className="text-lg font-semibold mb-4">Confirm Account Deletion</h2>
              <p className="mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
              <div className="mb-4">
                <label className="block mb-1">Enter Password to Confirm</label>
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`} />
              </div>
              <div className="flex justify-between mt-4">
                <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700" onClick={handleDelete}>Confirm</button>
                <button className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400" onClick={() => setConfirmDelete(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
