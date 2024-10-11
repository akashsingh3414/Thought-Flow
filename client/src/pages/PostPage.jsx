import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import ConnectionCard from '../components/ConnectionCard';
import PostCard from '../components/PostCard';
import CommentSection from '../components/CommentSection';
import { useSelector } from 'react-redux';

function PostPage() {
    const { currentUser } = useSelector(state=>state.user)
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState([]);
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const navigate = useNavigate();

    const fetchPost = async (postSlug) => {
        try {
            const res = await axios.get(`/api/v1/post/getPosts?slug=${postSlug}`);
            if (res.status === 200) {
                const fetchedPost = res.data.posts[0];
                setPost(fetchedPost);
                setLikes(fetchedPost.likes.length);
                setError(null);
            } else {
                setError(res.data?.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        }
    };

    const fetchLikes = async (postId) => {
        try {
            const res = await axios.get('/api/v1/post/likes/getLikes', { params: { postId } });
            if (res.status === 200) {
                const { likeCount, hasLiked } = res.data;
                setLikes(likeCount);
                setHasLiked(hasLiked);
                setError(null);
            } else {
                setError(res.data?.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        }
    };    

    const fetchRecentPosts = async () => {
        try {
            const res = await axios.get(`/api/v1/post/getPosts?limit=5`);
            if (res.status === 200) {
                setRecentPosts(res.data.posts);
                setError(null);
            } else {
                setError(res.data?.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchRecentPosts();
            if (postSlug) {
                await fetchPost(postSlug);
                if (post && post._id) {
                    await fetchLikes(post._id);
                }
            } else {
                navigate('/home');
            }
            setLoading(false);
        };
    
        loadData();
    }, [postSlug, navigate, post?._id]);    

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

    const handleUpvote = async (postId) => {
        try {
            const res = await axios.post('/api/v1/post/likes/updateLike', { postId });
            if (res.status === 200) {
                const { message } = res.data;
                if (message.includes('added')) {
                    setHasLiked(true);
                    setLikes((prevLikes) => prevLikes + 1);
                } else if (message.includes('removed')) {
                    setHasLiked(false);
                    setLikes((prevLikes) => Math.max(prevLikes - 1, 0));
                }
            }
        } catch (error) {
            console.error('Error while updating the like:', error);
        }
    };

    return (
        <main className="p-5 flex flex-col items-center max-w-4xl mx-auto min-h-screen">
            <h1 className="text-4xl mt-10 text-center font-semibold font-serif w-full text-gray-800 lg:text-5xl leading-tight">
                {post?.title}
            </h1>

            {post?.authorName && (
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

            <Link to={`/api/v1/post/search?category=${post?.category}`}>
                <button className="rounded-full bg-blue-500 text-white text-sm px-2 py-1 mt-4 hover:bg-blue-600 transition duration-200">
                    {post?.category}
                </button>
            </Link>

            {post?.images?.length > 0 && (
                <div className="w-full max-w-2xl mt-6">
                    <img 
                        src={post.images[0]} 
                        alt={post.title} 
                        className="w-full h-auto object-cover rounded-lg shadow-md" 
                    />
                </div>
            )}

            {post && (
                <div className="flex justify-between gap-2 border-b border-gray-300 mx-auto w-full max-w-2xl text-sm text-gray-600 mt-6 pb-3">
                    <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>Last Update: {new Date(post.updatedAt).toLocaleDateString()}</span>
                    <span>{(post.content.length / 1000).toFixed(0)} mins read</span>
                </div>
            )}

            <div className="mt-6 w-full max-w-2xl text-lg leading-relaxed text-gray-700 post-content">
                <div dangerouslySetInnerHTML={{ __html: post?.content }}></div>
            </div>

            {post && (
                <div className="m-4 p-4 max-w-4xl w-full rounded-lg">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <span className="text-lg font-medium text-gray-800 mb-4 sm:mb-0">
                            Loved Reading? Support us with a like!
                        </span>
                        {currentUser ? (<button
                            type="button"
                            className={`flex items-center justify-center px-3 py-2 font-semibold rounded-full transition duration-300 ease-in-out ${hasLiked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                            onClick={() => handleUpvote(post._id)}
                            aria-label="Like this post"
                        >
                            <span className="text-xl">&hearts;</span>
                            {<span className="ml-2 text-lg">{likes}</span>}
                        </button>) : (
                                    <div className="text-md text-gray-500 my-5">
                                        <Link
                                            to="/signin"
                                            className="m-2 bg-blue-500 px-2 py-1 rounded-lg text-white font-semibold hover:bg-blue-600"
                                        >
                                            Sign In
                                        </Link>
                                    </div>
                        )}
                    </div>
                </div>
            )}

            {post && (
                <div className='m-4 p-4 max-w-4xl w-full bg-gray-100 rounded-lg shadow-lg'>
                    <CommentSection postId={post._id} />
                </div>
            )}

            <div className='border-none gap-2 p-2 m-2 w-full h-full'>
                <h1 className='text-2xl font-bold text-left'>Recent Posts</h1>
                <div className='flex flex-row w-full'>
                    {recentPosts.length > 0 ? (
                        recentPosts.map((recentPost) => (
                            <Link key={recentPost._id} className='w-full p-1' to={`/post/${recentPost.slug}`}>
                                <PostCard post={recentPost} />
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