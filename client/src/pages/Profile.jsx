import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function Profile({ dashUserId }) {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const fetchUser = async (userId) => {
    setLoadingUser(true);
    try {
      const response = await axios.get(`/api/v1/user/getUser?userId=${userId}`);
      if (response.status === 200) {
        const userData = response.data.users[0];
        setUser(userData);
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
    let userId = urlParams.get('userId');
    const currentTab = urlParams.get('tab');
    
    if (!userId && dashUserId) {
      console.log('hello')
      userId = dashUserId;
    }

    if (userId) {
      fetchUser(userId);
      fetchPosts(userId);
    }
  }, [location.search, dashUserId]);

  if (loadingUser || loadingPosts) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
        <img
          className="w-32 h-32 rounded-full object-cover mb-4"
          src={user.profilePhoto || '/default-profile.png'}
          alt={user.fullName || 'User'}
        />
        <p className="text-xl text-gray-800">{user.userName || 'N/A'}</p>
        <h1 className="text-3xl font-semibold text-gray-800">{user.fullName || 'N/A'}</h1>
        {user.bio && (
          <p className="text-gray-600 mt-2">{user.bio}</p>
        )}
        <div className="text-gray-500 mt-2">
          <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800">Recent Posts</h2>
        {posts.length > 0 ? (
          <div className="mt-4 space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white p-4 rounded-lg shadow-md">
                <Link to={`/post/${post._id}`} className="text-indigo-600 font-semibold text-lg">
                  {post.title}
                </Link>
                <div className="text-gray-500 text-sm mt-1">
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span> •{' '}
                  <span>{post.upvotes} Upvotes</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-2">No recent posts to display.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
