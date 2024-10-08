import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import ConnectionCard from '../components/ConnectionCard';
import PostCard from '../components/PostCard';
import ConnectionCard from '../components/ConnectionCard';
import PostCard from '../components/PostCard';

function PostPage() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);
    const navigate = useNavigate();

    const fetchPost = async (postSlug) => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/v1/post/getPosts?slug=${postSlug}`);
            if (res.status === 200) {
                setPost(res.data.posts[0]);
                setError(null);
            } else {
                setError(res.data?.message);
            }
        } catch (error) {
            setError(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentPosts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/v1/post/getPosts?limit=5`);
            if (res.status === 200) {
                setRecentPosts(res.data.posts);
                setError(null);
            } else {
                setError(res.data?.message);
            }
        } catch (error) {
            setError(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>{
        try {
            fetchRecentPosts();
        } catch (error) {
            
        }
    },[])

    useEffect(() => {
        if (postSlug) {
            fetchPost(postSlug);
        } else {
            navigate('/home');
        }
    }, [postSlug, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <ClipLoader color={"#3b82f6"} loading={loading} size={60} />
                <p className="ml-4 text-lg text-gray-600">Loading post...</p>
            </div>
        );
    }

    const handleAuthorProfile = (userId) => {
        navigate(`/profile?userId=${userId}`);
    };

    return (
        <main className="p-5 flex flex-col items-center max-w-4xl mx-auto min-h-screen">
            <h1 className="text-4xl mt-10 text-center font-semibold font-serif w-full text-gray-800 lg:text-5xl leading-tight">
                {post && post.title}
            </h1>

            {post && post.authorName && (
                <p className="mt-2 text-center text-gray-500 text-sm">
                    By 
                    <button 
                        className="font-medium text-gray-700 ml-1" 
                        onClick={() => handleAuthorProfile(post.userId)}
                    >
                        {post.authorName}
                    </button>
                </p>
            )}

            <Link to={`/api/v1/post/search?category=${post && post.category}`}>
                <button className="rounded-full bg-blue-500 text-white text-sm px-2 py-1 mt-4 hover:bg-blue-600 transition duration-200">
                    {post && post.category}
                </button>
            </Link>

            {post && post.images && post.images.length > 0 && (
                <div className="w-full max-w-2xl mt-6">
                    <img 
                        src={post.images[0]} 
                        alt={post.title} 
                        className="w-full h-auto object-cover rounded-lg shadow-md" 
                    />
                </div>
            )}

            <div className="flex justify-between gap-2 border-b border-gray-300 mx-auto w-full max-w-2xl text-sm text-gray-600 mt-6 pb-3">
                <span>Created: {post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span>Last Update: {post && new Date(post.updatedAt).toLocaleDateString()}</span>
                <span>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>

            <div className="mt-6 w-full max-w-2xl text-lg leading-relaxed text-gray-700 post-content">
                <div dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
            </div>
            <div className='border-none gap-2 p-2 m-2 w-full h-full'>
                <h1 className='text-2xl font-bold text-left'>Recent Posts</h1>
                <div className='flex flex-row w-full'>
                    {recentPosts && recentPosts.length > 0 ? (
                        recentPosts.map((post) => (
                            <Link key={post._id} className='w-full p-1' to={`/post/${post.slug}`}>
                                <PostCard post={post} />
                            </Link>
                        ))
                    ) : (
                        <p>No Posts to display</p>
                    )}
                </div>

            </div>
            <div className='max-w-4xl mx-auto w-full'>
                <ConnectionCard />
            </div>
        </main>
    );
}

export default PostPage;
