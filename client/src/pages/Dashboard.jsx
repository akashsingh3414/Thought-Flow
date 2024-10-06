import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Profile from './Profile';
import UpdateProfile from '../components/Dashboard/UpdateProfile';
import UpdatePost from "../components/Dashboard/UpdatePost";
import ShowAllUsers from "../components/Dashboard/ShowAllUsers";
import AdminUpdateUser from "../components/Dashboard/AdminUpdateUser";
import CreatePost from "../components/Dashboard/CreatePost";
import ShowCurrentUserPosts from "../components/Dashboard/ShowCurrentUserPosts";
import ShowAllPosts from "../components/Dashboard/ShowAllPosts";
import Settings from "../components/Dashboard/Settings";
import Sidebar from '../components/Dashboard/Sidebar';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('profile');
  const { currentUser } = useSelector(state => state.user);

  const tabComponents = {
    profile: <Profile dashUserId={currentUser.user._id} />,
    updateProfile: <UpdateProfile />,
    updateUser: <AdminUpdateUser />,
    updatePost: <UpdatePost />,
    createPost: <CreatePost />,
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
          {tabComponents[tab] || <Profile dashUserId={currentUser.user._id} />}
        </div>
      </div>
    </div>
  );
}
