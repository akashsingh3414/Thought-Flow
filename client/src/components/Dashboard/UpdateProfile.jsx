import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginSuccess, logoutStart } from '../../redux/user/userSlice';

function UpdateProfile() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [localErrorMessage, setLocalErrorMessage] = useState(null);
  const [localSuccessMessage, setSuccessMessage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    userName: '',
    fullName: '',
    emailID: '',
    bio: ''
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get('tab') || 'profile';
    setActiveTab(tabUrl);

    if (currentUser && currentUser.user) {
      setFormData({
        userName: currentUser.user.userName || '',
        fullName: currentUser.user.fullName || '',
        emailID: currentUser.user.emailID || '',
        bio: currentUser.user.bio || ''
      });
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

    setImageLoading(true);
    const formData = new FormData();
    formData.append('file', profilePhoto);

    try {
      const res = await axios.patch('/api/v1/user/updateProfilePhoto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if(res.status === 401 ) {
        dispatch(logoutStart())
      }
      setImageLoading(false);
      dispatch(loginSuccess(res.data));
      setSuccessMessage(res.data.message);
    } catch (error) {
      setImageLoading(false);
      setLocalErrorMessage(error.response.data.message);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const updateData = {
      ...formData,
      oldPassword: oldPassword,
      newPassword: newPassword
    };

    try {
      const res = await axios.patch('/api/v1/user/update', updateData, {
        headers: { 'Content-Type': 'application/json' },
        params: { userId: currentUser.user._id }
      });
      setLoading(false);
      setFormData({
        userName: res.data.user.userName,
        fullName: res.data.user.fullName,
        emailID: res.data.user.emailID,
        bio: res.data.user.bio
      });
      setSuccessMessage(res.data.message);
      dispatch(loginSuccess(res.data));
      setIsEditing(false);
    } catch (error) {
      setLoading(false);
      setLocalErrorMessage(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await axios.delete(`/api/v1/user/delete?userId=${currentUser.user._id}`, {
        data: { password: 'userPassword' }
      });
      dispatch(logoutStart());
      setSuccessMessage(res.data.message);
      setDeleting(false);
      navigate('/home');
    } catch (error) {
      setDeleting(false);
      setLocalErrorMessage(error.response?.data?.message || 'Error deleting account');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-[#F5F7F8]">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg text-black p-8">
        <div className="flex items-center justify-center mb-6">
          <img
            src={currentUser?.user?.profilePhoto}
            alt="Profile"
            className="h-32 w-32 border-4 border-blue-400 rounded-full object-cover shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg';
            }}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Upload Profile Photo</label>
          <input type="file" onChange={(e) => setProfilePhoto(e.target.files[0])} className="w-full p-2 rounded border bg-gray-100 text-black" />
          <button onClick={handleProfilePhotoUpload} className="mt-4 w-full py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out shadow">
            {imageLoading ? 'Setting you up...' : 'Upload Photo'}
          </button>
        </div>

        {[
          { label: 'User Name', name: 'userName' },
          { label: 'Full Name', name: 'fullName' },
          { label: 'Bio', name: 'bio' },
          { label: 'Email', name: 'emailID' }
        ].map((field, index) => (
          <div className="mb-4" key={index}>
            <label className="block text-sm font-semibold mb-2">{field.label}</label>
            <input
              type={field.name === 'emailID' ? 'email' : 'text'}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full p-3 rounded border bg-gray-100 text-black focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
              disabled={!isEditing && field.name !== 'userName'}
            />
          </div>
        ))}

        {isEditing && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                placeholder="Old Password Required for Update"
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-3 rounded border bg-gray-100 text-black focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                placeholder="Optional (Only if changing password)"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 rounded border bg-gray-100 text-black focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
              />
            </div>
          </>
        )}

        <div className="flex justify-between mt-6">
          {isEditing ? (
            <button onClick={handleSave} className="bg-green-500 w-full text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 ease-in-out shadow">
              {loading ? 'Saving details...' : 'Save'}
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg-gray-500 w-full text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300 ease-in-out shadow">
              Edit Account Details
            </button>
          )}
        </div>

        <div className="flex justify-between mt-6 gap-4">
          <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 ease-in-out shadow w-full" onClick={() => setConfirmDelete(true)}>
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
          <button onClick={handleLogout} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out shadow w-full">
            Log Out
          </button>
        </div>

        {confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg text-center">
              <h3 className="text-xl mb-4">Are you sure you want to delete your account?</h3>
              <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full">
                Confirm Delete
              </button>
              <button onClick={() => setConfirmDelete(false)} className="bg-white text-blue-500 py-2 px-4 rounded hover:bg-blue-500 hover:text-white w-full border mt-4">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateProfile;
