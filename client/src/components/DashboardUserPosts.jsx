import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';

function DashboardUserPosts() {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await fetch(`/api/v1/user/getPosts/${currentUser?.user?._id}`);
                const data = await response.json();
                setUserPosts(data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        if (currentUser?.user) {
            fetchUserPosts();
        }
    }, [currentUser]);

    const handleCreatePosts = () => {
        navigate('/CreatePosts');
    };

    return (
        <div className='h-full p-2 flex flex-col items-center w-full rounded-lg shadow-md' style={{ backgroundColor: '#F5F7F8' }}>
            <h2 className='text-lg text-center font-semibold mb-3 text-blue-700'>
                {currentUser?.user?.isAdmin ? "Welcome, Admin!" : "Welcome!"}
            </h2>
            {currentUser?.user ? (
                <div className='flex flex-col items-center w-full h-full'>
                    <p className='mb-2 text-gray-600'>
                        Here, you can create new posts to share your thoughts.
                    </p>
                    <button 
                        className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 shadow-md'
                        onClick={handleCreatePosts}
                    >
                        Post New Thought
                    </button>

                    <div className='mt-4 w-full flex gap-2 justify-begin'>
                        {userPosts.length > 0 ? (
                            userPosts.map(post => (
                                <PostCard key={post._id} post={post} />
                            ))
                        ) : (
                            <p className='text-gray-500 text-center'>No posts yet. Start by creating one!</p>
                        )}
                    </div>
                </div>
            ) : (
                <p className='text-gray-600'>Please log in to see your posts.</p>
            )}
        </div>
    );
}

export default DashboardUserPosts;
