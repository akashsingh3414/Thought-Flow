import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';

function Profile({ dashUserName }) {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {currentUser} = useSelector(state => state.user)

  const fetchUser = async (userName) => {
    setLoadingUser(true);
    try {
      const response = await axios.get(`/api/v1/user/getUser?userName=${userName}`);
      if (response.status === 200 && response.data.users.length > 0) {
        const userData = response.data.users[0];
        setUser(userData);
      } else {
        setError('User not found.');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to load user data.');
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchPosts = async (userId) => {
    setLoadingPosts(true);
    try {
      const res = await axios.get(`/api/v1/post/getPosts?userId=${userId}`);
      if (res.status === 200) {
        setPosts(res.data.posts);
      } else {
        setError('Failed to load posts.');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts.');
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    let userName = urlParams.get('userName');

    if (!userName && dashUserName) {
      userName = dashUserName;
    }

    if (userName) {
      fetchUser(userName);
    } else {
      navigate('/home');
    }
  }, [location.search, dashUserName]);

  useEffect(() => {
    if (user._id) {
      fetchPosts(user._id);
    }
  }, [user]);

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <ClipLoader color={"#3b82f6"} loading={loadingUser} size={60} />
        <p className="ml-4 text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      {user._id === currentUser.user._id ? (<div className='flex w-full justify-end'>
        <Link to={'/dashboard?tab=updateProfile'} className=' bg-gray-800 p-2 rounded text-white hover:bg-gray-600 font-semibold rounded-lg'>
          Update Profile
        </Link>
      </div>):('')}
      <div className="bg-white border-b border-black p-6 flex flex-col items-center text-center max-w-full mx-auto">
        <img
          className="w-32 h-32 rounded-full object-cover mb-4"
          src={user.profilePhoto || '/default-profile.png'}
          alt={user.fullName || 'User'}
        />
        <p className="text-xl text-gray-800">{'@'+user.userName || 'N/A'}</p>
        <h1 className="text-3xl font-semibold text-gray-800">{user.fullName || 'N/A'}</h1>
        {user.bio && (
          <p className="text-gray-600 mt-2">{user.bio}</p>
        )}
        <div className="text-gray-500 mt-2">
          <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Posts</h2>
          {user._id === currentUser.user._id && (
            <Link to="/dashboard?tab=createPost" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 rounded-lg font-semibold">
              Create Post
            </Link>
          )}
        </div>
        {loadingPosts ? (
          <div className="flex justify-center items-center h-screen bg-gray-100">
            <ClipLoader color={"#3b82f6"} loading={loadingPosts} size={60} />
            <p className="ml-4 text-lg text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {posts.map((post) => (
              <Link to={`/post/${post.slug}`} key={post.slug}>
                <PostCard post={post} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-2 mb-4">No recent posts to display.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
