import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardProfile from '../components/DashboardProfile';
import DashboardUserPosts from '../components/DashboardUserPosts';
import DashboardAllPosts from '../components/DashboardAllPosts';
import DashboardAllUsers from '../components/DashboardAllUsers';
import DashboardSettings from '../components/DashboardSettings';

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
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-300">

      <aside className="md:w-64 w-full md:min-h-screen bg-white shadow-lg rounded-lg">
        <DashboardSidebar />
      </aside>

      <div className="flex-grow container mx-auto bg-white rounded-lg shadow-lg max-w-full max-h-full h-full md:h-screen">
        {tab === 'profile' && (
          <DashboardProfile />
        )}
        {tab === 'myPosts' && (
          <DashboardUserPosts />
        )}
        {tab === 'allPosts' && (
          <DashboardAllPosts />
        )}
        {tab === 'allUsers' && (
          <DashboardAllUsers />
        )}
        {tab === 'settings' && (
          <DashboardSettings />
        )}
      </div> 
    </div>
  );
}