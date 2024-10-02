import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';

export default function GetAllPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`/api/v1/user/getAllPosts`);
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

        if (currentUser.user.isAdmin) {
            fetchPosts();
        }
    }, [currentUser.user]);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await axios.get(`/api/v1/user/getPosts/${currentUser.user._id}?startIndex=${startIndex}`);
            if (res.status === 200) {
                setUserPosts((prev) => [...prev, ...(res.data.posts || [])]);
                if (res.data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.error("Error fetching more posts:", error.response ? error.response.data : error.message);
        }
    };

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await axios.delete(`/api/post/deletepost/${postIdToDelete}/${currentUser.user._id}`);
            if (res.status === 200) {
                setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
            } else {
                console.log(res.data.message);
            }
        } catch (error) {
            console.error("Error deleting post:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className='overflow-x-auto p-4'>
            {currentUser.user.isAdmin && userPosts.length > 0 ? (
                <>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead>
                            <tr className='bg-gray-100'>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Date updated</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Post Image</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Post title</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Category</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Owner</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Delete</th>
                                <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>Edit</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {userPosts.map((post) => (
                                <tr key={post._id} className='bg-white hover:bg-gray-50'>
                                    <td className='px-4 py-2 text-sm text-gray-700'>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className='px-4 py-2'>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post?.images?.length > 0 ? post.images[0] : ''}
                                                alt={'N/A'}
                                                className='w-20 h-10 object-cover'
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
                                        <Link to={`/post/${post.slug}`}>
                                            {post.authorName}
                                        </Link>
                                    </td>
                                    <td className='px-4 py-2'>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setPostIdToDelete(post._id);
                                            }}
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
            {showModal && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white rounded-lg p-6 shadow-lg'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500'>
                            Are you sure you want to delete this post?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <button className='bg-red-500 text-white px-4 py-2 rounded' onClick={handleDeletePost}>
                                Yes, I'm sure
                            </button>
                            <button className='bg-gray-300 text-gray-800 px-4 py-2 rounded' onClick={() => setShowModal(false)}>
                                No, cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
