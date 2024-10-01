import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function DashboardPosts() {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);

    const handleCreatePosts = () => {
        navigate('/CreatePosts');
    };

    return (
        <div className='p-4 bg-blue-50 flex-1 flex-col items-center w-full rounded-lg shadow-md m-0'>
            <h2 className='text-lg text-center font-semibold mb-3 text-gray-800'>
                {currentUser.user.isAdmin ? "Welcome, Admin!" : "Welcome!"}
            </h2>
            {currentUser.user.isAdmin && (
                <div className='flex flex-col items-center rounded-lg'>
                    <p className='mb-2 text-gray-600'>
                        As an admin, you can create new posts to share your thoughts.
                    </p>
                    <button 
                        className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 shadow-md'
                        onClick={handleCreatePosts}
                    >
                        Post New Thought
                    </button>
                </div>
            )}
        </div>
    );
}

export default DashboardPosts;
