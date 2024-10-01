import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardProfile from '../components/DashboardProfile';
import DashboardPosts from '../components/DashboardPosts';

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
    <div className='min-h-screen flex flex-col md:flex-row transition-colors duration-300'>
      <aside className="md:w-64 w-full md:min-h-screen">
        <DashboardSidebar />
      </aside>

      <div className="container mx-auto">
          {tab === 'profile' && (
            <DashboardProfile />
          )}
          {tab === 'posts' && (
            <DashboardPosts />
          )}
      </div>
    </div>
  );
}
