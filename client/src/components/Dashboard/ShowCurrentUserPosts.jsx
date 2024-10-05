import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ShowCurrentUserPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`/api/v1/post/getPosts?userId=${currentUser.user._id}&limit=10`);
            if (res.status === 200) {
                setUserPosts(res.data.posts || []);
                if (res.data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.error("Error fetching posts:", error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        if (currentUser.user) {
            fetchPosts();
        }
    }, [currentUser.user]);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await axios.get(`/api/v1/post/getPosts?userId=${currentUser.user._id}&startIndex=${startIndex}&limit=10`);
            if (res.status === 200) {
                setUserPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
                if (res.data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.error("Error fetching more posts:", error.response ? error.response.data : error.message);
        }
    };

    const handleDeletePost = async (postId, postOwnerId) => {
        try {
            const res = await axios.delete(`/api/v1/post/deletePost/${postId}/${postOwnerId}/${currentUser.user._id}`);
            if (res.status === 200) {
                setUserPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
            } else {
                console.log(res.data.message);
            }
        } catch (error) {
            console.error("Error deleting post:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className='overflow-x-auto p-4'>
            {currentUser.user && userPosts.length > 0 ? (
                <>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead>
                            <tr className='bg-gray-100'>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Date created</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Date updated</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Post image</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Post title</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Category</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Delete</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Edit</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {userPosts.map((post) => (
                                <tr key={post._id} className='bg-white hover:bg-gray-50'>
                                    <td className='px-4 py-2 text-sm text-gray-700'>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className='px-4 py-2 text-sm text-gray-700'>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className='px-4 py-2'>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post?.images?.length > 0 ? post.images[0] : ''}
                                                alt={'N/A'}
                                                className='w-20 h-10 object-contain'
                                            />
                                        </Link>
                                    </td>
                                    <td className='px-4 py-2'>
                                        <Link className='font-medium text-gray-900' to={`/post/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td className='px-4 py-2 text-sm text-gray-700'>{post.category}</td>
                                    <td className='px-4 py-2'>
                                        <span
                                            onClick={() => handleDeletePost(post._id, post.userId)}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </td>
                                    <td className='px-4 py-2'>
                                        <Link className='text-teal-500 hover:underline' to={`/update-post/${post._id}`}>
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='mt-4 text-teal-500 self-center text-sm py-2'
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>You have no posts yet!</p>
            )}
        </div>
    );
}
