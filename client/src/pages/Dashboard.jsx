import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import Profile from '../components/Dashboard/Profile';
import Settings from '../components/Dashboard/Settings';
import CreatePosts from '../components/Dashboard/CreatePosts';
import ShowAllPosts from '../components/Dashboard/ShowAllPosts';
import ShowAllUsers from '../components/Dashboard/ShowAllUsers';
import ShowCurrentUserPosts from '../components/Dashboard/ShowCurrentUserPosts';
import UpdateProfile from '../components/Dashboard/UpdateProfile';
import AdminUpdateUser from '../components/Dashboard/AdminUpdateUser';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('profile');

  const tabComponents = {
    profile: <Profile />,
    updateProfile: <UpdateProfile />,
    'update-user': <AdminUpdateUser />,
    createPosts: <CreatePosts />,
    myPosts: <ShowCurrentUserPosts />,
    allPosts: <ShowAllPosts />,
    allUsers: <ShowAllUsers />,
    settings: <Settings />,
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl && tabComponents[tabFromUrl]) {
      setTab(tabFromUrl);
    } else {
      setTab('profile');
    }
  }, [location.search]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow overflow-hidden">
        <aside className="md:w-64 w-1/4 bg-white shadow-lg rounded-lg flex-shrink-0">
          <Sidebar />
        </aside>

        <div className="flex-grow bg-white rounded-lg shadow-lg overflow-auto">
          {tabComponents[tab] || <Profile />}
        </div>
      </div>
    </div>
  );
}
