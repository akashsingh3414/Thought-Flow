import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

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
        <div className='h-full w-full p-4 flex flex-col items-center bg-gray-100 rounded-lg shadow-md'>
            <div className='w-full flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold text-gray-800'>
                    {currentUser?.user?.isAdmin ? `Welcome, Admin! ${currentUser.user.fullName}` : `Welcome, ${currentUser.user.fullName}`}
                </h2>
                <button 
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 shadow-md'
                    onClick={handleCreatePosts}
                >
                    Create New Post
                </button>
            </div>

            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {userPosts.length > 0 ? (
                    userPosts.map(post => (
                        <div key={post._id} className='bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-200'>
                            <h3 className='text-lg font-semibold text-gray-800'>{post.title}</h3>
                            <div 
                                className='text-gray-600 mt-2'
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                            />
                            <div className='flex justify-between items-center mt-4'>
                                <span className='text-sm text-gray-500'>By {post.authorName || "Anonymous"}</span>
                                <button 
                                    className='text-blue-500 hover:underline'
                                    onClick={() => navigate(`/posts/${post._id}`)}
                                >
                                    Read More
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-gray-500 text-center col-span-full'>No posts yet. Start by creating one!</p>
                )}
            </div>
        </div>
    );
}

export default DashboardUserPosts;
