import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { useDispatch } from 'react-redux';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/v1/post/getPosts');
      if (res.status === 401) {
        dispatch(logoutStart())
      }
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-50">

      <div className="relative overflow-hidden bg-indigo-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Thought Flow</h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8">Let your thoughts flow. Express them freely!</p>
            <Link
              to="/posts"
              className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
            >
              Explore Posts
            </Link>
          </div>
        </div>
      </div>

       
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 border-2 border-indigo-600 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Share Your Ideas</h3>
            <p className="text-gray-600">Express your thoughts and connect with like-minded individuals in our community.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 border-2 border-indigo-600 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Engage & Discuss</h3>
            <p className="text-gray-600">Join meaningful discussions and share your perspective with others.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 border-2 border-indigo-600 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Grow Together</h3>
            <p className="text-gray-600">Learn from others and grow your knowledge through shared experiences.</p>
          </div>
        </div>
      </div>

       
      {posts && posts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Posts</h2>
            <Link
              to="/posts"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              View all posts →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link 
                key={post._id} 
                to={`/post/${post.slug}`}
                className="transform hover:-translate-y-1 transition-transform duration-200"
              >
                <PostCard post={post} />
              </Link>
            ))}
          </div>
        </div>
      )}

       
      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Share Your Thoughts?</h2>
            <p className="text-xl text-gray-600 mb-8">Join our community and start expressing yourself today.</p>
            <Link
              to="/dashboard?tab=createPost"
              className="inline-block bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Start Writing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}