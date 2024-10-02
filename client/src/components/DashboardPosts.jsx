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
        <div className='h-full p-2 flex flex-col items-center w-full rounded-lg shadow-md' style={{ backgroundColor: '#F5F7F8' }}>
            <div className="w-full max-w-md bg-white rounded-md shadow-lg text-black p-6">
                <h2 className='text-lg text-center font-semibold mb-3 text-blue-700'>
                    {currentUser.user.isAdmin ? "Welcome, Admin!" : "Welcome!"}
                </h2>
                {currentUser?.user && (
                    <div className='flex flex-col items-center'>
                        <p className='mb-2 text-gray-600'>
                            Here, you can create new posts to share your thoughts.
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
        </div>
    );
}

export default DashboardPosts;
