import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/user/userSlice';

const AdminUpdateUser = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    fullName: '',
    emailID: '',
    admin: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [messages, setMessages] = useState({ error: null, success: null });
  const [loading, setLoading] = useState(false);

  const fetchUser = async (userId) => {
    setLoading(true);
    setMessages({ error: null, success: null });
    try {
      const response = await axios.get(`/api/v1/user/getUser?userId=${userId}`);
      if (response.status === 200) {
        const user = response.data.users[0];
        setUserDetails(user);
        setFormData({
          userName: user.userName,
          fullName: user.fullName,
          emailID: user.emailID,
          admin: user.isAdmin
        });
      }
    } catch (error) {
      setMessages({ error: error.response?.data?.message || 'Error fetching user', success: null });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userId = urlParams.get('id');
    if (userId) fetchUser(userId);
  }, [location.search]);

  const handleSave = async () => {
    setLoading(true);
    setMessages({ error: null, success: null });

    try {
      const res = await axios.patch(`/api/v1/user/update?userId=${userDetails._id}`, formData);
      console.log(res.data.user)
      if (res.status === 200) {
        setUserDetails(prev => ({
          ...prev,
          ...formData,
          isAdmin: formData.admin
        }));

        if (userDetails._id === currentUser.user._id) {
          dispatch(loginSuccess(res.data));
        }

        setMessages({ success: res.data.message, error: null });
        setIsEditing(false);
      }
    } catch (error) {
      setMessages({ error: error.response?.data?.message || 'Error updating details', success: null });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) return <div>Loading user details...</div>;

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full h-full p-2 bg-[#F5F7F8]">
      <div className="w-full max-w-md bg-white rounded-md shadow-lg text-black p-6">
        <div className="flex items-center justify-center mb-4">
          <img
            src={userDetails?.profilePhoto || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg'}
            alt="Profile"
            className="h-28 w-28 border-4 border-[lightblue] rounded-full object-cover"
          />
        </div>

        {['userName', 'fullName', 'emailID'].map((field, index) => (
          <div className="mb-4" key={index}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type={field === 'emailID' ? 'email' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
              disabled={!isEditing}
            />
          </div>
        ))}

        <div className="mb-4 flex items-center justify-center">
          <label className="block mb-1 capitalize">Admin</label>
          <input
            type='checkbox'
            name='admin'
            checked={formData.admin}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white text-black"
            disabled={!isEditing}
          />
        </div>

        <div className="flex justify-between mt-4">
          {isEditing ? (
            <button onClick={handleSave} className="bg-green-500 w-full text-white py-2 px-4 rounded hover:bg-green-600">
              {loading ? 'Saving...' : 'Save'}
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg-gray-500 w-full text-white py-2 px-4 rounded hover:bg-gray-600">
              Update Account Details
            </button>
          )}
        </div>

        {messages.error && (
          <div className="mt-4 p-2 bg-red-200 text-red-800 border border-red-400 rounded-lg">
            {messages.error}
          </div>
        )}
        {messages.success && (
          <div className="mt-4 p-2 bg-green-200 text-green-800 border border-green-400 rounded-lg">
            {messages.success}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUpdateUser;
