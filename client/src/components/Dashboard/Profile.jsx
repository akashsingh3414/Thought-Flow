import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess, logoutStart } from '../../redux/user/userSlice';

function Profile() {
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
  const [localErrorMessage, setLocalErrorMessage] = useState(null);
  const [localSuccessMessage, setSuccessMessage] = useState(null);

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
      setLocalErrorMessage(null);
      dispatch(logoutStart());
      navigate('/home');
    } catch (error) {
      setLocalErrorMessage(error.message);
    }
  };

  const handleProfilePhotoUpload = async () => {
    if (!profilePhoto) {
      alert('Please choose a profile photo first');
      return;
    }

    const formData = new FormData();
    formData.append('file', profilePhoto);

    try {
      const res = await axios.patch('/api/v1/user/updateProfilePhoto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(loginSuccess(res.data));
      setSuccessMessage(res.data.message);
    } catch (error) {
      setLocalErrorMessage(error.response.data.message);
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
      setSuccessMessage(res.data.message);
      dispatch(loginSuccess(res.data));
      setIsEditing(false);
    } catch (error) {
      console.error(error.response.data.message);
      setLocalErrorMessage(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete('/api/v1/user/delete', {
        data: { password: oldPassword },
      });
      dispatch(logoutStart());
      setSuccessMessage(res.data.message);
      navigate('/home');
    } catch (error) {
      setLocalErrorMessage(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full h-full p-2 bg-[#F5F7F8]">
      <div className="w-full max-w-md bg-white rounded-md shadow-lg text-black p-6">
        <div className="flex items-center justify-center mb-4">
          <img
            src={currentUser?.user?.profilePhoto}
            alt="Profile"
            className="h-28 w-28 border-4 border-[lightblue] rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg';
            }}
          />
        </div>

        {/* Upload Profile Photo Section */}
        <div className="mb-4">
          <label className="block mb-1">Upload Profile Photo</label>
          <input type="file" onChange={(e) => setProfilePhoto(e.target.files[0])} className="w-full p-1 rounded bg-white text-black" />
          <button onClick={handleProfilePhotoUpload} className="mt-2 w-full py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
            Upload Photo
          </button>
        </div>

        {/* Display Username */}
        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 rounded bg-white text-black" disabled />
        </div>

        {/* Display Full Name */}
        <div className="mb-4">
          <label className="block mb-1">Full Name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2 rounded bg-white text-black" disabled={!isEditing} />
        </div>

        {/* Display Email */}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded bg-white text-black" disabled={!isEditing} />
        </div>

        {/* Editing Section for Password */}
        {isEditing && (
          <>
            <div className="mb-4">
              <label className="block mb-1">Old Password</label>
              <input type="password" value={oldPassword} placeholder="Old Password Required for Update" onChange={(e) => setOldPassword(e.target.value)} className="w-full p-2 rounded bg-white text-black" />
            </div>
            <div className="mb-4">
              <label className="block mb-1">New Password</label>
              <input type="password" value={newPassword} placeholder="Optional (Only if changing password)" onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 rounded bg-white text-black" />
            </div>
          </>
        )}

        {/* Buttons for Save or Update Account */}
        <div className="flex justify-between mt-4">
          {isEditing ? (
            <button onClick={handleSave} className="bg-green-500 w-full text-white py-2 px-4 rounded hover:bg-green-600">Save</button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg-gray-500 w-full text-white py-2 px-4 rounded hover:bg-gray-600">Update Account Details</button>
          )}
        </div>

        {/* Delete Account and Logout Buttons */}
        <div className="flex justify-between mt-4 gap-2">
          <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full" onClick={() => setConfirmDelete(true)}>Delete Account</button>
          <button className="bg-white text-blue-500 py-2 px-4 rounded hover:bg-blue-500 hover:text-white w-full border" onClick={handleLogout}>Logout</button>
        </div>

        {/* Error and Success Messages */}
        {localErrorMessage && (
          <div className="mt-4 p-2 bg-red-200 text-red-800 border border-red-400 rounded-lg">
            {localErrorMessage}
          </div>
        )}
        {localSuccessMessage && (
          <div className="mt-4 p-2 bg-green-200 text-green-800 border border-green-400 rounded-lg">
            {localSuccessMessage}
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-lg font-semibold mb-4 text-center">Confirm Account Deletion</h2>
            <p className="mb-4 text-center">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="mb-4">
              <label className="block mb-1">Enter Password to Confirm</label>
              <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full p-2 rounded bg-gray-200 text-black" />
            </div>
            <div className="flex justify-between mt-4">
              <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={handleDelete}>Confirm</button>
              <button className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
