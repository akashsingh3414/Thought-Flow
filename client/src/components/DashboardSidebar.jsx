import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardSidebar = () => {
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'profile';

  return (
    <div className="h-full p-2 md:sticky top-0 rounded-lg" style={{ backgroundColor: '#F5F7F8' }}>
      <h2 className="text-xl font-bold mb-4 text-left text-blue-800 px-4">Dashboard</h2>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            to="/dashboard?tab=profile"
            className={`block py-2 px-6 rounded-md transition-all duration-200 ${
              currentTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-700 hover:text-white'
            }`}
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard?tab=posts"
            className={`block py-2 px-6 rounded-md transition-all duration-200 ${
              currentTab === 'posts'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-700 hover:text-white'
            }`}
          >
            Posts
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard?tab=users"
            className={`block py-2 px-6 rounded-md transition-all duration-200 ${
              currentTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-700 hover:text-white'
            }`}
          >
            Users
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard?tab=comments"
            className={`block py-2 px-6 rounded-md transition-all duration-200 ${
              currentTab === 'comments'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-700 hover:text-white'
            }`}
          >
            Comments
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;
