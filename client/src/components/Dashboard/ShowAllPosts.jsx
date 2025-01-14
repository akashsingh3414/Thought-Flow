import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

export default function ShowAllPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/post/getPosts?limit=10`);
            if (res.status === 200) {
                setUserPosts(res.data.posts || []);
                setShowMore(res.data.posts.length >= 10);
            }
            if(res.status === 401 ) {
                dispatch(logoutStart())
            }
        } catch (error) {
            console.error("Error fetching posts:", error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.user) {
            fetchPosts();
        }
    }, [currentUser?.user]);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await axios.get(`/api/v1/post/getPosts?startIndex=${startIndex}&limit=10`);
            if (res.status === 200) {
                setUserPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
                setShowMore(res.data.posts.length >= 10);
            }
            if(res.status === 401 ) {
                dispatch(logoutStart())
            }
        } catch (error) {
            console.error("Error fetching more posts:", error.response ? error.response.data : error.message);
        }
    };

    const handleDeletePost = async (postId, postOwnerId) => {
        try {
            const res = await axios.delete(`/api/v1/post/deletePost/${postId}/${postOwnerId}/${currentUser?.user?._id}`);
            if (res.status === 200) {
                setUserPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
            }
            if(res.status === 401 ) {
                dispatch(logoutStart())
            }
        } catch (error) {
            console.error("Error deleting post:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className='overflow-x-auto p-4'>
            {loading ? (
                <div className="flex justify-center items-center h-screen bg-gray-100">
                    <ClipLoader color={"#3b82f6"} loading={loading} size={60} />
                    <p className="ml-4 text-lg text-gray-600">Loading posts...</p>
                </div>
            ) : currentUser?.user && currentUser?.user?.isAdmin && userPosts.length > 0 ? (
                <>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead>
                            <tr className='bg-gray-100'>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Date created</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Date updated</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Post image</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Post title</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Author</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Category</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Delete</th>
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
                                            {post && post.images && post.images.length > 0 ? (
                                                <img
                                                    src={post.images[0]}
                                                    alt={post.title || 'N/A'}
                                                    className='w-20 h-10 object-contain'
                                                />
                                            ) : (
                                                <span className="text-gray-400">No Image</span>
                                            )}
                                        </Link>
                                    </td>
                                    <td className='px-4 py-2'>
                                        <Link className='font-medium text-gray-900' to={`/post/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td className='px-4 py-2'>
                                        <Link className='font-medium text-gray-900' to={`/post/${post.slug}`}>
                                            {post.authorName}
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
                <p>There are no posts yet!</p>
            )}
        </div>
    );
}
