import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import Profile from '../components/Dashboard/Profile';
import Settings from '../components/Dashboard/Settings';
import CreatePosts from '../components/Dashboard/CreatePosts';
import ShowAllPosts from '../components/Dashboard/ShowAllPosts';
import ShowAllUsers from '../components/Dashboard/ShowAllUsers';
import ShowCurrentUserPosts from '../components/Dashboard/ShowCurrentUserPosts';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('profile');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow transition-colors duration-300">
        <aside className="md:w-64 w-full bg-white shadow-lg rounded-lg">
          <Sidebar />
        </aside>

        <div className="flex-grow container mx-auto bg-white rounded-lg shadow-lg max-w-full md:min-h-screen">
          {tab === 'profile' && <Profile />}
          {tab === 'createPosts' && <CreatePosts />}
          {tab === 'myPosts' && <ShowCurrentUserPosts />}
          {tab === 'allPosts' && <ShowAllPosts />}
          {tab === 'allUsers' && <ShowAllUsers />}
          {tab === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
}
