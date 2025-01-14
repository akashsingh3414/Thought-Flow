import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'profile';
  const { currentUser } = useSelector(state => state.user);

  return (
    <div className="h-full p-2 md:sticky top-0 rounded-lg" style={{ backgroundColor: '#F5F7F8' }}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            to={`/dashboard?tab=profile&userName=${currentUser?.user?.userName}`}
            className={`block py-2 px-6 rounded-md transition-all duration-200 ${
              currentTab === 'profile' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'
            }`}
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard?tab=createPost"
            className={`block py-2 px-6 rounded-md transition-all duration-200 ${
              currentTab === 'createPost' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'
            }`}
          >
            Create Post
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard?tab=myPosts"
            className={`block py-2 px-6 rounded-md transition-all duration-200 ${
              currentTab === 'myPosts' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'
            }`}
          >
            My Posts
          </Link>
        </li>
        {currentUser?.user?.isAdmin && (
          <>
            <li>
              <Link
                to="/dashboard?tab=allPosts"
                className={`block py-2 px-6 rounded-md transition-all duration-200 ${
                  currentTab === 'allPosts' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'
                }`}
              >
                All Blogs
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard?tab=allUsers"
                className={`block py-2 px-6 rounded-md transition-all duration-200 ${
                  currentTab === 'allUsers' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'
                }`}
              >
                All Users
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
