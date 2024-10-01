import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardProfile from '../components/DashboardProfile';
import { useSelector } from 'react-redux';

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

  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className='min-h-screen flex flex-col md:flex-row transition-colors duration-300'>
      <aside className="md:w-64 w-full md:min-h-screen">
        <DashboardSidebar />
      </aside>

      <div className="container mx-auto">
          {tab === 'profile' && (
            <DashboardProfile />
          )}
      </div>
    </div>
  );
}
